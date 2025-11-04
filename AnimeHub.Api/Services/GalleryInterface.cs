using AnimeHub.Api.DTOs;

namespace AnimeHub.Api.Services
{
    public interface GalleryInterface
    {
        Task<IEnumerable<GalleryImageDto>> GetFeaturedImagesAsync();
        Task<IEnumerable<GalleryImageCategoryDto>> GetAllCategoriesAsync();
        Task<IEnumerable<GalleryImageDto>> GetImagesByCategoryNameAsync(string categoryName);
    }
}
