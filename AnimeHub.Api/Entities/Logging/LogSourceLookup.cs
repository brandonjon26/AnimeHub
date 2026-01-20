using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AnimeHub.Api.Entities.Enums;

namespace AnimeHub.Api.Entities.Logging
{
    [Table("LogSourceLookup")]
    public class LogSourceLookup
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public LogSource LogSourceId { get; set; } // The Enum value (0, 1, 2...)

        [Required, MaxLength(50)]
        public string Description { get; set; } = string.Empty; // "WebAPI", "Scraper", etc.
    }
}
