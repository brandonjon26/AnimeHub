using System.Text;
using System.Text.Json;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using AutoMapper;
using FluentValidation;
using AnimeHub.Api.Entities;
using AnimeHub.Api.DTOs.Auth;
using AnimeHub.Api.Entities.Enums;
using AnimeHub.Api.Infrastructure.Logging;
using AnimeHub.Shared.Enums;
using AnimeHub.Shared.Utilities;
using AnimeHub.Shared.Utilities.Exceptions;
using AnimeHub.Shared.Utilities.Exceptions.DuplicateDataExceptions;

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
        private readonly IHttpContextAccessor _httpContextAccessor;

        private record TokenResult(string Token, DateTimeOffset Expiration);

        public AuthService(
            UserManager<IdentityUser> userManager, 
            RoleManager<IdentityRole> roleManager, 
            IConfiguration configuration, 
            UserProfileInterface profileService, 
            IMapper mapper, 
            ILogger<AuthService> logger, 
            IValidator<RegisterDto> registerValidator, 
            IValidator<LoginDto> loginValidator,
            IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _profileService = profileService;
            _mapper = mapper;
            _logger = logger;
            _registerValidator = registerValidator;
            _loginValidator = loginValidator;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<UserResponseDto?> RegisterAsync(RegisterDto dto)
        {
            string currentTraceId = _httpContextAccessor.HttpContext?.TraceIdentifier ?? string.Empty;

            try
            {
                var validationResult = await _registerValidator.ValidateAsync(dto);
                if (!validationResult.IsValid)
                {
                    throw new AppValidationException("Registration validation failed.", new
                    {
                        Payload = dto,
                        ValidationErrors = validationResult.Errors.Select(e => new { e.PropertyName, e.ErrorMessage })
                    });
                }

                // Check if user already exists (by email or username)
                if (await _userManager.FindByEmailAsync(dto.Email) != null ||
                    await _userManager.FindByNameAsync(dto.UserName) != null)
                {
                    throw new UserAlreadyExistsException($"User with email {dto.Email} or username {dto.UserName} already exists.", dto);
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

                    // Write successful registration log
                    using (_logger.BeginPropertyScope(logSourceId: LogSource.WebAPI, userId: profile?.UserId, traceId: currentTraceId, payload: LogSanitizer.SerializeAndSanitize(dto)))
                    {
                        _logger.LogInformation("New user registered successfully: {UserName} ({UserId})", user.UserName, profile?.UserId);
                    }

                    // Registration failed, return null to indicate failure (or let endpoint handle the result)
                    // For now, we return null, which the endpoint will convert to an IdentityResult failure response.
                    return finalResponse;
                }
                else
                {
                    // Wrap Identity errors and throw as a 500
                    throw new AnimeHubException("User creation failed.", 500, result.Errors);
                }
            }
            catch (ValidationException validationException)
            {
                // Translate to AnimeHub exception type
                throw new AnimeHubException("A data validation error occurred while trying to create your account.", 500, dto, validationException);
            }
            catch (DbUpdateException dbEx)
            {
                // Generic .NET/EF error; Translate to AnimeHub exception type
                throw new AnimeHubException("A database error occurred while creating your account.", 500, dto, dbEx);
            }
            catch (Exception ex)
            {
                // Translate to AnimeHub exception type
                throw new AnimeHubException("An unexpected system error occurred.", 500, dto, ex, Shared.Enums.LogLevel.Error, LogSource.Security);
            }            
        }

        public async Task<UserResponseDto?> LoginAsync(LoginDto dto)
        {
            string currentTraceId = _httpContextAccessor.HttpContext?.TraceIdentifier ?? string.Empty;

            try
            {                
                var validationResult = await _loginValidator.ValidateAsync(dto);
                if (!validationResult.IsValid)
                {
                    throw new AppValidationException("Login validation failed.", validationResult.Errors);
                }

                // Find user by unified LoginIdentifier (Email or Username)
                IdentityUser? user = dto.LoginIdentifier.Contains('@')
                    ? await _userManager.FindByEmailAsync(dto.LoginIdentifier)
                    : await _userManager.FindByNameAsync(dto.LoginIdentifier);

                if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
                {
                    // Security logic: Throwing tells the middleware to log a Security Warning
                    throw new AuthenticationException("Invalid username or password.", dto);
                }

                // Fetch dependencies
                IList<string> roles = await _userManager.GetRolesAsync(user);
                UserProfile? profile = await _profileService.GetProfileByUserIdAsync(user.Id); // Fetch custom profile

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

                // Write successful login to logs table
                using (_logger.BeginPropertyScope(logSourceId: LogSource.WebAPI, userId: profile?.UserId, traceId: currentTraceId, payload: LogSanitizer.SerializeAndSanitize(dto)))
                {
                    _logger.LogInformation("User logged in: {UserName}", user.UserName);
                }

                return finalResponse;
            }
            catch (ValidationException validationException)
            {
                throw new AnimeHubException("A data validation error occurred when trying to log in.", 500, validationException.Message);
            }
            catch (DbUpdateException dbEx)
            {
                // Generic .NET/EF error; Translate to AnimeHub exception type
                throw new AnimeHubException("A database error occurred while creating your account.", 500, dbEx.Message);
            }
            catch (Exception ex)
            {
                // Translate to AnimeHub exception type
                throw new AnimeHubException("An unexpected system error occurred.", 500, ex.Message, Shared.Enums.LogLevel.Error, LogSource.Security);
            }
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
