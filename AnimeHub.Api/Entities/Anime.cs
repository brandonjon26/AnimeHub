using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnimeHub.Api.Entities
{
    [Table("Anime")]
    public class Anime
    {
        [Key]
        public long AnimeId { get; set; }
        [Required]
        [MaxLength(250)]
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;

    }
}
