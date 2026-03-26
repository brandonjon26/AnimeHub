using FluentValidation;
using AnimeHub.Api.DTOs.Character;

namespace AnimeHub.Api.Infrastructure.Validators.Character
{
    public class CharacterProfileUpdateValidator : AbstractValidator<CharacterProfileUpdateDto>
    {
        public CharacterProfileUpdateValidator()
        {
            // Names: Standard non-empty string checks
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(50);
            RuleFor(X => X.LastName).NotEmpty().MaximumLength(50);
            RuleFor(x => x.JapaneseFirstName).NotEmpty().MaximumLength(50);
            RuleFor(x => x.JapaneseLastName).NotEmpty().MaximumLength(50);

            // Age: Business logic (No newborn or immortal ghosts allowed without reason)
            RuleFor(x => x.Age).InclusiveBetween(1, 200);

            // Origin: Optional field (string?)
            // Note: MaximumLength is only checked IF the value is not null
            RuleFor(x => x.Origin).NotEmpty().MaximumLength(50);

            // Visuals & Lore
            RuleFor(x => x.Vibe).NotEmpty().MaximumLength(200);
            RuleFor(x => x.Height).NotEmpty().MaximumLength(10);
            RuleFor(x => x.BodyType).NotEmpty().MaximumLength(50);
            RuleFor(x => x.Hair).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Eyes).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Skin).NotEmpty().MaximumLength(100);

            // Safety: Aligning with DB limits
            RuleFor(x => x.PrimaryEquipment).NotEmpty().MaximumLength(150);
            RuleFor(x => x.UniquePower).NotEmpty().MaximumLength(255);
            RuleFor(x => x.MagicAptitude).NotEmpty().MaximumLength(100);

            // Relationships & Biography
            RuleFor(x => x.GreatestFeatLoreId).NotNull().GreaterThan(0);
            RuleFor(x => x.RomanticTensionDescription).NotEmpty();
            RuleFor(x => x.Bio).NotEmpty();
        }
    }
}
