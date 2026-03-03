using Lab3_v2_Backend.Data.Entities;

namespace Lab3_v2_Backend.Data.Interfaces
{
    public interface IBidRepo
    {
        // Add new bid
        Task AddAsync(Bid bid);

        // Get all bids for an auction
        Task<List<Bid>> GetByAuctionIdAsync(int auctionId);

        // Get highest bid for auction
        Task<Bid?> GetHighestBidAsync(int auctionId);

        // Get latest bid for auction (used for delete rule VG)
        Task<Bid?> GetLatestBidAsync(int auctionId);

        // Delete a bid
        Task DeleteAsync(Bid bid);

        // Check if auction has bids
        Task<bool> HasBidsAsync(int auctionId);
        Task<Bid?> GetByIdWithUserAsync(int bidId);

    }
}

