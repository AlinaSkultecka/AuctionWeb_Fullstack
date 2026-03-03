using Lab3_v2_Backend.Core.DTOs.Auction;
using Lab3_v2_Backend.Core.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lab3_v2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuctionController : ControllerBase
    {
        private readonly IAuctionService _auctionService;

        public AuctionController(IAuctionService auctionService)
        {
            _auctionService = auctionService;
        }

        // -------------------- GET ALL --------------------

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var auctions = await _auctionService.GetAllAsync();
            return Ok(auctions);
        }

        // -------------------- GET BY ID --------------------

        [HttpGet("{auctionId:int}")]
        public async Task<IActionResult> GetById(int auctionId)
        {
            var auction = await _auctionService.GetByIdAsync(auctionId);

            if (auction == null)
                return NotFound();

            return Ok(auction);
        }

        // -------------------- SEARCH --------------------

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] SearchAuctionDto query)
        {
            var result = await _auctionService.SearchAsync(
                query.BookTitle,
                query.Author,
                query.Genre,
                query.IsActive
            );

            return Ok(result);
        }

        // -------------------- CREATE --------------------

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreateAuctionDto dto)
        {
            int userId = int.Parse(User.FindFirst("id")!.Value);

            var created = await _auctionService.CreateAsync(dto, userId);

            return Ok(created);
        }

        // -------------------- UPDATE --------------------

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update(UpdateAuctionDto dto)
        {
            int userId = int.Parse(User.FindFirst("id")!.Value);

            var success = await _auctionService.UpdateAsync(dto, userId);

            if (!success)
                return BadRequest("Update failed.");

            return Ok("Auction updated successfully.");
        }

        // -------------------- DELETE --------------------
        [Authorize]
        [HttpDelete("{auctionId:int}")]
        public async Task<IActionResult> Delete(int auctionId)
        {
            int userId = int.Parse(User.FindFirst("id")!.Value);

            var success = await _auctionService.DeleteAsync(auctionId, userId);

            if (!success)
                return NotFound();

            return Ok("Auction deleted successfully.");
        }

        // -------------------- DEACTIVATE (ADMIN) --------------------

        [Authorize(Roles = "Admin")]
        [HttpPut("deactivate/{auctionId}")]
        public async Task<IActionResult> Deactivate(int auctionId)
        {
            var success = await _auctionService.DeactivateAsync(auctionId);

            if (!success)
                return NotFound();

            return Ok("Auction deactivated.");
        }
    }
}

