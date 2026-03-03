using System.ComponentModel.DataAnnotations;

namespace Lab3_v2_Backend.Core.DTOs.Bid
{
    public class CreateBidDto
    {
        [Required]
        public int AuctionId { get; set; }

        [Required]
        public decimal Amount { get; set; }
    }
}
