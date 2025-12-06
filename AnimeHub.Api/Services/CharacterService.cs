using AutoMapper;
using AnimeHub.Api.DTOs.Character;
using AnimeHub.Api.DTOs.Character.Lore;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Character;
using AnimeHub.Api.Entities.Character.Lore;
using AnimeHub.Api.Repositories;
using System.Collections.Generic;
using System.Linq;

namespace AnimeHub.Api.Services
{
    public class CharacterService : CharacterInterface
    {
        private readonly ICharacterRepository _repository;
        private readonly IBaseRepository<CharacterAttire> _attireRepository;
        private readonly IBaseRepository<CharacterAccessory> _accessoryRepository; // Need base repo for accessories
        private readonly IBaseRepository<AccessoryAttireJoin> _joinRepository; // Need base repo for joins
        // Base repository for Lore entities
        private readonly IBaseRepository<LoreType> _loreTypeRepository;
        private readonly IBaseRepository<LoreEntry> _loreEntryRepository;
        private readonly IBaseRepository<CharacterLoreLink> _loreLinkRepository;
        private readonly IMapper _mapper;

        public CharacterService(ICharacterRepository repository, IBaseRepository<CharacterAttire> attireRepository, IBaseRepository<CharacterAccessory> accessoryRepository, 
                                IBaseRepository<AccessoryAttireJoin> joinRepository, IBaseRepository<LoreType> loreTypeRepository, IBaseRepository<LoreEntry> loreEntryRepository, 
                                IBaseRepository<CharacterLoreLink> loreLinkRepository, IMapper mapper)
        {
            _repository = repository;
            _attireRepository = attireRepository;
            _accessoryRepository = accessoryRepository;
            _joinRepository = joinRepository;
            _loreTypeRepository = loreTypeRepository;
            _loreEntryRepository = loreEntryRepository;
            _loreLinkRepository = loreLinkRepository;
            _mapper = mapper;
        }

        // --- READ ---
        public async Task<CharacterProfileDto?> GetCharacterProfileAsync(string characterName)
        {
            CharacterProfile? profile = await _repository.GetProfileWithDetailsAsync(characterName);

            if (profile == null)
            {
                return null;
            }

            // Map the entity to the DTO
            CharacterProfileDto profileDto = _mapper.Map<CharacterProfileDto>(profile);

            // Manually set the static audio URL after mapping
            // Records are immutable, so we must use 'with' to create a new instance with the updated property.
            profileDto = profileDto with
            {
                GreetingAudioUrl = "/audio/ayami/Ayami_Voice_Greeting.mp3" // The static URL path
            };

            // Maps the Entity structure (with Attires and Accessories) to the DTO structure.
            return profileDto;
        }

        // Read all Lore Types
        public async Task<ICollection<LoreTypeDto>> GetAllLoreTypesAsync()
        {
            // Simple repository call to get all lookup entries
            IEnumerable<LoreType> loreTypes = await _loreTypeRepository.GetAllAsync();
            return _mapper.Map<ICollection<LoreTypeDto>>(loreTypes);
        }

        // Read a specific Lore Entry
        public async Task<LoreEntryDto?> GetLoreEntryByIdAsync(int loreEntryId)
        {
            // Repository will need a method to include related entities (Type and Characters)
            LoreEntry? entry = await _loreEntryRepository.GetFirstOrDefaultAsync(
                l => l.LoreEntryId == loreEntryId,
                includeProperties: new string[] { "LoreType", "CharacterLinks.CharacterProfile" }
            );

            return entry == null ? null : _mapper.Map<LoreEntryDto>(entry);
        }


        // --- UPDATE ---
        public async Task<bool> UpdateProfileAsync(int profileId, CharacterProfileUpdateDto updateDto)
        {
            // The Ayami Profile is a singleton, so we always retrieve the first one.
            CharacterProfile? profileToUpdate = await _repository.GetFirstOrDefaultAsync(p => p.CharacterProfileId == profileId);

            if (profileToUpdate is null) return false;

            // Map DTO fields onto the existing Entity
            _mapper.Map(updateDto, profileToUpdate);

            // Persist the changes
            await _repository.Update(profileToUpdate);

            int recordsAffected = await _repository.SaveChangesAsync();

            // We can assume success if no exception is thrown
            return recordsAffected > 0 ? true : false;
        }

