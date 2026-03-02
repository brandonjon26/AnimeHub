using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AnimeHub.Shared.Enums;

namespace AnimeHub.Shared.Utilities.Exceptions
{
    public class AuthenticationException : AnimeHubException
    {
        public AuthenticationException(string message, object? payload = null)
            : base(message, 401, payload, LogLevel.Warning, LogSource.Security) { }
    }
}
