using AutoMapper;
using Lab3_v2_Backend.Core.DTOs;
using Lab3_v2_Backend.Data.Entities;
using Lab3_v2_Backend.Data.Interfaces;
using Lab3_v2_Backend.Core.DTOs.Auction;
using Lab3_v2_Backend.Core.Services.Interface;

namespace Lab3_v2_Backend.Core.Services
{
    public class AuctionService : IAuctionService
    {
        private const int AuctionDurationDays = 1;

        private readonly IAuctionRepo _auctionRepo;
        private readonly IMapper _mapper;

        public AuctionService(IAuctionRepo auctionRepo, IMapper mapper)
        {
            _auctionRepo = auctionRepo;
            _mapper = mapper;
        }

        // -------------------- GET ALL --------------------

        public async Task<List<AuctionResponseDto>> GetAllAsync()
        {
            var auctions = await _auctionRepo.GetAllAsync();

            var result = auctions.Select(a =>
            {
                var dto = _mapper.Map<AuctionResponseDto>(a);

                dto.HighestBid = a.Bids.Any()
                    ? a.Bids.Max(b => b.Amount)
                    : a.StartPrice;

                dto.IsOpen = a.EndDate > DateTime.UtcNow && a.IsActive;

                dto.CreatorUserName = a.User.UserName;

                return dto;
            }).ToList();

            return result;
        }

        // -------------------- GET BY ID --------------------

        public async Task<AuctionResponseDto?> GetByIdAsync(int auctionId)
        {
            var auction = await _auctionRepo.GetByIdAsync(auctionId);

            if (auction == null)
                return null;

            var dto = _mapper.Map<AuctionResponseDto>(auction);

            dto.HighestBid = auction.Bids.Any()
                ? auction.Bids.Max(b => b.Amount)
                : auction.StartPrice;

            dto.IsOpen = auction.EndDate > DateTime.UtcNow && auction.IsActive;

            dto.CreatorUserName = auction.User.UserName;

            return dto;
        }

        // -------------------- SEARCH --------------------
        public async Task<List<AuctionResponseDto>> SearchAsync(
            string? bookTitle,
            string? author,
            string? genre,
            bool? isActive)
        {
            var auctions = await _auctionRepo.GetAllAsync();

            var now = DateTime.UtcNow;

            // Filter by BookTitle
            if (!string.IsNullOrWhiteSpace(bookTitle))
                auctions = auctions
                    .Where(a => a.BookTitle.Contains(bookTitle))
                    .ToList();

            // Filter by Author
            if (!string.IsNullOrWhiteSpace(author))
                auctions = auctions
                    .Where(a => a.Author.Contains(author))
                    .ToList();

            // Filter by Genre
            if (!string.IsNullOrWhiteSpace(genre))
                auctions = auctions
                    .Where(a => a.Genre == genre)
                    .ToList();

            // Filter by Active/Open
            if (isActive.HasValue)
            {
                if (isActive.Value)
                {
                    auctions = auctions
                        .Where(a => a.EndDate > now && a.IsActive)
                        .ToList();
                }
                else
                {
                    auctions = auctions
                        .Where(a => a.EndDate <= now || !a.IsActive)
                        .ToList();
                }
            }

            return await GetMappedAuctions(auctions);
        }

        // -------------------- CREATE --------------------

        public async Task<AuctionResponseDto> CreateAsync(CreateAuctionDto dto, int userId)
        {
            // Business rule: Start price must be positive
            if (dto.StartPrice <= 0)
                throw new Exception("Start price must be greater than zero");

            var startDate = DateTime.UtcNow;

            // Map DTO → Entity
            var auction = _mapper.Map<Auction>(dto);

            // Set system-generated values
            auction.UserId = userId;
            auction.StartDate = startDate;
            auction.EndDate = startDate.AddDays(AuctionDurationDays);
            auction.IsActive = true;

            // IMPORTANT for book auctions
            auction.CurrentPrice = dto.StartPrice;

            await _auctionRepo.AddAsync(auction);

            // Reload with User included
            var createdAuction = await _auctionRepo.GetByIdWithUserAsync(auction.AuctionId);

            if (createdAuction == null)
                throw new Exception("Auction could not be created.");

            // Map to response DTO
            var response = _mapper.Map<AuctionResponseDto>(createdAuction);

            response.CreatorUserName = createdAuction.User.UserName;
            response.HighestBid = createdAuction.CurrentPrice;
            response.IsOpen = createdAuction.EndDate > DateTime.UtcNow && createdAuction.IsActive;

            return response;
        }


        // -------------------- UPDATE --------------------
        public async Task<bool> UpdateAsync(UpdateAuctionDto dto, int userId)
        {
            var auction = await _auctionRepo.GetByIdAsync(dto.AuctionId);

            if (auction == null)
                return false;

            if (auction.UserId != userId)
                return false;

            if (auction.EndDate < DateTime.UtcNow)
                return false;

            var hasBids = await _auctionRepo.HasBidsAsync(dto.AuctionId);

            if (hasBids && dto.StartPrice != auction.StartPrice)
                return false;

            // Book fields
            auction.BookTitle = dto.BookTitle;
            auction.Author = dto.Author;
            auction.Genre = dto.Genre;
            auction.Condition = dto.Condition;
            auction.ImageUrl = dto.ImageUrl;

            // Auction fields
            auction.Description = dto.Description;
            auction.EndDate = dto.EndDate;
            auction.StartPrice = dto.StartPrice;

            await _auctionRepo.UpdateAsync(auction);

            return true;
        }

        // -------------------DELETE-------------------------
        public async Task<bool> DeleteAsync(int auctionId, int userId)
        {
            var auction = await _auctionRepo.GetByIdAsync(auctionId);

            if (auction == null)
                return false;

            // Only creator can delete
            if (auction.UserId != userId)
                return false;

            await _auctionRepo.DeleteAsync(auction);

            return true;
        }

        // -------------------- DEACTIVATE --------------------

        public async Task<bool> DeactivateAsync(int auctionId)
        {
            var auction = await _auctionRepo.GetByIdAsync(auctionId);

            if (auction == null)
                return false;

            auction.IsActive = false;

            await _auctionRepo.UpdateAsync(auction);

            return true;
        }

        // -------------------- PRIVATE HELPER --------------------

        private async Task<List<AuctionResponseDto>> GetMappedAuctions(List<Auction> auctions)
        {
            var result = auctions.Select(a =>
            {
                var dto = _mapper.Map<AuctionResponseDto>(a);

                dto.HighestBid = a.Bids.Any()
                    ? a.Bids.Max(b => b.Amount)
                    : a.StartPrice;

                dto.IsOpen = a.EndDate > DateTime.UtcNow && a.IsActive;

                dto.CreatorUserName = a.User.UserName;

                return dto;
            }).ToList();

            return result;
        }
    }
}

