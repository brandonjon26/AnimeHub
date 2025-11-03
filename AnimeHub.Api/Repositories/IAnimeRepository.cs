using AnimeHub.Api.Entities;

namespace AnimeHub.Api.Repositories
{
    public interface IAnimeRepository : IBaseRepository<Anime>
    {
        // Future methods specific to Anime (e.g., GetAnimeByGenreAsync) will go here.
        // For now, it remains empty as GetAll/GetById are in the base interface.        
    }
}
