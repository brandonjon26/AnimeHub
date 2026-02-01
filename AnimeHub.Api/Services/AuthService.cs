using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using AnimeHub.Api.DTOs.Auth;
using AutoMapper;
using AnimeHub.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using AnimeHub.Api.Infrastructure.Logging;
using System.Text.Json;
using AnimeHub.Api.Entities.Enums;

namespace AnimeHub.Api.Services
{
    public class AuthService : AuthInterface
    {

        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<AuthService> _logger;
        private readonly IValidator<RegisterDto> _registerValidator;
        private readonly IValidator<LoginDto> _loginValidator;
        private readonly IConfiguration _configuration; // Needed for JWT secret key
        private readonly UserProfileInterface _profileService;
        private readonly IMapper _mapper;

        private record TokenResult(string Token, DateTimeOffset Expiration);

        public AuthService(
            UserManager<IdentityUser> userManager, 
            RoleManager<IdentityRole> roleManager, 
            IConfiguration configuration, 
            UserProfileInterface profileService, 
            IMapper mapper, ILogger<AuthService> logger, 
            IValidator<RegisterDto> registerValidator, 
            IValidator<LoginDto> loginValidator)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _profileService = profileService;
            _mapper = mapper;
            _logger = logger;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
        }

        public async Task<UserResponseDto?> RegisterAsync(RegisterDto dto)
        {
            try
            {
                var validationResult = await _registerValidator.ValidateAsync(dto);
                if (!validationResult.IsValid)
                {
                    throw new ValidationException("Validation of the account registration request failed.", validationResult.Errors);                    
                }

                // Check if user already exists (by email or username)
                if (await _userManager.FindByEmailAsync(dto.Email) != null ||
                    await _userManager.FindByNameAsync(dto.UserName) != null)
                {
                    _logger.LogInformation("Registration attempted with existing email: {Email}", dto.Email);
                    return null;
                }

                // Create the new IdentityUser
                IdentityUser user = new IdentityUser
                {
                    UserName = dto.UserName,
                    Email = dto.Email,
                    EmailConfirmed = true
                };

                // Attempt to create the user with the given password
                IdentityResult result = await _userManager.CreateAsync(user, dto.Password);

                if (result.Succeeded)
                {
                    _logger.LogInformation("New user registered successfully: {UserName} ({UserId})", user.UserName, user.Id);

                    // Assign the default 'Villager' role
                    // NOTE: We rely on the role being created via the Seed method later.
                    await _userManager.AddToRoleAsync(user, Roles.Villager);

                    // Create the UserProfile record
                    await _profileService.CreateProfileAsync(user.Id, dto);

                    // Fetch roles and profile (Just like in LoginAsync)
                    IList<string> roles = await _userManager.GetRolesAsync(user);
                    UserProfile? profile = await _profileService.GetProfileByUserIdAsync(user.Id);

                    // Generate Token
                    TokenResult tokenData = GenerateJwtToken(user, roles);

                    // Mapping and Construction (Reusing LoginAsync's logic)
                    UserResponseDto initialResponse = _mapper.Map<UserResponseDto>(user);

                    if (profile != null)
                    {
                        _mapper.Map(profile, initialResponse);
                    }

                    UserResponseDto finalResponse = initialResponse with
                    {
                        Token = tokenData.Token,
                        Expiration = tokenData.Expiration,
                        Roles = roles.ToList(),
                        IsAdmin = roles.Contains(Roles.Administrator) || roles.Contains(Roles.Mage)
                    };

                    // Registration failed, return null to indicate failure (or let endpoint handle the result)
                    // For now, we return null, which the endpoint will convert to an IdentityResult failure response.
                    return finalResponse;
                }

                return null;
            }
            catch (ValidationException validationException)
            {
                using (_logger.BeginPropertyScope(logSourceId: LogSource.Security, payload: JsonSerializer.Serialize(dto)))
                {
                    string errorMessages = string.Join(", ", validationException.Errors.Select(e => e.ErrorMessage));

                    _logger.LogWarning("Registration validation failed for {Email}. Errors: {Errors}",
                        dto.Email, errorMessages);
                }
                return null;
            }
            catch (Exception ex)
            {
                using (_logger.BeginPropertyScope(logSourceId: LogSource.Security, payload: JsonSerializer.Serialize(dto)))
                {
                    _logger.LogError(ex, "An unexpected error occurred during registration for {Email}", dto.Email);
                }
                return null;
            }            
        }

        public async Task<UserResponseDto?> LoginAsync(LoginDto dto)
        {
            var validationResult = await _loginValidator.ValidateAsync(dto);
            if (!validationResult.IsValid)
            {
                return null;
            }

            // Find user by unified LoginIdentifier (Email or Username)
            IdentityUser? user = dto.LoginIdentifier.Contains('@')
                ? await _userManager.FindByEmailAsync(dto.LoginIdentifier)
                : await _userManager.FindByNameAsync(dto.LoginIdentifier);

            if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
            {
                // Security Logging: Keep track of failed attempts
                _logger.LogWarning("Failed login attempt for identifier: {Identifier}", dto.LoginIdentifier);
                return null; // Login failed
            }            

            // Fetch dependencies
            IList<string> roles = await _userManager.GetRolesAsync(user);
            UserProfile? profile = await _profileService.GetProfileByUserIdAsync(user.Id); // Fetch custom profile

            using (_logger.BeginPropertyScope(logSourceId: LogSource.System, userId: profile?.UserId, payload: JsonSerializer.Serialize(dto)))
            {
                _logger.LogInformation("User logged in: {UserName}", user.UserName);
            }

            // Generate Token
            TokenResult tokenData = GenerateJwtToken(user, roles);

            // Mapping and Construction
            UserResponseDto initialResponse = _mapper.Map<UserResponseDto>(user); // Map IdentityUser fields

            if (profile != null)
            {
                // Overlay custom profile data using the second mapping
                _mapper.Map(profile, initialResponse);
            }

            // Final assignment of calculated/generated fields
            // The 'with' expression creates a *new* record instance with the specified properties changed
            UserResponseDto finalResponse = initialResponse with
            {
                Token = tokenData.Token,
                Expiration = tokenData.Expiration,
                Roles = roles.ToList(),
                IsAdmin = roles.Contains(Roles.Administrator) || roles.Contains(Roles.Mage)
            };

            return finalResponse;
        }

        // Generates the JWT Token
        private TokenResult GenerateJwtToken(IdentityUser user, IList<string> roles)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id), // Primary identifier
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique ID for the token
            };

            // Add roles to the claims
            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            // Get configuration values
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            string? issuer = _configuration["Jwt:Issuer"];
            string? audience = _configuration["Jwt:Audience"];
            double tokenDuration = double.Parse(_configuration["Jwt:DurationInMinutes"]!);

            // Calculate expiration date
            DateTime expiresAt = DateTime.UtcNow.AddMinutes(tokenDuration);

            // Create the token descriptor
            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expiresAt,
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = credentials
            };

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

            // Return the TokenResult record
            return new TokenResult(tokenHandler.WriteToken(token), new DateTimeOffset(expiresAt));
        }

        public async Task<bool> EnsureRolesExistAsync()
        {
            // This is a helper method we can use during seeding to ensure roles exist.
            string[] roles = new[] { Roles.Administrator, Roles.Mage, Roles.Villager };
            bool allExist = true;

            foreach (var roleName in roles)
            {
                if (!await _roleManager.RoleExistsAsync(roleName))
                {
                    await _roleManager.CreateAsync(new IdentityRole(roleName));
                    allExist = false;
                }
            }
            return allExist;
        }
    }
}
