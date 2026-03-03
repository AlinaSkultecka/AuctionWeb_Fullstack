using System.ComponentModel.DataAnnotations;

namespace Lab3_v2_Backend.Core.DTOs.User
{
    public class UpdatePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;
    }
}
