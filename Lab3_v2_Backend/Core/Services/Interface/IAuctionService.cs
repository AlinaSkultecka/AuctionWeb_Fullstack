using Lab3_v2_Backend.Core.DTOs.Auction;

namespace Lab3_v2_Backend.Core.Services.Interface
{
    public interface IAuctionService
    {
        // Get all auctions
        Task<List<AuctionResponseDto>> GetAllAsync();

        // Get single auction with bids
        Task<AuctionResponseDto?> GetByIdAsync(int id);

        // Create auction (logged in user)
        Task<AuctionResponseDto> CreateAsync(CreateAuctionDto dto, int userId);

        // Update auction
        Task<bool> UpdateAsync(UpdateAuctionDto dto, int userId);

        // Delete auction
        Task<bool> DeleteAsync(int auctionId, int userId);

        // Deactivate and Reactivate auction (admin only)
        Task<bool> DeactivateAsync(int auctionId);
        Task<bool> ReactivateAsync(int auctionId);

        Task<List<AdminAuctionDto>> GetAllForAdminAsync();

        // 🔎 Advanced search for book auctions
        Task<List<AuctionResponseDto>> SearchAsync(
            string? bookTitle,
            string? author,
            string? genre,
            bool? isActive
        );
    }
}