using FluentValidation;
using AnimeHub.Api.DTOs.Character;

namespace AnimeHub.Api.Infrastructure.Validators.Character
{
    public class CharacterAccessoryInputValidator : AbstractValidator<CharacterAccessoryInputDto>
    {
        public CharacterAccessoryInputValidator()
        {
            RuleFor(x => x.Description).NotEmpty().MaximumLength(500);
            RuleFor(x => x.UniqueEffect).MaximumLength(500).When(x => !string.IsNullOrEmpty(x.UniqueEffect));
        }
    }
}
