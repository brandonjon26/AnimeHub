using System;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Cryptography;
using Microsoft.Extensions.Options;
using AnimeHub.Shared.Models;

namespace AnimeHub.Shared.Utilities.CryptoUtils
{
    public class CryptoService : CryptoInterface
    {
        private readonly byte[] _keyBytes;
        private readonly byte[] _iv = new byte[16]; // Zeroed IV for consistent obfuscation

        public CryptoService(IOptions<CryptoSettings> settings)
        {
            // 1. Get the key from the injected settings
            string rawKey = settings.Value.Key;

            // 2. Ensure it's exactly 32 bytes and convert to byte array once
            string derivedKey = rawKey.Length > 32 ? rawKey.Substring(0, 32) : rawKey.PadRight(32, 'X');
            _keyBytes = Encoding.UTF8.GetBytes(derivedKey);
        }

        public string Obfuscate(string plainText)
        {
            if (string.IsNullOrEmpty(plainText)) return string.Empty;

            using (Aes aes = Aes.Create())
            {
                aes.Key = _keyBytes;
                aes.IV = _iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter sw = new StreamWriter(cs))
                        {
                            sw.Write(plainText);
                        }
                    }
                    return Convert.ToBase64String(ms.ToArray());
                }
            }
        }

        public string Deobfuscate(string cipherText)
        {
            if (string.IsNullOrEmpty(cipherText)) return string.Empty;

            try
            {
                byte[] buffer = Convert.FromBase64String(cipherText);

                using (Aes aes = Aes.Create())
                {
                    aes.Key = _keyBytes;
                    aes.IV = _iv;

                    ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                    using (MemoryStream ms = new MemoryStream(buffer))
                    {
                        using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader sr = new StreamReader(cs))
                            {
                                return sr.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch (CryptographicException)
            {
                // If someone tries to decrypt with the wrong key or bad data
                return "[DECRYPTION_FAILED]";
            }
        }

        // Ensures the key is exactly 32 bytes (256 bits) for AES
        private static string DeriveKey(string key)
        {
            if (key.Length == 32) return key;
            return key.Length > 32 ? key.Substring(0, 32) : key.PadRight(32, 'X');
        }
    }
}