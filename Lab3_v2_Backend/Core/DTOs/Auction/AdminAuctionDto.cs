namespace Lab3_v2_Backend.Core.DTOs.Auction
{
    public class AdminAuctionDto
    {
        public int AuctionId { get; set; }
        public string Title { get; set; }
        public string OwnerUserName { get; set; }
        public bool IsActive { get; set; }
    }
}
