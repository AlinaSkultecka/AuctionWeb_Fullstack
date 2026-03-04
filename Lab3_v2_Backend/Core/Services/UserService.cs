using AutoMapper;
using Lab3_v2_Backend.Core.DTOs;
using Lab3_v2_Backend.Data.Entities;
using Lab3_v2_Backend.Data.Interfaces;
using Lab3_v2_Backend.Core.DTOs.User;
using Lab3_v2_Backend.Core.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Lab3_v2_Backend.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepo _userRepo;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher;

        public UserService(
            IUserRepo userRepo,
            IMapper mapper,
            IConfiguration configuration)
        {
            _userRepo = userRepo;
            _mapper = mapper;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

        // -------------------- REGISTER --------------------

        public async Task<UserResponseDto> RegisterAsync(RegisterUserDto dto)
        {
            var user = _mapper.Map<User>(dto);

            var existingUserName = await _userRepo.GetByUserNameAsync(dto.UserName);
            if (existingUserName != null)
                throw new Exception("Username already exists");

            var existingEmail = await _userRepo.GetByEmailAsync(dto.Email);
            if (existingEmail != null)
                throw new Exception("Email already exists");

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
            user.IsActive = true;
            user.IsAdmin = false;

            await _userRepo.AddUserAsync(user);

            return _mapper.Map<UserResponseDto>(user);
        }

        // -------------------- LOGIN --------------------

        public async Task<LoginResponseDto?> LoginAsync(LoginUserDto dto)
        {
            var user = await _userRepo.GetByUserNameAsync(dto.UserName);

            if (user == null)
                return null;

            if (!user.IsActive)
                return null;

            var result = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                dto.Password
            );

            if (result == PasswordVerificationResult.Failed)
                return null;

            var token = GenerateJwtToken(user);

            return new LoginResponseDto
            {
                Token = token,
                UserId = user.UserId,
                UserName = user.UserName,
                Email = user.Email,
                IsAdmin = user.IsAdmin,
                IsActive = user.IsActive,
                PhotoUrl = user.PhotoUrl
            };
        }

        // -------------------- GET ALL USERS --------------------

        public async Task<List<UserResponseDto>> GetAllAsync()
        {
            var users = await _userRepo.GetAllUsersAsync();
            return users.Select(u => _mapper.Map<UserResponseDto>(u)).ToList();
        }

        // -------------------- UPDATE PASSWORD --------------------

        public async Task<bool> UpdatePasswordAsync(int userId, UpdatePasswordDto dto)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                throw new Exception("User not found.");

            var verifyResult = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                dto.CurrentPassword
            );

            if (verifyResult == PasswordVerificationResult.Failed)
                throw new Exception("Current password is incorrect.");

            if (dto.NewPassword.Length < 6)
                throw new Exception("New password must be at least 6 characters.");

            var samePasswordCheck = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                dto.NewPassword
            );

            if (samePasswordCheck == PasswordVerificationResult.Success)
                throw new Exception("New password cannot be the same as current password.");

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.NewPassword);

            await _userRepo.UpdateUserAsync(user);

            return true;
        }

        // -------------------- DELETE (soft) USER --------------------
        public async Task<bool> DeleteAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                return false;

            user.IsActive = false;

            await _userRepo.UpdateUserAsync(user);

            return true;
        }

        // -------------------- DEACTIVATE/REACTIVATE USER --------------------

        public async Task<bool> DeactivateAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                return false;

            user.IsActive = false;

            await _userRepo.UpdateUserAsync(user);

            return true;
        }

        public async Task<bool> ReactivateAsync(int userId)
        {
            var user = await _userRepo.GetByIdAsync(userId);

            if (user == null)
                return false;

            user.IsActive = true;

            await _userRepo.UpdateUserAsync(user);

            return true;
        }

        // -------------------- JWT GENERATION --------------------

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var claims = new[]
            {
                new Claim("id", user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User")
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(3),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // -------------------- UPLOAD PHOTO --------------------
        public async Task<string?> UploadPhotoAsync(int userId, IFormFile file)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null)
                return null;

            var folderPath = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "images"
            );

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = Guid.NewGuid().ToString() +
                           Path.GetExtension(file.FileName);

            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            user.PhotoUrl = "/images/" + fileName;

            await _userRepo.UpdateUserAsync(user);

            return user.PhotoUrl;
        }
    }
}
