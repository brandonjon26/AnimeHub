using AnimeHub.Api.Data;
using AnimeHub.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AnimeHub.Api.Repositories
{
    public class GalleryCategoryRepository : BaseRepository<GalleryImageCategory>, IGalleryCategoryRepository
    {
        public GalleryCategoryRepository(AnimeHubDbContext context)
            : base(context)
        {
        }
    }
}
