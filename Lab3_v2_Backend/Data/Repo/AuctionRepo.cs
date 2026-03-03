using Lab3_v2_Backend.Data;
using Lab3_v2_Backend.Data.Entities;
using Lab3_v2_Backend.Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Lab3_v2_Backend.Data.Repos
{
    public class AuctionRepo : IAuctionRepo
    {
        private readonly AppDbContext _context;

        public AuctionRepo(AppDbContext context)
        {
            _context = context;
        }

        // -------------------- GET ALL --------------------

        public async Task<List<Auction>> GetAllAsync()
        {
            return await _context.Auctions
                .Include(a => a.User)
                .Include(a => a.Bids)
                    .ThenInclude(b => b.User)
                .ToListAsync();
        }

        // -------------------- GET BY ID --------------------

        public async Task<Auction?> GetByIdAsync(int auctionId)
        {
            return await _context.Auctions
                .Include(a => a.User)
                .Include(a => a.Bids)
                    .ThenInclude(b => b.User)
                .SingleOrDefaultAsync(a => a.AuctionId == auctionId);
        }

        // -------------------- SEARCH BY BOOK TITLE --------------------

        public async Task<List<Auction>> SearchByBookTitleAsync(string bookTitle)
        {
            return await _context.Auctions
                .Include(a => a.User)
                .Include(a => a.Bids)
                .Where(a => a.BookTitle.Contains(bookTitle))
                .ToListAsync();
        }

        // -------------------- SEARCH BY AUTHOR --------------------

        public async Task<List<Auction>> SearchByAuthorAsync(string author)
        {
            return await _context.Auctions
                .Include(a => a.User)
                .Include(a => a.Bids)
                .Where(a => a.Author.Contains(author))
                .ToListAsync();
        }

        // -------------------- FILTER BY GENRE --------------------

        public async Task<List<Auction>> GetByGenreAsync(string genre)
        {
            return await _context.Auctions
                .Include(a => a.User)
                .Include(a => a.Bids)
                .Where(a => a.Genre == genre)
                .ToListAsync();
        }

        // -------------------- ADD --------------------

        public async Task AddAsync(Auction auction)
        {
            await _context.Auctions.AddAsync(auction);
            await _context.SaveChangesAsync();
        }

        // -------------------- UPDATE --------------------

        public async Task UpdateAsync(Auction auction)
        {
            _context.Auctions.Update(auction);
            await _context.SaveChangesAsync();
        }

        // -------------------- DELETE --------------------

        public async Task DeleteAsync(Auction auction)
        {
            _context.Auctions.Remove(auction);
            await _context.SaveChangesAsync();
        }

        // -------------------- CHECK IF HAS BIDS --------------------

        public async Task<bool> HasBidsAsync(int auctionId)
        {
            return await _context.Bids
                .AnyAsync(b => b.AuctionId == auctionId);
        }

        // -------------------- GET BY ID WITH USER --------------------

        public async Task<Auction?> GetByIdWithUserAsync(int auctionId)
        {
            return await _context.Auctions
                .Include(a => a.User)
                .Include(a => a.Bids)
                .FirstOrDefaultAsync(a => a.AuctionId == auctionId);
        }
    }
}

