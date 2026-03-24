using AnimeHub.Api.Entities.Enums;
using AnimeHub.Api.Infrastructure.Logging;
using AnimeHub.Shared.Utilities;
using AnimeHub.Shared.Utilities.Exceptions;
using AnimeHub.Shared.Enums;
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
            string currentTraceId = context.TraceIdentifier ?? string.Empty;
            var userId = context.User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            int statusCode = (int)HttpStatusCode.InternalServerError;
            object? payload = null;
            Shared.Enums.LogLevel logLevel = Shared.Enums.LogLevel.Error;
            LogSource logSource = LogSource.WebAPI;
            string message = "Internal Server Error. Please try again later.";

            // 1. Check if it's one of OUR custom exceptions
            if (exception is AnimeHubException appEx)
            {
                statusCode = appEx.StatusCode; 
                logLevel = appEx.LogLevel;
                logSource = appEx.LogSource;
                message = appEx.Message;

                // Look for most detailed payload in the chain
                payload = GetDeepestPayload(appEx);
            }

            // 2. Log with the Payload (Sanitized!)
            using (_logger.BeginPropertyScope(logSourceId: logSource, userId: userId, traceId: currentTraceId, payload: (payload != null ? LogSanitizer.SerializeAndSanitize(payload) : "")))
            {
                // Dynamic logging based on the LogLevel
                switch (logLevel)
                {
                    case Shared.Enums.LogLevel.Critical:
                        _logger.LogCritical(exception, "CRITICAL: {Message}", message);
                        break;
                    case Shared.Enums.LogLevel.Fatal:
                        _logger.LogCritical(exception, "FATAL: {Message}", message);
                        break;
                    case Shared.Enums.LogLevel.Warning:
                        _logger.LogWarning("Warning: {Message}", message);
                        break;
                    case Shared.Enums.LogLevel.Information:
                        _logger.LogInformation("Info: {Message}", message);
                        break;
                    case Shared.Enums.LogLevel.Error:
                    default:
                        _logger.LogError(exception, "Error: {Message}", message);
                        break;
                }
            }

            // 3. Response to Frontend
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var response = new
            {
                StatusCode = statusCode,
                Message = message,
                TraceId = context.TraceIdentifier
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));            
        }

        private object? GetDeepestPayload(Exception ex)
        {
            object? lastFoundPayload = null;
            Exception currentEx = ex;

            while (currentEx != null)
            {
                // If the current exception is part of our exception tree and it has a payload, keep track of it
                if (currentEx is AnimeHubException ahEx && ahEx.Payload != null)
                {
                    lastFoundPayload = ahEx.Payload;
                }

                // Drill down to the next exception
                currentEx = currentEx.InnerException;
            }

            return lastFoundPayload;
        }
    }
}
