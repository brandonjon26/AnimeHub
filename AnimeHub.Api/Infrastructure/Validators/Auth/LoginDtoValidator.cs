using FluentValidation;
using AnimeHub.Api.DTOs.Auth;

namespace AnimeHub.Api.Infrastructure.Validators.Auth
{
    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        public LoginDtoValidator()
        {
            RuleFor(x => x.LoginIdentifier)
                .NotEmpty().WithMessage("Username or Email is required.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.");
        }
    }
}
