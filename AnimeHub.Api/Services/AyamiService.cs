using AutoMapper;
using AnimeHub.Api.DTOs.Ayami;
using AnimeHub.Api.Entities.Ayami;
using AnimeHub.Api.Repositories;
using System.Collections.Generic;

namespace AnimeHub.Api.Services
{
    public class AyamiService : AyamiInterface
    {
        private readonly IAyamiRepository _repository;
        private readonly IBaseRepository<CharacterAttire> _attireRepository;
        private readonly IBaseRepository<CharacterAccessory> _accessoryRepository; // Need base repo for accessories
        private readonly IBaseRepository<AccessoryAttireJoin> _joinRepository; // Need base repo for joins
        private readonly IMapper _mapper;

        public AyamiService(IAyamiRepository repository, IBaseRepository<CharacterAttire> attireRepository, IBaseRepository<CharacterAccessory> accessoryRepository, IBaseRepository<AccessoryAttireJoin> joinRepository, IMapper mapper)
        {
            _repository = repository;
            _attireRepository = attireRepository;
            _accessoryRepository = accessoryRepository;
            _joinRepository = joinRepository;
            _mapper = mapper;
        }

        // --- READ ---
        public async Task<CharacterProfileDto?> GetAyamiProfileAsync()
        {
            CharacterProfile? profile = await _repository.GetProfileWithDetailsAsync();

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

        // --- UPDATE ---
        public async Task<bool> UpdateProfileAsync(int profileId, AyamiProfileUpdateDto updateDto)
        {
            // The Ayami Profile is a singleton, so we always retrieve the first one.
            var profileToUpdate = await _repository.GetFirstOrDefaultAsync(p => p.AyamiProfileId == profileId);

            if (profileToUpdate is null) return false;

            // Map DTO fields onto the existing Entity
            _mapper.Map(updateDto, profileToUpdate);

            // Persist the changes
            await _repository.Update(profileToUpdate);

            int recordsAffected = await _repository.SaveChangesAsync();

            // We can assume success if no exception is thrown
            return recordsAffected > 0 ? true : false;
        }

        // --- CREATE ---
        public async Task<int?> AddAttireAsync(int profileId, CharacterAttireInputDto attireDto)
        {
            // Find the target profile
            CharacterProfile? profile = await _repository.GetFirstOrDefaultAsync(p => p.AyamiProfileId == 3);
            if (profile is null) return null;

            // Map the DTO to the new Attire entity
            CharacterAttire newAttire = _mapper.Map<CharacterAttire>(attireDto);

            // Set the foreign key manually
            newAttire.ProfileId = profile.AyamiProfileId;

            // Process Accessories and create the Join links
            foreach (CharacterAccessoryInputDto accessoryDto in attireDto.Accessories)
            {
                // **Look for existing accessory by description to reuse it (Normalization Benefit)**
                CharacterAccessory? existingAccessory = await _accessoryRepository.GetFirstOrDefaultAsync(
                    a => a.Description == accessoryDto.Description);

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

            return recordsAffected > 0 ? newAttire.AyamiAttireId: null;
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
