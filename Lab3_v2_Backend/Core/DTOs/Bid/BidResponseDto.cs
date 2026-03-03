namespace Lab3_v2_Backend.Core.DTOs.Bid
{
    public class BidResponseDto
    {
        public int BidId { get; set; }

        public int AuctionId { get; set; }

        public decimal Amount { get; set; }

        public DateTime BidDate { get; set; }

        public int UserId { get; set; }

        public string UserName { get; set; } = string.Empty;
    }
}
