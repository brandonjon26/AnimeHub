using AnimeHub.Api.Entities.Enums;
using AnimeHub.Api.Infrastructure.Logging;
using Serilog.Context;
using System.Net;
using System.Text.Json;

namespace AnimeHub.Api.Infrastructure.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // 1. Automatically capture the TraceId for the ENTIRE request lifecycle
            using (LogContext.PushProperty("TraceId", context.TraceIdentifier))
            {
                try
                {
                    // 2. Pass the request to the next person (Controller/Service)
                    await _next(context);
                }
                catch (Exception ex)
                {
                    // 3. If ANYTHING fails, log it here
                    await HandleExceptionAsync(context, ex);
                }
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Use our BeginPropertyScope to set the Source to WebAPI for unhandled errors
            using (_logger.BeginPropertyScope(logSourceId: LogSource.WebAPI))
            {
                _logger.LogError(exception, "An unhandled exception occurred during the request.");
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            // Return a clean error object to the frontend (no stack traces for users!)
            var response = new
            {
                StatusCode = context.Response.StatusCode,
                Message = "Internal Server Error. Please try again later.",
                TraceId = context.TraceIdentifier
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