        // Update the Greatest Feat link
        public async Task<bool> UpdateCharacterGreatestFeatAsync(int profileId, int loreEntryId)
        {
            CharacterProfile? profileToUpdate = await _repository.GetFirstOrDefaultAsync(p => p.CharacterProfileId == profileId);
            if (profileToUpdate is null) return false;

            // Set the foreign key directly
            profileToUpdate.GreatestFeatLoreId = loreEntryId;

            await _repository.Update(profileToUpdate);
            int recordsAffected = await _repository.SaveChangesAsync();

            return recordsAffected > 0;
        }


        // --- CREATE ---
        public async Task<int?> AddAttireAsync(int profileId, CharacterAttireInputDto attireDto)
        {
            // Find the target profile
            CharacterProfile? profile = await _repository.GetFirstOrDefaultAsync(p => p.CharacterProfileId == profileId);
            if (profile is null) return null;

            // Map the DTO to the new Attire entity
            CharacterAttire newAttire = _mapper.Map<CharacterAttire>(attireDto);

            // Set the foreign key manually
            newAttire.CharacterProfileId = profile.CharacterProfileId;

            // Process Accessories and create the Join links
            foreach (CharacterAccessoryInputDto accessoryDto in attireDto.Accessories)
            {
                // **Look for existing accessory by description to reuse it (Normalization Benefit)**
                CharacterAccessory? existingAccessory = await _accessoryRepository.GetFirstOrDefaultAsync(
                    a => a.Description == accessoryDto.Description && a.UniqueEffect == accessoryDto.UniqueEffect);

                CharacterAccessory accessory;

                if (existingAccessory != null)
                {
                    accessory = existingAccessory;
                }
                else
                {
                    // If it doesn't exist, create and add the new unique Accessory entity
                    accessory = _mapper.Map<CharacterAccessory>(accessoryDto);
                    await _accessoryRepository.Add(accessory);
                }

                // Create the link entity to connect the Attire and the Accessory
                newAttire.AccessoryLinks.Add(new AccessoryAttireJoin
                {
                    Accessory = accessory,
                    Attire = newAttire
                });
            }

            // Add the new Attire (which cascades the creation of the join links)
            await _attireRepository.Add(newAttire); // Adding Attire to the main repo saves changes across the graph.

            int recordsAffected = await _repository.SaveChangesAsync();

            return recordsAffected > 0 ? newAttire.CharacterAttireId : null;
        }

        // Create a new Lore Entry
        public async Task<int?> CreateLoreEntryAsync(LoreEntryInputDto loreEntryDto)
        {
            // 1. Map DTO to LoreEntry entity
            LoreEntry newLoreEntry = _mapper.Map<LoreEntry>(loreEntryDto);

            // 2. Add the Lore Entry
            await _loreEntryRepository.Add(newLoreEntry);
            await _repository.SaveChangesAsync(); // Save to get the LoreEntryId

            // 3. Create CharacterLoreLink entities
            foreach (int characterId in loreEntryDto.CharacterIds)
            {
                // Ensure character exists (optional check, but good practice)
                CharacterProfile? character = await _repository.GetFirstOrDefaultAsync(p => p.CharacterProfileId == characterId);

                if (character != null)
                {
                    CharacterLoreLink link = new CharacterLoreLink
                    {
                        CharacterProfileId = characterId,
                        LoreEntryId = newLoreEntry.LoreEntryId
                    };
                    await _loreLinkRepository.Add(link);
                }
            }

            int recordsAffected = await _repository.SaveChangesAsync();

            return recordsAffected > 0 ? newLoreEntry.LoreEntryId : null;
        }


        // --- DELETE ---
        public async Task<bool> DeleteAttireAsync(int attireId)
        {
            // IMPORTANT: We only delete the attire, not the profile.
            // Check to make sure we aren't deleting the last remaining attire (if you want to enforce that).
            // For now, we'll allow deletion unless it's a critical attire ID (like ID 1, if we hardcoded one).

            // Retrieve the Attire entity
            var attireToDelete = await _repository.GetAttireByIdAsync(attireId); // Assumes we add a GetAttireByIdAsync to IAyamiRepository

            if (attireToDelete is null) return false;

            // Delete the Attire entity
            // EF Core will automatically cascade the deletion to the AccessoryAttireJoins table.
            await _attireRepository.Delete(attireToDelete); // We must delete the attire entity itself, not the profile.

            int recordsAffected = await _repository.SaveChangesAsync();

            return recordsAffected > 0 ? true : false;
        }
    }
}
