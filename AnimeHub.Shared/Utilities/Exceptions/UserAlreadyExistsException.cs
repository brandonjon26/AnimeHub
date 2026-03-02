using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AnimeHub.Shared.Enums;

namespace AnimeHub.Shared.Utilities.Exceptions
{
    public class UserAlreadyExistsException : AnimeHubException
    {
        public UserAlreadyExistsException(string message, object? payload = null)
            : base(message, 409, payload, LogLevel.Information, LogSource.Security) { }
    }
}
