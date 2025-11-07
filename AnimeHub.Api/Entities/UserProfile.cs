using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace AnimeHub.Api.Entities
{
    public class UserProfile
    {
        // Primary Key and Foreign Key: This column will hold the Id 
        // of the corresponding AspNetUsers record (IdentityUser).
        [Key]
        [StringLength(450)] // Must match the string length of IdentityUser.Id
        public string UserId { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        // Used for 18+ content filtering
        [Required]
        public DateOnly Birthday { get; set; }

        [StringLength(50)]
        public string Location { get; set; } = string.Empty;

        // Calculated flag for easy content filtering
        [Required]
        public bool IsAdult { get; set; }

        // --- Navigation Properties ---

        // One-to-one relationship with IdentityUser
        // [ForeignKey(nameof(UserId))] // Optional, but helps clarify
        public virtual IdentityUser? User { get; set; }
    }
}
