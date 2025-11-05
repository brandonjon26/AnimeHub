using AutoMapper;
using AnimeHub.Api.DTOs;
using AnimeHub.Api.Entities;

namespace AnimeHub.Api.Mapping
{
    public class AnimeMappingProfile : Profile
    {
        public AnimeMappingProfile()
        {
            // Map the database Entity (Anime) to the DTO (AnimeDto)
            CreateMap<Anime, AnimeDto>();

            // Future maps (e.g., DTOs for incoming requests) will go here:
            // CreateMap<CreateAnimeDto, Anime>();            
        }
    }
}
