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

            // Mapping for Gallery Categories
            CreateMap<GalleryImageCategory, GalleryImageCategoryDto>()
                .ForMember(
                    dest => dest.CoverUrl,
                    opt => opt.Ignore() // Cover URL is determined in the Service layer
                );

            // Mapping for Gallery Images
            CreateMap<GalleryImage, GalleryImageDto>()
                .ForMember(
                    dest => dest.CategoryName,
                    // Pull the display name from the related Category entity
                    opt => opt.MapFrom(src => src.Category!.Name)
                );
        }
    }
}
