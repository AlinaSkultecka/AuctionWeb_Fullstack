using Lab3_v2_Backend.Core.DTOs;
using Lab3_v2_Backend.Core.DTOs.Bid;
using Lab3_v2_Backend.Core.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lab3_v2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BidController : ControllerBase
    {
        private readonly IBidService _bidService;

        public BidController(IBidService bidService)
        {
            _bidService = bidService;
        }

        // -------------------- CREATE BID --------------------

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreateBidDto dto)
        {
            int userId = int.Parse(User.FindFirst("id")!.Value);

            var result = await _bidService.CreateAsync(dto, userId);

            if (result == null)
                return BadRequest("Bid not allowed.");

            return Ok(result);
        }

        // -------------------- DELETE LATEST BID (VG) --------------------

        [Authorize]
        [HttpDelete("{auctionId}")]
        public async Task<IActionResult> DeleteLatest(int auctionId)
        {
            int userId = int.Parse(User.FindFirst("id")!.Value);

            var success = await _bidService.DeleteLatestBidAsync(auctionId, userId);

            if (!success)
                return BadRequest("Cannot delete bid.");

            return Ok("Latest bid deleted.");
        }

        // -------------------- GET BIDS FOR AUCTION --------------------

        [HttpGet("{auctionId}")]
        public async Task<IActionResult> GetByAuction(int auctionId)
        {
            var bids = await _bidService.GetByAuctionIdAsync(auctionId);
            return Ok(bids);
        }
    }
}