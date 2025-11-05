using AutoMapper;
using AnimeHub.Api.DTOs.Ayami;
using AnimeHub.Api.Entities.Ayami;
using AnimeHub.Api.Entities; // Needed for the regular GalleryImage/Category if needed later, but good practice to include

namespace AnimeHub.Api.Mapping
{
    public class AyamiMappingProfile : Profile
    {
        public AyamiMappingProfile()
        {
            // Map Ayami Accessory Entity to DTO
            CreateMap<AyamiAccessory, AyamiAccessoryDto>();

            // Map Ayami Attire Entity to DTO
            // AutoMapper automatically handles the collection mapping for Accessories.
            CreateMap<AyamiAttire, AyamiAttireDto>();

            // Map Ayami Profile Entity to DTO
            // AutoMapper automatically handles the collection mapping for Attires.
            // The English and Japanese names are mapped by convention.
            CreateMap<AyamiProfile, AyamiProfileDto>();
        }
    }
}
