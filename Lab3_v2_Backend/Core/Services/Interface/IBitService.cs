using Lab3_v2_Backend.Core.DTOs.Bid;

namespace Lab3_v2_Backend.Core.Services.Interface
{
    public interface IBidService
    {
        Task<BidResponseDto?> CreateAsync(CreateBidDto dto, int userId);

        Task<bool> DeleteLatestBidAsync(int auctionId, int userId);

        Task<List<BidResponseDto>> GetByAuctionIdAsync(int auctionId);
    }
}
