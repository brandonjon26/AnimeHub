using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AnimeHub.Shared.Enums;

namespace AnimeHub.Shared.Utilities.Exceptions
{
    public class AnimeHubException : Exception
    {
        public int StatusCode { get; }
        public object? Payload {  get; }
        public LogLevel LogLevel { get; }
        public LogSource LogSource { get; }

        public AnimeHubException(
            string message, 
            int statusCode = 500, 
            object? payload = null, 
            LogLevel logLevel = LogLevel.Error, 
            LogSource logSource = LogSource.WebAPI) : base(message) 
        { 
            StatusCode = statusCode; 
            Payload = payload;
            LogLevel = logLevel;
            LogSource = logSource;
        }
    }
}
