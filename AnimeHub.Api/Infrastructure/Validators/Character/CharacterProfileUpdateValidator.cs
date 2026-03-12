using FluentValidation;
using AnimeHub.Api.DTOs.Character;

namespace AnimeHub.Api.Infrastructure.Validators.Character
{
    public class CharacterProfileUpdateValidator : AbstractValidator<CharacterProfileUpdateDto>
    {
        public CharacterProfileUpdateValidator()
        {
            // Rules will live here
        }
    }
}
