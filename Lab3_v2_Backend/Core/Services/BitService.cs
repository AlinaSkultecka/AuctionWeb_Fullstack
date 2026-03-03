using AutoMapper;
using Lab3_v2_Backend.Core.DTOs;
using Lab3_v2_Backend.Data.Entities;
using Lab3_v2_Backend.Data.Interfaces;
using Lab3_v2_Backend.Core.DTOs.Bid;
using Lab3_v2_Backend.Core.Services.Interface;

namespace Lab3_v2_Backend.Core.Services
{
    public class BidService : IBidService
    {
        private readonly IBidRepo _bidRepo;
        private readonly IAuctionRepo _auctionRepo;
        private readonly IMapper _mapper;

        public BidService(
            IBidRepo bidRepo,
            IAuctionRepo auctionRepo,
            IMapper mapper)
        {
            _bidRepo = bidRepo;
            _auctionRepo = auctionRepo;
            _mapper = mapper;
        }

        // -------------------- CREATE BID --------------------

        public async Task<BidResponseDto?> CreateAsync(CreateBidDto dto, int userId)
        {
            var auction = await _auctionRepo.GetByIdAsync(dto.AuctionId);

            if (auction == null)
                return null;

            // Auction must be active
            if (!auction.IsActive)
                return null;

            // Auction must be open
            if (auction.EndDate < DateTime.UtcNow)
                return null;

            // User cannot bid on own auction
            if (auction.UserId == userId)
                return null;

            var highestBid = await _bidRepo.GetHighestBidAsync(dto.AuctionId);

            decimal currentPrice = highestBid != null
                ? highestBid.Amount
                : auction.StartPrice;

            // Bid must be higher
            if (dto.Amount <= currentPrice)
                return null;

            var bid = _mapper.Map<Bid>(dto);
            bid.UserId = userId;
            bid.BidDate = DateTime.UtcNow;

            await _bidRepo.AddAsync(bid);

            var createdBid = await _bidRepo.GetByIdWithUserAsync(bid.BidId);

            return _mapper.Map<BidResponseDto>(createdBid);

        }

        // -------------------- DELETE LATEST BID (VG) --------------------

        public async Task<bool> DeleteLatestBidAsync(int auctionId, int userId)
        {
            var auction = await _auctionRepo.GetByIdAsync(auctionId);

            if (auction == null)
                return false;

            // Cannot delete if auction closed
            if (auction.EndDate < DateTime.UtcNow)
                return false;

            var latestBid = await _bidRepo.GetLatestBidAsync(auctionId);

            if (latestBid == null)
                return false;

            // Only the user who made latest bid can delete it
            if (latestBid.UserId != userId)
                return false;

            await _bidRepo.DeleteAsync(latestBid);

            return true;
        }

        // -------------------- GET BIDS FOR AUCTION --------------------

        public async Task<List<BidResponseDto>> GetByAuctionIdAsync(int auctionId)
        {
            var bids = await _bidRepo.GetByAuctionIdAsync(auctionId);

            return bids.Select(b => _mapper.Map<BidResponseDto>(b)).ToList();
        }
    }
}
