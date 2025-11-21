using AnimeHub.Api.DTOs.GalleryImage;
using Microsoft.AspNetCore.Http;

namespace AnimeHub.Api.Services
{
    public interface GalleryInterface
    {
        // READ Operations
        Task<IEnumerable<GalleryImageDto>> GetFeaturedImagesAsync();
        Task<IEnumerable<GalleryImageCategoryDto>> GetAllCategoriesAsync();
        Task<IEnumerable<GalleryImageDto>> GetImagesByCategoryNameAsync(string categoryName, bool isAdult);

        // CREATE Operations
        Task<int> CreateImageBatchAsync(GalleryImageCreateBatchDto dto, IFormFile[] files);
        Task<GalleryImageDto?> CreateSingleImageAsync(GalleryImageCreateSingleDto dto, IFormFile file);

        // UPDATE Operations
        Task<bool> UpdateGalleryFolderAsync(int categoryId, GalleryImageUpdateFolderDto dto);
        Task<bool> UpdateSingleImageAsync(long imageId, GalleryImageUpdateSingleDto dto);

        // DELETE Operations
        Task<bool> DeleteGalleryFolderAsync(int categoryId);
        Task<bool> DeleteImageAsync(long imageId);
        Task<bool> DeleteCategoryAsync(int categoryId);
    }
}
