using AnimeHub.Api.Data;
using AnimeHub.Api.Endpoints;
using AnimeHub.Api.Mapping;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Retrieve the connection string from configuration (Secret Manager in Development)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Only load Key Vault secrets in non-development environments
if (!builder.Environment.IsDevelopment())
{
    // Logic here for Key Vault access
}

// Register the DbContext to use SQL Server
builder.Services.AddDbContext<AnimeHubDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

// Register AutoMapper
builder.Services.AddAutoMapper((IServiceProvider serviceProvider, IMapperConfigurationExpression config) =>
{
    // config.AddMaps(typeof(Program).Assembly); // This is the preferred way, but we will use the explicit profile

    // Explicitly add your profile to the configuration
    config.AddProfile<AnimeMappingProfile>();
}, new Type[] { });

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers(); // Leave for now but will most likely delete later

app.MapAnimeEndpoints();

app.Run();
