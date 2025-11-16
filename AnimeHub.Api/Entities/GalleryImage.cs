using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AnimeHub.Api.Entities.Enums;

namespace AnimeHub.Api.Entities
{
    [Table("GalleryImage")]
    public class GalleryImage
    {        
        [Key] // Primary Key (using 'long' for future scalability)
        public long GalleryImageId { get; set; }

        [Required]
        [MaxLength(500)]        
        public string ImageUrl { get; set; } = string.Empty; // Path to the image file (e.g., /images/ayami/standard/1.png)

        [Required]
        [MaxLength(200)]
        public string AltText { get; set; } = string.Empty;  
        
        public bool IsFeatured { get; set; } = false; // Flag to easily select images for the "Featured Photos" section

        public bool IsMatureContent { get; set; } = false;  // Flag to denote mature/18+ content

        [Required] // Foreign Key property (stores the int value from the enum)
        public int GalleryImageCategoryId { get; set; }       
        
        [ForeignKey(nameof(GalleryImageCategoryId))] // Navigation property to the lookup table
        public GalleryImageCategory? Category { get; set; }

        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

        public DateTime DateModified { get; set; } = DateTime.UtcNow;

        [NotMapped] // Add a non-mapped property for code logic if needed
        public GalleryImageCategoryEnum CategoryType
        {
            get => (GalleryImageCategoryEnum)GalleryImageCategoryId;
            set => GalleryImageCategoryId = (int)value;
        }
    }
}
