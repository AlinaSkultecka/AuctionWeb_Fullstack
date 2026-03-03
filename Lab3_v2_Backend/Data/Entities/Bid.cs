using System.ComponentModel.DataAnnotations.Schema;

namespace Lab3_v2_Backend.Data.Entities
{
    public class Bid
    {
        public int BidId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        public DateTime BidDate { get; set; } = DateTime.UtcNow;

        // Foreign Keys
        public int AuctionId { get; set; }
        public Auction Auction { get; set; } = null!;

        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }
}
