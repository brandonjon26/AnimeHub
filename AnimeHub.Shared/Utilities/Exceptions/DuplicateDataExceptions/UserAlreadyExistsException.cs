using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace AnimeHub.Shared.Utilities.Exceptions.DuplicateDataExceptions
{
    public class UserAlreadyExistsException : ConflictException
    {
        public UserAlreadyExistsException(string message, object? payload = null, Exception? innerException = null)
            : base(message, payload, innerException) { }
    }
}
