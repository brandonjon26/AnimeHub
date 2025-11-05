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
            CreateMap<AyamiAttire, AyamiAttireDto>()
                .ForCtorParam(
                    "Accessories", // Match the parameter name in the record's constructor
                    opt => opt.MapFrom(src => src.AccessoryLinks.Select(link => link.Accessory))
                )
                // Add additional .ForCtorParam mappings for other properties if necessary,
                // though AutoMapper usually handles simple property names by convention.
                // Let's add the other primary constructor params just to be safe.
                .ForCtorParam("Name", opt => opt.MapFrom(src => src.Name))
                .ForCtorParam("Description", opt => opt.MapFrom(src => src.Description))
                .ForCtorParam("Hairstyle", opt => opt.MapFrom(src => src.Hairstyle));

            // Map Ayami Profile Entity to DTO
            // AutoMapper automatically handles the collection mapping for Attires.
            // The English and Japanese names are mapped by convention.
            CreateMap<AyamiProfile, AyamiProfileDto>()
                .ForCtorParam(
                    "Attires", // Match the parameter name in AyamiProfileDto's constructor
                    opt => opt.MapFrom(src => src.Attires)
                )
                // You would continue mapping all other AyamiProfileDto constructor parameters here
                .ForCtorParam("FirstName", opt => opt.MapFrom(src => src.FirstName))
                // ... all other simple properties ...
                .ForCtorParam("Bio", opt => opt.MapFrom(src => src.Bio));
        }
    }
}
