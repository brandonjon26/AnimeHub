using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Auth
{
    public record LoginDto
    {
        // UNIFIED LOGIN FIELD: Accepts either the Username or the Email
        [Required(ErrorMessage = "Username or Email is required.")]
        public string LoginIdentifier { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
    }
}
