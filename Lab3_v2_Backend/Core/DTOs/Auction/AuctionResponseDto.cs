using Lab3_v2_Backend.Core.DTOs.Bid;

namespace Lab3_v2_Backend.Core.DTOs.Auction
{
    public class AuctionResponseDto
    {
        public int AuctionId { get; set; }
        public int UserId { get; set; }

        // ===== BOOK INFO =====

        public string BookTitle { get; set; } = string.Empty;

        public string Author { get; set; } = string.Empty;

        public string? Genre { get; set; }

        public string? Condition { get; set; }

        public string? ImageUrl { get; set; }

        public string Description { get; set; } = string.Empty;

        // ===== AUCTION INFO =====

        public decimal StartPrice { get; set; }

        public decimal CurrentPrice { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }

        public bool IsOpen { get; set; }

        public decimal HighestBid { get; set; }

        public string CreatorUserName { get; set; } = string.Empty;

        // ===== BIDS =====

        public List<BidResponseDto> Bids { get; set; } = new();
    }
}