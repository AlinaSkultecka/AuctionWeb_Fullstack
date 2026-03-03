using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab3_v2_Backend.Data.Entities
{
    public class Auction
    {
        public int AuctionId { get; set; }

        // ===== BOOK INFORMATION =====

        [Required]
        [MaxLength(200)]
        public string BookTitle { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Author { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? ISBN { get; set; }

        [MaxLength(100)]
        public string? Genre { get; set; }

        [MaxLength(50)]
        public string? Condition { get; set; } // New / Like New / Used

        public string? ImageUrl { get; set; }


        // ===== AUCTION INFORMATION =====

        [Required]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal StartPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal CurrentPrice { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        // VG requirement
        public bool IsActive { get; set; } = true;


        // ===== RELATIONSHIPS =====

        // Seller
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        // Navigation (Bids)
        public List<Bid> Bids { get; set; } = new();
    }
}
