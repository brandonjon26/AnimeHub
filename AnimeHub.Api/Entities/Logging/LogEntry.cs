using AnimeHub.Api.Entities.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnimeHub.Api.Entities.Logging
{
    [Table("LogEntry")]
    public class LogEntry
    {
        [Key]
        public long LogEntryId { get; set; }

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [Required]
        public Enums.LogLevel LogLevelId { get; set; }
        public LogLevelLookup? LogLevel { get; set; } // Navigation Property

        [Required]
        public LogSource LogSourceId { get; set; }
        public LogSourceLookup? LogSource { get; set; } // Navigation Property

        [Required]
        public string Message { get; set; } = string.Empty; // High-level description

        // --- Exception Breakdown ---
        public string? ExceptionType { get; set; }    // e.g., "System.NullReferenceException"
        public string? ExceptionMessage { get; set; } // The actual .Message property
        public string? StackTrace { get; set; }       // The full execution path

        // --- Correlation & Context ---
        public string? TraceId { get; set; }         // Links frontend request to backend log
        public string? Payload { get; set; }         // JSON request body for debugging
        public string? UserId { get; set; }          // Links to Identity User (string GUID)
    }
}
