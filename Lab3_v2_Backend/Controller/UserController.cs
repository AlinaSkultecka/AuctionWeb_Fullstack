using Lab3_v2_Backend.Core.DTOs;
using Lab3_v2_Backend.Core.DTOs.User;
using Lab3_v2_Backend.Core.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace Lab3_v2_Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // -------------------- REGISTER --------------------

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto dto)
        {
            try
            {
                var result = await _userService.RegisterAsync(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // -------------------- LOGIN --------------------

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUserDto dto)
        {
            var result = await _userService.LoginAsync(dto);

            if (result == null)
                return Unauthorized("Invalid username or password.");

            return Ok(result);
        }

        // -------------------- GET ALL USERS (ADMIN) --------------------

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllAsync();
            return Ok(users);
        }

        // -------------------- UPDATE PASSWORD --------------------

        [Authorize]
        [HttpPut("update-password")]
        public async Task<IActionResult> UpdatePassword(UpdatePasswordDto dto)
        {
            try
            {
                int userId = int.Parse(User.FindFirst("id")!.Value);

                await _userService.UpdatePasswordAsync(userId, dto);

                return Ok("Password updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // -------------------- DELETE USER --------------------
        [Authorize]
        [HttpDelete("me")]
        public async Task<IActionResult> DeleteMyself()
        {
            int userId = int.Parse(User.FindFirst("id")!.Value);

            var success = await _userService.DeleteAsync(userId);

            if (!success)
                return NotFound();

            return Ok("Your account has been deleted.");
        }

        // -------------------- DEACTIVATE and REACTIVATE USER (ADMIN) --------------------

        [Authorize(Roles = "Admin")]
        [HttpPut("deactivate/{userId:int}")]
        public async Task<IActionResult> Deactivate(int userId)
        {
            var success = await _userService.DeactivateAsync(userId);

            if (!success)
                return NotFound();

            return Ok("User deactivated.");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("reactivate/{userId:int}")]
        public async Task<IActionResult> Reactivate(int userId)
        {
            var success = await _userService.ReactivateAsync(userId);

            if (!success)
                return NotFound();

            return Ok("User reactivated.");
        }

        //-------------------- UPLOAD PHOTO --------------------

        [Authorize]
        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            int userId = int.Parse(User.FindFirst("id")!.Value);

            var result = await _userService.UploadPhotoAsync(userId, file);

            if (result == null)
                return BadRequest("Upload failed.");

            return Ok(new { photoUrl = result });
        }
    }
}
