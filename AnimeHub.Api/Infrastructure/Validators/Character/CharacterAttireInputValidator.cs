using FluentValidation;
using AnimeHub.Api.DTOs.Character;

namespace AnimeHub.Api.Infrastructure.Validators.Character
{
    public class CharacterAttireInputValidator : AbstractValidator<CharacterAttireInputDto>
    {
        public CharacterAttireInputValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
            RuleFor(x => x.AttireType).NotEmpty().MaximumLength(50);
            RuleFor(x => x.Description).NotEmpty().MaximumLength(500);
            RuleFor(x => x.HairstyleDescription).NotEmpty().MaximumLength(100);


            // --- NESTED PROPERTY --- //
            
            // Ensure at least one record exists, then validate using the accessory-specific validator
            RuleFor(x => x.Accessories).Must(y => y != null && y.Count > 0).WithMessage("An attire must have at least one accessory.");            
            RuleForEach(x => x.Accessories).SetValidator(new CharacterAccessoryInputValidator());
        }
    }
}
