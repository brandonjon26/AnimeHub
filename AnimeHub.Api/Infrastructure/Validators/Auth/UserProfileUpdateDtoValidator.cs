using FluentValidation;
using AnimeHub.Api.DTOs.Auth;

namespace AnimeHub.Api.Infrastructure.Validators.Auth
{
    public class UserProfileUpdateDtoValidator : AbstractValidator<UserProfileUpdateDto>
    {
        public UserProfileUpdateDtoValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().MaximumLength(50);

            RuleFor(x => x.LastName)
                .NotEmpty().MaximumLength(50);

            RuleFor(x => x.Birthday)
                .NotEmpty()
                .Must(date => date < DateOnly.FromDateTime(DateTime.Now))
                .WithMessage("Unless you're a time traveler, your birthday must be in the past.");

            RuleFor(x => x.Location)
                .MaximumLength(50);
        }
    }
}
