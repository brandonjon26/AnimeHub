using System;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Cryptography;

namespace AnimeHub.Shared.Utilities
{
    public static class CryptoUtils
    {
        // For professional apps, this key should eventually come from 
        // a Secret Manager or Environment Variable, not hardcoded.
        private const string DefaultKey = "AnimeHub_Super_Secret_Key_2026!!"; // store in Azure keyvault later down the line!!!

        public static string Obfuscate(string plainText, string? key = null)
        {
            if (string.IsNullOrEmpty(plainText)) return string.Empty;

            byte[] iv = new byte[16];
            byte[] array;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(DeriveKey(key ?? DefaultKey));
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter(cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }
                        array = memoryStream.ToArray();
                    }
                }
            }

            return Convert.ToBase64String(array);
        }

        public static string Deobfuscate(string cipherText, string? key = null)
        {
            if (string.IsNullOrEmpty(cipherText)) return string.Empty;

            byte[] iv = new byte[16];
            byte[] buffer = Convert.FromBase64String(cipherText);

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(DeriveKey(key ?? DefaultKey));
                aes.IV = iv;

                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream(buffer))
                {
                    using (CryptoStream cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new StreamReader(cryptoStream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
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
