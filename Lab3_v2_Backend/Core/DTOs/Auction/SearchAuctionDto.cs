namespace Lab3_v2_Backend.Core.DTOs.Auction
{
    public class SearchAuctionDto
    {
            public string? BookTitle { get; set; }
            public string? Author { get; set; }
            public string? Genre { get; set; }
            public bool? IsActive { get; set; }
    }
}
