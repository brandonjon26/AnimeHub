using AutoMapper;
using AnimeHub.Api.DTOs.Ayami;
using AnimeHub.Api.Entities.Ayami;
using AnimeHub.Api.Entities;
using System.Linq;

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

            // Map Accessory Input DTO to Accessory Entity
            // This is used when creating a new Accessory Entity from the DTO data.
            CreateMap<AyamiAccessoryInputDto, AyamiAccessory>();

            // Map Attire Input DTO to Attire Entity
            // Note: We ignore the Accessories collection here as we manually handle
            // the creation/linking of Accessories and the Join table in the service layer.
            CreateMap<AyamiAttireInputDto, AyamiAttire>()
                .ForMember(dest => dest.AccessoryLinks, opt => opt.Ignore())
                .ForMember(dest => dest.Profile, opt => opt.Ignore());

            // Map Profile Update DTO for existing Entity update
            // This map is used to update an existing AyamiProfile object in the Service.
            CreateMap<AyamiProfileUpdateDto, AyamiProfile>()
                .ForMember(dest => dest.AyamiProfileId, opt => opt.Ignore()) // Don't overwrite the PK
                .ForMember(dest => dest.Attires, opt => opt.Ignore()); // Don't overwrite the Attires collection
        }
    }
}
