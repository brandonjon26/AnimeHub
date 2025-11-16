using AnimeHub.Api.DTOs.GalleryImage;

namespace AnimeHub.Api.Services
{
    public interface GalleryInterface
    {
        Task<IEnumerable<GalleryImageDto>> GetFeaturedImagesAsync();
        Task<IEnumerable<GalleryImageCategoryDto>> GetAllCategoriesAsync();
        Task<IEnumerable<GalleryImageDto>> GetImagesByCategoryNameAsync(string categoryName, bool isAdult);
        Task<bool> CreateImageBatchAsync(GalleryImageCreateBatchDto dto);
        Task<GalleryImageDto?> CreateSingleImageAsync(GalleryImageCreateSingleDto dto);
        Task<bool> UpdateGalleryFolderAsync(int categoryId, GalleryImageUpdateFolderDto dto);
        Task<bool> DeleteGalleryFolderAsync(int categoryId);
        Task<bool> DeleteImageAsync(long imageId);
    }
}
