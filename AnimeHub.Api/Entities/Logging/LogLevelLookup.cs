using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AnimeHub.Api.Entities.Enums;
using AnimeHub.Shared.Enums;

namespace AnimeHub.Api.Entities.Logging
{
    [Table("LogLevelLookup")]
    public class LogLevelLookup
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public Shared.Enums.LogLevel LogLevelId { get; set; } // The Enum value (0, 1, 2...)

        [Required, MaxLength(50)]
        public string Description { get; set; } = string.Empty; // "Information", "Error", etc.
    }
}
