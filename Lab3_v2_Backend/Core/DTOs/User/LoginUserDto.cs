using System.ComponentModel.DataAnnotations;

namespace Lab3_v2_Backend.Core.DTOs.User
{
    public class LoginUserDto
    {
        [Required]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
