using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace AnimeHub.Shared.Utilities.Exceptions.DuplicateDataExceptions
{
    public class AnimeAlreadyExistsException : ConflictException
    {
        public AnimeAlreadyExistsException(string message, object? payload = null) 
            : base(message, payload) { }
    }
}
