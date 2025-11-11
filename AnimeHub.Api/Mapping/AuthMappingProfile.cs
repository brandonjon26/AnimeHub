using AutoMapper;
using AnimeHub.Api.DTOs.Auth;
using AnimeHub.Api.Entities;
using Microsoft.AspNetCore.Identity;

namespace AnimeHub.Api.Mapping
{
    public class AuthMappingProfile : Profile
    {
        public AuthMappingProfile()
        {
            // We map from IdentityUser to UserResponseDto initially
            CreateMap<IdentityUser, UserResponseDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))

                // Set default values for properties that must be filled in later
                // The IsAdmin, FirstName, IsAdult, and Token properties will be set via 
                // a manual projection/resolver during the mapping process in the service.
                .ForMember(dest => dest.IsAdmin, opt => opt.Ignore())
                .ForMember(dest => dest.FirstName, opt => opt.Ignore())
                .ForMember(dest => dest.LastName, opt => opt.Ignore())
                .ForMember(dest => dest.IsAdult, opt => opt.Ignore())
                .ForMember(dest => dest.Token, opt => opt.Ignore())
                .ForMember(dest => dest.Roles, opt => opt.Ignore())
                .ForMember(dest => dest.Expiration, opt => opt.Ignore());

            // We also need a simple mapping for the UserProfile entity
            // This is primarily used as a source for projecting data onto the DTO.
            CreateMap<UserProfile, UserResponseDto>()
                 .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName))
                 .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName))
                 .ForMember(dest => dest.IsAdult, opt => opt.MapFrom(src => src.IsAdult))

                 // Ignore fields not present in UserProfile
                 .ForMember(dest => dest.UserId, opt => opt.Ignore())
                 .ForMember(dest => dest.UserName, opt => opt.Ignore())
                 .ForMember(dest => dest.Email, opt => opt.Ignore())
                 .ForMember(dest => dest.IsAdmin, opt => opt.Ignore())
                 .ForMember(dest => dest.Token, opt => opt.Ignore())
                 .ForMember(dest => dest.Roles, opt => opt.Ignore())
                 .ForMember(dest => dest.Expiration, opt => opt.Ignore());
        }
    }
}
