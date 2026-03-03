using System.ComponentModel.DataAnnotations;

namespace Lab3_v2_Backend.Core.DTOs.Auction
{
    public class UpdateAuctionDto
    {
        [Required]
        public int AuctionId { get; set; }

        // ===== BOOK INFO =====

        [Required]
        [MaxLength(200)]
        public string BookTitle { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Author { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Genre { get; set; }

        [MaxLength(50)]
        public string? Condition { get; set; }

        public string? ImageUrl { get; set; }

        // ===== AUCTION INFO =====

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime EndDate { get; set; }

        public decimal StartPrice { get; set; }
    }
}
