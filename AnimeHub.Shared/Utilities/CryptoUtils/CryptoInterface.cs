using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnimeHub.Shared.Utilities.CryptoUtils
{
    public interface CryptoInterface
    {
        string Obfuscate(string plainText);
        string Deobfuscate(string cipherText);
    }
}
