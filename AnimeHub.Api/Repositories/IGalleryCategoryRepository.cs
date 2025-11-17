using AnimeHub.Api.Entities;

namespace AnimeHub.Api.Repositories
{
    public interface IGalleryCategoryRepository : IBaseRepository<GalleryImageCategory>
    {
        Task<GalleryImageCategory?> GetByNameAsync(string name);
        Task<int> CreateNewCategoryAsync(GalleryImageCategory category);
    }
}
