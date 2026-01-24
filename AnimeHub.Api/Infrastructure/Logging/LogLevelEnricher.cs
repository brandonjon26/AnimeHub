using Serilog.Core;
using Serilog.Events;
using AnimeHub.Api.Entities.Enums;

namespace AnimeHub.Api.Infrastructure.Logging
{
    public class LogLevelEnricher : ILogEventEnricher
    {
        public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
        {
            // 1. Map Serilog's internal LogEventLevel to your specific Enum values
            var customLevel = logEvent.Level switch
            {
                LogEventLevel.Verbose     => Entities.Enums.LogLevel.Verbose,     // 1
                LogEventLevel.Debug       => Entities.Enums.LogLevel.Debug,       // 2
                LogEventLevel.Information => Entities.Enums.LogLevel.Information, // 3
                LogEventLevel.Warning     => Entities.Enums.LogLevel.Warning,     // 4
                LogEventLevel.Error       => Entities.Enums.LogLevel.Error,       // 5
                LogEventLevel.Fatal       => Entities.Enums.LogLevel.Fatal,       // 6
                _                         => Entities.Enums.LogLevel.None         // 0
            };

            // 2. Special Logic: If the log is 'Fatal' but contains a 'Critical' flag, 
            // or if you want Microsoft's "LogCritical" to map to your ID 7:
            // Note: Microsoft.Extensions.Logging.LogLevel.Critical usually maps to Serilog's Fatal.

            // 3. Add the property to the log event
            logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("LogLevelId", (int)customLevel));
        }
    }
}
