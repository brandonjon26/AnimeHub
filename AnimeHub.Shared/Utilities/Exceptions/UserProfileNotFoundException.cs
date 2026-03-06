using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AnimeHub.Shared.Enums;

namespace AnimeHub.Shared.Utilities.Exceptions
{
    public class UserProfileNotFoundException : AnimeHubException
    {
        public UserProfileNotFoundException(string message, object? payload = null, Exception? innerException = null) 
        : base(message, 404, payload, innerException, LogLevel.Warning, LogSource.WebAPI) { }
    }
}
