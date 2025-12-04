using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnimeHub.Api.Entities
{
    [Table("GalleryImageCategory")]
    public class GalleryImageCategory
    {        
        [Key]
        public int GalleryImageCategoryId { get; set; }

        [Required]
        [MaxLength(100)]        
        public string Name { get; set; } = string.Empty; // The display name of the category (e.g., "Standard Anime/Isekai")
        
        public ICollection<GalleryImage> GalleryImages { get; set; } = new List<GalleryImage>(); // Navigation property for all images belonging to this category
    }
}
