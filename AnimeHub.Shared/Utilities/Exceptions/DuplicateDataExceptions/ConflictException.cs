using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using AnimeHub.Shared.Enums;

namespace AnimeHub.Shared.Utilities.Exceptions.DuplicateDataExceptions
{
    public class ConflictException : AnimeHubException
    {
        public ConflictException(string message, object? payload = null)
            : base(message, 409, payload, LogLevel.Warning, LogSource.Security) { }
    }
}
