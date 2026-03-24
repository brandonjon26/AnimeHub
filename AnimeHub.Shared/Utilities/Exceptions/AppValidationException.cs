using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AnimeHub.Shared.Enums;

namespace AnimeHub.Shared.Utilities.Exceptions
{
    public class AppValidationException : AnimeHubException
    {
        public AppValidationException(string message, object? payload = null, Exception? innerException = null)
        : base(message, 400, payload, innerException, LogLevel.Error, LogSource.WebAPI) { }
    }
}
