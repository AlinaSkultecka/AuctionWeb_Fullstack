using System.ComponentModel.DataAnnotations;

namespace Lab3_v2_Backend.Core.DTOs.Auction
{
    public class CreateAuctionDto
    {
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

        [Range(0.01, double.MaxValue, ErrorMessage = "Start price must be greater than 0.")]
        public decimal StartPrice { get; set; }
    }
}