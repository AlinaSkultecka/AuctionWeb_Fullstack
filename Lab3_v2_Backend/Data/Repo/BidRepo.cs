using Lab3_v2_Backend.Data;
using Lab3_v2_Backend.Data.Entities;
using Lab3_v2_Backend.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Lab3_v2_Backend.Data.Repos
{
    public class BidRepo : IBidRepo
    {
        private readonly AppDbContext _context;

        public BidRepo(AppDbContext context)
        {
            _context = context;
        }

        // -------------------- ADD --------------------

        public async Task AddAsync(Bid bid)
        {
            await _context.Bids.AddAsync(bid);
            await _context.SaveChangesAsync();
        }

        // -------------------- GET ALL BIDS FOR AUCTION --------------------

        public async Task<List<Bid>> GetByAuctionIdAsync(int auctionId)
        {
            return await _context.Bids
                .Include(b => b.User)
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.Amount)
                .ToListAsync();
        }

        // -------------------- GET HIGHEST BID --------------------

        public async Task<Bid?> GetHighestBidAsync(int auctionId)
        {
            return await _context.Bids
                .Include(b => b.User)
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.Amount)
                .FirstOrDefaultAsync();
        }

        // -------------------- GET LATEST BID --------------------

        public async Task<Bid?> GetLatestBidAsync(int auctionId)
        {
            return await _context.Bids
                .Where(b => b.AuctionId == auctionId)
                .OrderByDescending(b => b.BidDate)
                .FirstOrDefaultAsync();
        }

        // -------------------- DELETE --------------------

        public async Task DeleteAsync(Bid bid)
        {
            _context.Bids.Remove(bid);
            await _context.SaveChangesAsync();
        }

        // -------------------- CHECK IF AUCTION HAS BIDS --------------------

        public async Task<bool> HasBidsAsync(int auctionId)
        {
            return await _context.Bids
                .AnyAsync(b => b.AuctionId == auctionId);
        }

        public async Task<Bid?> GetByIdWithUserAsync(int bidId)
        {
            return await _context.Bids
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.BidId == bidId);
        }
    }
}
