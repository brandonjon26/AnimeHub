using AnimeHub.Api.DTOs;
using AnimeHub.Api.Repositories;
using AnimeHub.Api.Entities;
using AutoMapper;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AnimeHub.Api.Services
{
    public class AnimeService : AnimeInterface
    {
        // Inject the Repository (Data Access) and Mapper (Transformation)
        private readonly IAnimeRepository _animeRepository;
        private readonly IMapper _mapper;

        public AnimeService(IAnimeRepository animeRepository, IMapper mapper)
        {
            _animeRepository = animeRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AnimeDto>> GetAllAnimesAsync()
        {
            // Get entities from the data layer (Repository)
            IEnumerable<Anime> animeEntities = await _animeRepository.GetAllAsync();

            // Map entities to DTOs
            return _mapper.Map<IEnumerable<AnimeDto>>(animeEntities);
        }

        public async Task<AnimeDto?> GetAnimeByIdAsync(long id)
        {
            // Get the read-only entity from the data layer
            Anime? animeEntity = await _animeRepository.GetReadOnlyByIdAsync(id);

            // Perform business logic/null check
            if (animeEntity is null)
            {
                return null;
            }

            // Map the entity to DTO and return
            return _mapper.Map<AnimeDto>(animeEntity);
        }
    }
}
