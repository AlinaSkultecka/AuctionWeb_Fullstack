using System.ComponentModel.DataAnnotations;

namespace Lab3_v2_Backend.Data.Entities
{
    public class User
    {
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string? PhotoUrl { get; set; }

        // VG requirement
        public bool IsAdmin { get; set; } = false;

        public bool IsActive { get; set; } = true;

        // Navigation properties
        public List<Auction> Auctions { get; set; } = new();
        public List<Bid> Bids { get; set; } = new();

    }
}

