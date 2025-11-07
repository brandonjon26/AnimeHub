using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.DTOs.Auth
{
    public record RegisterDto
    {
        // PRIMARY LOGIN FIELD: Used as the unique identifier for user login (if we pivot from email)
        [Required(ErrorMessage = "Username is required.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters.")]
        public string UserName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Password must be at least 8 characters long.")]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;

        // --- Standard Profile Fields ---

        [Required(ErrorMessage = "First name is required.")]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Last name is required.")]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        // CRUCIAL FIELD for Content Filtering (18+ content)
        [Required(ErrorMessage = "Date of Birth is required for content filtering.")]
        [DataType(DataType.Date)]
        public DateOnly Birthday { get; set; }

        // Optional Field: For displaying a user's location/timezone
        [StringLength(50)]
        public string Location { get; set; } = string.Empty;

        // Server-calculated based on Birthday
        public bool IsAdult { get; }

        // Note: Adding a ConfirmPassword field is common for frontend validation, 
        // but for backend API validation, Email and Password are sufficient 
        // as ASP.NET Identity handles password constraints automatically.
    }
}
