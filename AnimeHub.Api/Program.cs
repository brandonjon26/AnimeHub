using AnimeHub.Api.Data;
using AnimeHub.Api.Endpoints;
using AnimeHub.Api.Mapping;
using AnimeHub.Api.Repositories;
using AnimeHub.Api.Services;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Retrieve the connection string from configuration (Secret Manager in Development)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
const string CorsPolicyName = "AllowReactClient";

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

// Add services to the container
// Register AutoMapper
builder.Services.AddAutoMapper((IServiceProvider serviceProvider, IMapperConfigurationExpression config) =>
{
    // config.AddMaps(typeof(Program).Assembly); // This is the preferred way, but we will use the explicit profile

    // Explicitly add your profile to the configuration
    config.AddProfile<AnimeMappingProfile>();
    config.AddProfile<GalleryMappingProfile>();
    config.AddProfile<AyamiMappingProfile>();
}, new Type[] { });


#region Add Scoped Services
// Register the Anime Repository (Scoped lifetime is standard for repositories)
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IAnimeRepository, AnimeRepository>();
builder.Services.AddScoped<IGalleryRepository, GalleryRepository>();
builder.Services.AddScoped<IGalleryCategoryRepository, GalleryCategoryRepository>();
builder.Services.AddScoped<IAyamiRepository, AyamiRepository>();

// Register the Anime Service (Scoped lifetime is standard for services)
builder.Services.AddScoped<AnimeInterface, AnimeService>();
builder.Services.AddScoped<GalleryInterface, GalleryService>();
builder.Services.AddScoped<AyamiInterface, AyamiService>();
#endregion


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS Service
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CorsPolicyName,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Allow your frontend's exact origin
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseCors(CorsPolicyName);

app.UseAuthorization();

app.MapControllers(); // Leave for now but will most likely delete later


#region Map Endpoints
app.MapAnimeEndpoints();
app.MapGalleryEndpoints();
app.MapAyamiEndpoints();
#endregion


// Data Seeding using a Scoped Service Provider (Development Only)
if (app.Environment.IsDevelopment())
{
    // Scoped creation ensures the DbContext is properly disposed
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<AnimeHubDbContext>();

        try
        {
            // context.Database.Migrate(); // Uncomment if you want migrations run on startup

            // Call the static SeedDatabase method
            SeedData.SeedDatabase(context);
        }
        catch (Exception ex)
        {
            // Log errors if seeding fails
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while seeding the database.");
        }
    }
}

app.Run();
