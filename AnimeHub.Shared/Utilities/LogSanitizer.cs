using AnimeHub.Shared.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace AnimeHub.Shared.Utilities
{
    public static class LogSanitizer
    {
        // Compiled regex for performance. Added 'token' and 'secret' as common sense defaults.
        private static readonly Regex JsonPropertyRegex = new Regex(
            @"""(password|token|secret|key)""\s*:\s*""([^""]+)""",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        public static string SerializeAndSanitize(object dto)
        {
            if (dto == null) return "{}";

            // 1. Initial string
            string json = JsonSerializer.Serialize(dto);

            // 2. Name-based Redaction (Fast)
            json = JsonPropertyRegex.Replace(json, @"""$1"": ""[REDACTED]""");

            // 3. Attribute-based Redaction (Reflective)
            var sensitiveProps = dto.GetType()
                .GetProperties()
                .Where(p => p.GetCustomAttribute<SensitiveAttribute>() != null);

            foreach (var prop in sensitiveProps)
            {
                var pattern = $@"""{prop.Name}""\s*:\s*""([^""]+)""";
                json = Regex.Replace(json, pattern, $@"""{prop.Name}"": ""[REDACTED]""", RegexOptions.IgnoreCase);
            }

            return json;
        }
    }
}
