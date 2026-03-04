using AnimeHub.Api.Entities.Enums;
using Serilog.Core;
using Serilog.Events;
using System.Text.Json;
using FluentValidation;
using AnimeHub.Shared.Enums;
using AnimeHub.Shared.Utilities.Exceptions;

namespace AnimeHub.Api.Infrastructure.Logging
{
    public class LoggingEnricher : ILogEventEnricher
    {
        public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            SanitizeColumns(logEvent, propertyFactory);
            EnrichLogLevel(logEvent, propertyFactory);
            EnrichLogSource(logEvent, propertyFactory);
            EnrichExceptionDetails(logEvent, propertyFactory);
        }

        private void SanitizeColumns(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            string[] columnsToSanitize = { "Message", "ExceptionType", "ExceptionMessage", "StackTrace", "TraceId", "Payload", "UserId" };

            foreach (string column in columnsToSanitize)
            {
                if (!logEvent.Properties.ContainsKey(column))
                {
                    logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty(column, string.Empty));
                }
            }
        }

        private void EnrichLogLevel(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            var animeHubLevel = logEvent.Level switch
            {
                LogEventLevel.Verbose     => Shared.Enums.LogLevel.Verbose,     // 1
                LogEventLevel.Debug       => Shared.Enums.LogLevel.Debug,       // 2
                LogEventLevel.Information => Shared.Enums.LogLevel.Information, // 3
                LogEventLevel.Warning     => Shared.Enums.LogLevel.Warning,     // 4
                LogEventLevel.Error       => Shared.Enums.LogLevel.Error,       // 5
                LogEventLevel.Fatal       => Shared.Enums.LogLevel.Fatal,       // 6
                _                         => Shared.Enums.LogLevel.None         // 0
            };

            // 2. Special Logic: If the log is 'Fatal' but contains a 'Critical' flag, 
            // or if you want Microsoft's "LogCritical" to map to your ID 7:
            // Note: Microsoft.Extensions.Logging.LogLevel.Critical usually maps to Serilog's Fatal.

            logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("LogLevelId", (int)animeHubLevel));
        }

        private void EnrichLogSource(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            // If LogSourceId is ALREADY there (from your BeginPropertyScope), do nothing.
            // If it is MISSING, we map it to 'System' so the DB insert doesn't fail.
            if (!logEvent.Properties.ContainsKey("LogSourceId"))
            {
                logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("LogSourceId", (int)LogSource.System));
            }
        }

        private void EnrichExceptionDetails(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            if (logEvent.Exception == null) return;

            // If our custom exception has an inner exception we want to log THAT type and THAT stack trace for the developers.
            var ex = logEvent.Exception;
            var sourceEx = (ex is AnimeHubException && ex.InnerException != null) ? ex.InnerException : ex;

            // Standard 3 fields (Works for ANY exception, including ValidationException)
            logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("ExceptionType", sourceEx.GetType().FullName));
            logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("ExceptionMessage", sourceEx.Message));
            logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("StackTrace", sourceEx.StackTrace));

            // SPECIAL HANDLING: If it's a ValidationException, we might want to shove the 
            // specific field errors into the 'Payload' column if it's currently empty.
            if (sourceEx is ValidationException valEx)
            {
                var errors = valEx.Errors.Select(e => new { e.PropertyName, e.ErrorMessage });
                logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("Payload", JsonSerializer.Serialize(errors)));
            }
        }
    }
}
