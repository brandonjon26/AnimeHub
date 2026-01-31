using FluentValidation;
using AnimeHub.Api.DTOs.Auth;

namespace AnimeHub.Api.Infrastructure.Validators.Auth
{
    public partial class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.UserName)
                .NotEmpty().WithMessage("Username is required.")
                .Length(3, 50).WithMessage("Username must be between 3 and 50 characters.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("That doesn't look like a valid email address.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters long.");

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required.")
                .MaximumLength(50).WithMessage("First name is too long for our records.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required.")
                .MaximumLength(50).WithMessage("Last name is too long for our records.");

            RuleFor(x => x.Birthday)
                .NotEmpty().WithMessage("Birthday is required.")
                .Must(BeAValidAge).WithMessage("You must be at least 13 years old to join the otaku life.");

            RuleFor(x => x.Location)
                .MaximumLength(50).WithMessage("Location name is too long.");
        }

        private bool BeAValidAge(DateOnly date)
        {
            var today = DateOnly.FromDateTime(DateTime.Now);
            var age = today.Year - date.Year;
            if (date > today.AddYears(-age)) age--;
            return age >= 13;
        }
    }
}
