using AutoMapper;
using AnimeHub.Api.DTOs;
using AnimeHub.Api.DTOs.Character;
using AnimeHub.Api.DTOs.Character.Lore;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Enums;
using AnimeHub.Api.Entities.Character;
using AnimeHub.Api.Entities.Character.Lore;
using System.Linq;

namespace AnimeHub.Api.Mapping
{
    public class CharacterMappingProfile : Profile
    {
        public CharacterMappingProfile()
        {
            // --- 1. ACCESSORY MAPPINGS ---

            // Map Character Accessory Entity to DTO (Read)
            CreateMap<CharacterAccessory, CharacterAccessoryDto>()
                .ForCtorParam("CharacterAccessoryId", opt => opt.MapFrom(src => src.CharacterAccessoryId))
                .ForCtorParam("Description", opt => opt.MapFrom(src => src.Description))
                .ForCtorParam("IsWeapon", opt => opt.MapFrom(src => src.IsWeapon))
                .ForCtorParam("UniqueEffect", opt => opt.MapFrom(src => src.UniqueEffect));

            // Map Accessory Input DTO to Accessory Entity
            // This is used when creating a new Accessory Entity from the DTO data.
            CreateMap<CharacterAccessoryInputDto, CharacterAccessory>()
                .ForMember(dest => dest.AttireLinks, opt => opt.Ignore()); // Ignore the join collection


            // --- 2. ATTIRE MAPPINGS ---

            // Map Character Attire Entity to DTO (Read)
            CreateMap<CharacterAttire, CharacterAttireDto>()
                .ForCtorParam("CharacterAttireId", opt => opt.MapFrom(src => src.CharacterAttireId))
                .ForCtorParam("Name", opt => opt.MapFrom(src => src.Name))
                .ForCtorParam("AttireType", opt => opt.MapFrom(src => src.AttireType))
                .ForCtorParam("Description", opt => opt.MapFrom(src => src.Description))
                .ForCtorParam("HairstyleDescription", opt => opt.MapFrom(src => src.HairstyleDescription))
                .ForCtorParam(
                    "Accessories", // Maps the Accessories collection from the join table
                    opt => opt.MapFrom(src => src.AccessoryLinks.Select(link => link.Accessory))
                );

            // Map Attire Input DTO to Attire Entity (Write)
            CreateMap<CharacterAttireInputDto, CharacterAttire>()
                .ForMember(dest => dest.AccessoryLinks, opt => opt.Ignore())
                .ForMember(dest => dest.Profile, opt => opt.Ignore());


            // --- 3. CHARACTER PROFILE MAPPINGS ---

            // Map Character Profile Entity to DTO (Read)
            CreateMap<CharacterProfile, CharacterProfileDto>()
                .ForCtorParam("CharacterProfileId", opt => opt.MapFrom(src => src.CharacterProfileId))
                .ForCtorParam("FirstName", opt => opt.MapFrom(src => src.FirstName))
                .ForCtorParam("LastName", opt => opt.MapFrom(src => src.LastName))
                .ForCtorParam("JapaneseFirstName", opt => opt.MapFrom(src => src.JapaneseFirstName))
                .ForCtorParam("JapaneseLastName", opt => opt.MapFrom(src => src.JapaneseLastName))
                .ForCtorParam("Age", opt => opt.MapFrom(src => src.Age))
                .ForCtorParam("Origin", opt => opt.MapFrom(src => src.Origin))              
                .ForCtorParam("Vibe", opt => opt.MapFrom(src => src.Vibe))
                .ForCtorParam("Height", opt => opt.MapFrom(src => src.Height))
                .ForCtorParam("BodyType", opt => opt.MapFrom(src => src.BodyType))
                .ForCtorParam("Hair", opt => opt.MapFrom(src => src.Hair))
                .ForCtorParam("Eyes", opt => opt.MapFrom(src => src.Eyes))
                .ForCtorParam("Skin", opt => opt.MapFrom(src => src.Skin))
                .ForCtorParam("PrimaryEquipment", opt => opt.MapFrom(src => src.PrimaryEquipment))
                .ForCtorParam("UniquePower", opt => opt.MapFrom(src => src.UniquePower))
                .ForCtorParam("MagicAptitude", opt => opt.MapFrom(src => src.MagicAptitude))
                .ForCtorParam("RomanticTensionDescription", opt => opt.MapFrom(src => src.RomanticTensionDescription))
                .ForCtorParam("Bio", opt => opt.MapFrom(src => src.Bio))
                // Mapping the Greatest Feat Title via LoreEntry
                .ForCtorParam(
                    "GreatestFeat",
                    opt => opt.MapFrom(src => src.GreatestFeatLore) // AutoMapper will use the summary DTO mapping defined below
                )
                // Mapping the nested BestFriend object
                .ForCtorParam(
                    "BestFriend",
                    opt => opt.MapFrom(src => src.BestFriend) // AutoMapper will use the summary DTO mapping defined below
                )
                // Placeholders & Collections
                .ForCtorParam("GreetingAudioUrl", opt => opt.MapFrom(_ => string.Empty)) // Still a placeholder
                .ForCtorParam("Attires", opt => opt.MapFrom(src => src.Attires))
                // Map the join collection to the DTO collection
                .ForCtorParam(
                    "LoreLinks",
                    opt => opt.MapFrom(src => src.LoreLinks) // AutoMapper will use the CharacterLoreLink mapping (see below)
                );

            // Character Profile Summary DTO
            CreateMap<CharacterProfile, CharacterProfileSummaryDto>();

            // Map Profile Update DTO for existing Entity update (Write)
            CreateMap<CharacterProfileUpdateDto, CharacterProfile>()
                .ForMember(dest => dest.CharacterProfileId, opt => opt.Ignore()) // Don't overwrite PK
                .ForMember(dest => dest.Attires, opt => opt.Ignore()) // Don't overwrite collections
                .ForMember(dest => dest.BestFriend, opt => opt.Ignore()) // Ignore navigation property
                .ForMember(dest => dest.BestFriendCharacterId, opt => opt.Ignore()) // Ignore FK for Best Friend
                .ForMember(dest => dest.GreatestFeatLore, opt => opt.Ignore()) // Ignore navigation property
                .ForMember(dest => dest.GreatestFeatLoreId, opt => opt.Ignore()); // We ignore this FK; it will be updated by a separate service call


            // --- 4. LORE SYSTEM MAPPINGS ---

            // Lore Entry Entity to lightweight Summary DTO (Read)
            CreateMap<LoreEntry, LoreEntrySummaryDto>()
                .ForCtorParam("LoreEntryId", opt => opt.MapFrom(src => src.LoreEntryId))
                .ForCtorParam("Title", opt => opt.MapFrom(src => src.Title));

            // Lore Type Entity to DTO (Read)
            CreateMap<LoreType, LoreTypeDto>();

            // Lore Entry Entity to DTO (Read)
            CreateMap<LoreEntry, LoreEntryDto>()
                .ForCtorParam("LoreType", opt => opt.MapFrom(src => src.LoreType.Name)) // Map the Name string from the associated LoreType entity
                .ForCtorParam(
                    "CharactersInvolved",
                    // Map the CharacterProfile Summary DTO from the join table links
                    opt => opt.MapFrom(src => src.CharacterLinks.Select(link => link.CharacterProfile))
                );

            // CharacterLoreLink Entity (Join Table) to DTO (Read)
            // This maps the join entity itself, allowing us to include the CharacterRole
            CreateMap<CharacterLoreLink, CharacterLoreLinkDto>()
                .ForCtorParam("CharacterRole", opt => opt.MapFrom(src => src.CharacterRole))
                // AutoMapper handles the nested LoreEntry mapping automatically
                .ForCtorParam("LoreEntry", opt => opt.MapFrom(src => src.LoreEntry));

            // Lore Entry Input DTO to Lore Entry Entity (Write)
            // Note: We ignore the collections as the service layer handles the CharacterLinks and the LoreType is mapped via ID.
            CreateMap<LoreEntryInputDto, LoreEntry>()
                .ForMember(dest => dest.LoreTypeId, opt => opt.MapFrom(src => src.LoreTypeId)) // Map the ID from the DTO
                .ForMember(dest => dest.CharacterLinks, opt => opt.Ignore()) // Manually handled in service
                .ForMember(dest => dest.LoreType, opt => opt.Ignore()); // Ignore navigation property            
        }
    }
}
