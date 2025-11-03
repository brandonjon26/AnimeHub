using AnimeHub.Api.DTOs;
using System.Collections.Generic;

namespace AnimeHub.Api.Services
{
    public interface AnimeInterface
    {
        // Methods return DTOs, decoupling the API from the database entities
        Task<IEnumerable<AnimeDto>> GetAllAnimesAsync();
        Task<AnimeDto?> GetAnimeByIdAsync(long id);

        // Future methods: AddAnimeAsync(CreateAnimeDto), UpdateAnimeAsync(UpdateAnimeDto), etc.
    }
}
