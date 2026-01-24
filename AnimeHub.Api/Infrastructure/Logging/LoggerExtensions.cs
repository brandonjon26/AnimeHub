using AnimeHub.Api.Entities.Enums;
using Serilog.Context;
using Serilog.Core.Enrichers;

namespace AnimeHub.Api.Infrastructure.Logging
{
    public static class LoggerExtensions
    {
        /// <summary>
        /// Wraps a logging operation with the necessary context for the AnimeHub Dashboard.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="source"></param>
        /// <param name="userId"></param>
        /// <param name="traceId"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        public static IDisposable BeginPropertyScope(this ILogger logger, LogSource source, string? userId = null, string? traceId = null, string? payload = null)
        {
            // Push each property individually and store their disposables
            var disposables = new List<IDisposable>
            {
                LogContext.PushProperty("LogSourceId", (int)source),
                LogContext.PushProperty("UserId", userId ?? string.Empty),
                LogContext.PushProperty("TraceId", traceId ?? string.Empty),
                LogContext.PushProperty("Payload", payload ?? string.Empty)
            };

            return new CompositeDisposable(disposables);
        }

        // A simple helper to dispose of multiple items in one go
        private class CompositeDisposable(IEnumerable<IDisposable> disposables) : IDisposable
        {
            public void Dispose()
            {
                foreach (var disposable in disposables)
                {
                    disposable.Dispose();
                }
            }
        }
    }
}
