using AnimeHub.Api.Entities.Enums;
using Serilog.Context;
using Serilog.Core.Enrichers;
using AnimeHub.Shared.Enums;

namespace AnimeHub.Api.Infrastructure.Logging
{
    public static class LoggerExtensions
    {
        /// <summary>
        /// Wraps a logging operation with the necessary context for the AnimeHub Dashboard.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="logSourceId"></param>
        /// <param name="userId"></param>
        /// <param name="traceId"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        public static IDisposable BeginPropertyScope(this ILogger logger, LogSource logSourceId, string? userId = "", string? traceId = "", string? payload = "")
        {
            // Push each property individually and store their disposables
            List<IDisposable> disposables = new List<IDisposable>
            {
                LogContext.PushProperty("LogSourceId", (int)logSourceId),
                LogContext.PushProperty("UserId", ((!string.IsNullOrEmpty(userId)) ? userId : string.Empty)),
                LogContext.PushProperty("TraceId", ((!string.IsNullOrEmpty(traceId)) ? traceId : string.Empty)),
                LogContext.PushProperty("Payload", ((!string.IsNullOrEmpty(payload)) ? payload : string.Empty))
            };

            return new CompositeDisposable(disposables);
        }

        // A simple helper to dispose of multiple items in one go
        private class CompositeDisposable(IEnumerable<IDisposable> disposables) : IDisposable
        {
            public void Dispose()
            {
                foreach (IDisposable disposable in disposables)
                {
                    disposable.Dispose();
                }
            }
        }
    }
}
