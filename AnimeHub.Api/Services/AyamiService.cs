using AnimeHub.Api.DTOs.Ayami;
using AnimeHub.Api.Entities.Ayami;
using AnimeHub.Api.Repositories;
using AutoMapper;

namespace AnimeHub.Api.Services
{
    public class AyamiService : AyamiInterface
    {
        private readonly IAyamiRepository _repository;
        private readonly IMapper _mapper;

        public AyamiService(IAyamiRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<AyamiProfileDto?> GetAyamiProfileAsync()
        {
            AyamiProfile? profile = await _repository.GetProfileWithDetailsAsync();

            if (profile == null)
            {
                return null;
            }

            // Maps the Entity structure (with Attires and Accessories) to the DTO structure.
            return _mapper.Map<AyamiProfileDto>(profile);
        }
    }
}
