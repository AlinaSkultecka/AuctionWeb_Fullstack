using Lab3_v2_Backend.Data.Entities;
using Lab3_v2_Backend.Core.DTOs.User;

namespace Lab3_v2_Backend.Core.Services.Interface
{
     public interface IUserService
     {
         Task<UserResponseDto> RegisterAsync(RegisterUserDto dto);

         Task<LoginResponseDto?> LoginAsync(LoginUserDto dto);

         Task<List<UserResponseDto>> GetAllAsync();

         Task<bool> UpdatePasswordAsync(int userId, UpdatePasswordDto dto);

         Task<bool> DeactivateAsync(int userId);

         Task<bool> DeleteAsync(int userId);

         Task<string?> UploadPhotoAsync(int userId, IFormFile file);

         Task<bool> ReactivateAsync(int userId);

    }
}