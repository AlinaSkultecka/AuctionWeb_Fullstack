using Lab3_v2_Backend.Data.Entities;

namespace Lab3_v2_Backend.Data.Interfaces
{
    public interface IAuctionRepo
    {
        Task<List<Auction>> GetAllAsync();

        Task<Auction?> GetByIdAsync(int auctionId);

        // Search by book title
        Task<List<Auction>> SearchByBookTitleAsync(string bookTitle);

        // Search by author
        Task<List<Auction>> SearchByAuthorAsync(string author);

        // Filter by genre
        Task<List<Auction>> GetByGenreAsync(string genre);

        Task AddAsync(Auction auction);

        Task UpdateAsync(Auction auction);

        Task<bool> HasBidsAsync(int auctionId);

        Task<Auction?> GetByIdWithUserAsync(int auctionId);

        Task DeleteAsync(Auction auction);
    }
}