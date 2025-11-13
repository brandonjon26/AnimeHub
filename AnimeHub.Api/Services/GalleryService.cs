using AnimeHub.Api.Repositories;
using AnimeHub.Api.Entities;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AnimeHub.Api.DTOs.GalleryImage;

namespace AnimeHub.Api.Services
{
    public class GalleryService : GalleryInterface
    {
        private readonly IGalleryRepository _galleryRepository;
        private readonly IGalleryCategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public GalleryService(IGalleryRepository galleryRepository, IGalleryCategoryRepository categoryRepository, IMapper mapper)
        {
            _galleryRepository = galleryRepository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GalleryImageDto>> GetFeaturedImagesAsync()
        {
            // Get ALL images (a tradeoff: retrieving all data to filter here)
            // A more advanced approach would be to add a custom GetFeaturedAsync()
            // method to the concrete GalleryRepository for better performance.
            IEnumerable<GalleryImage> allImages = await _galleryRepository.GetAllAsync();

            // Filter the collection for featured images using LINQ
            IEnumerable<GalleryImage> featuredEntities = await _galleryRepository.GetFeaturedWithCategoryAsync();

            // Map the entities to DTOs
            return _mapper.Map<IEnumerable<GalleryImageDto>>(featuredEntities);
        }

        public async Task<IEnumerable<GalleryImageCategoryDto>> GetAllCategoriesAsync()
        {
            // Get all category entities from the repository
            IEnumerable<GalleryImageCategory> categoryEntities = await _categoryRepository.GetAllAsync();

            // Map entities to DTOs
            List<GalleryImageCategoryDto> categoryDtos = _mapper.Map<IEnumerable<GalleryImageCategoryDto>>(categoryEntities).ToList();

            // Post-mapping logic: Add the CoverUrl (Business Logic)
            foreach (GalleryImageCategoryDto categoryDto in categoryDtos)
            {
                // Find the first featured image that belongs to this category to use as the cover
                GalleryImage? coverImage = (await _galleryRepository.GetAllAsync())
                    .FirstOrDefault(i =>
                        (int)i.GalleryImageCategoryId == categoryDto.GalleryImageCategoryId && i.IsFeatured);

                categoryDto.CoverUrl = coverImage?.ImageUrl ?? "/images/default_cover.png";
            }

            return categoryDtos;
        }

        public async Task<IEnumerable<GalleryImageDto>> GetImagesByCategoryNameAsync(string categoryName)
        {
            // Find the target category entity using a direct repository query 
            // Add a custom method to the *Category* repository for efficient lookup by name.

            // TEMPORARY FIX (using existing methods)
            var categoryEntity = (await _categoryRepository.GetAllAsync())
                                    .FirstOrDefault(c => c.Name.Equals(categoryName, StringComparison.OrdinalIgnoreCase));

            if (categoryEntity == null)
            {
                return Enumerable.Empty<GalleryImageDto>();
            }

            // Call the new repository method that includes the category data
            var imagesForCategory = await _galleryRepository.GetByCategoryWithCategoryAsync(
                categoryEntity.GalleryImageCategoryId
            );

            // Map entities to DTOs (mapping will now succeed)
            return _mapper.Map<IEnumerable<GalleryImageDto>>(imagesForCategory);
        }

        /// <summary>
        /// POST /batch: Adds a batch of images to an existing category/folder.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<bool> CreateImageBatchAsync(GalleryImageCreateBatchDto dto)
        {
            // 1. Business Logic: Validate Category Existence
            GalleryImageCategory? category = await _galleryRepository.GetCategoryByIdAsync(dto.CategoryId);
            if (category == null)
            {
                return false; // Category must exist
            }

            // 2. Mapping: Convert DTOs to Entities
            List<GalleryImage> newImages = dto.Images.Select(imgDto => new GalleryImage
            {
                ImageUrl = imgDto.ImageUrl,
                AltText = imgDto.AltText,
                IsFeatured = imgDto.IsFeatured,
                IsMatureContent = dto.IsMatureContent, // Apply folder-level flag
                GalleryImageCategoryId = dto.CategoryId, // Apply category ID
                DateAdded = DateTime.UtcNow,
                DateModified = DateTime.UtcNow // Initialize DateModified
            }).ToList();

            if (!newImages.Any()) return false;

            // 3. Repository: Add entities
            await _galleryRepository.AddRangeAsync(newImages);
            int rowsAdded = await _galleryRepository.SaveChangesAsync();

            // 4. Post-Save Logic: Handle potential featured image switch
            // If any image in the batch is marked IsFeatured, we must ensure 
            // the previously featured image for that category is un-featured.
            if (newImages.Any(i => i.IsFeatured))
            {
                // We reuse the existing UpdateImagesByCategoryIdAsync bulk logic:
                // It sets all IsFeatured to false, then sets the single featured image ID to true.
                // We use the ID of the newly added featured image as the target.
                long newFeaturedId = newImages.First(i => i.IsFeatured).GalleryImageId;

                // We call the repository directly for bulk update, but we ignore the update count here.
                await _galleryRepository.UpdateImagesByCategoryIdAsync(
                    dto.CategoryId,
                    dto.IsMatureContent, // Keep the mature flag consistent
                    newFeaturedId
                );
                // Note: SaveChangesAsync is handled inside UpdateImagesByCategoryIdAsync (ExecuteUpdateAsync)
            }

            return rowsAdded > 0;
        }

        /// <summary>
        /// POST /single: Adds a single image to an existing category.
        /// </summary>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<GalleryImageDto?> CreateSingleImageAsync(GalleryImageCreateSingleDto dto)
        {
            // 1. Business Logic: Validate Category Existence
            GalleryImageCategory? category = await _galleryRepository.GetCategoryByIdAsync(dto.CategoryId);
            if (category == null)
            {
                return null; // Category must exist
            }

            // 2. Business Logic: If IsFeatured, update the folder first
            if (dto.IsFeatured)
            {
                // Find the existing featured image's ID to use in the bulk update.
                GalleryImage? currentFeatured = (await _galleryRepository.GetByCategoryWithCategoryAsync(dto.CategoryId))
                                        .FirstOrDefault(i => i.IsFeatured);

                // If there's a currently featured image, we must un-feature it.
                if (currentFeatured != null)
                {
                    currentFeatured.IsFeatured = false;
                    currentFeatured.DateModified = DateTime.UtcNow;
                    await _galleryRepository.Update(currentFeatured);
                }
            }

            // 3. Figure out if image should be flagged as matured content
            bool isMatureContent = false;
            IEnumerable<GalleryImage> images = await _galleryRepository.GetByCategoryWithCategoryAsync(dto.CategoryId);
            isMatureContent = images.First().IsMatureContent;

            // 4. Mapping: Create new entity
            GalleryImage newImage = new GalleryImage
            {
                ImageUrl = dto.ImageUrl,
                AltText = dto.AltText,
                IsFeatured = dto.IsFeatured,
                IsMatureContent = isMatureContent, // Assuming category entity has IsMature field (check your Category Entity)
                GalleryImageCategoryId = dto.CategoryId,
                DateAdded = DateTime.UtcNow,
                DateModified = DateTime.UtcNow
            };

            // 5. Repository: Add and Save
            await _galleryRepository.Add(newImage);
            await _galleryRepository.SaveChangesAsync();

            // 6. Mapping: Return the newly created DTO
            return _mapper.Map<GalleryImageDto>(newImage);
        }

        /// <summary>
        /// PUT /folder/{categoryId}: Updates the mature flag and featured image for ALL images in a folder.
        /// </summary>
        /// <param name="categoryId"></param>
        /// <param name="dto"></param>
        /// <returns></returns>
        public async Task<bool> UpdateGalleryFolderAsync(int categoryId, GalleryImageUpdateFolderDto dto)
        {
            // 1. Business Logic: Validate Category Existence
            GalleryImageCategory? category = await _galleryRepository.GetCategoryByIdAsync(categoryId);
            if (category == null)
            {
                return false;
            }

            // 2. Business Logic: Validate Featured Image ID belongs to the category
            // We ensure the featured image ID exists in the database before passing it to the bulk operation.
            GalleryImage? featuredImage = await _galleryRepository.GetReadOnlyByIdAsync(dto.FeaturedImageId);
            if (featuredImage == null || featuredImage.GalleryImageCategoryId != categoryId)
            {
                return false; // The featured image ID is invalid or belongs to another category
            }

            // 3. Repository: Use bulk update method
            // The repository method handles setting the mature flag for all images 
            // and toggling the IsFeatured flag across the whole category.
            int updatedCount = await _galleryRepository.UpdateImagesByCategoryIdAsync(
                categoryId,
                dto.IsMatureContent,
                dto.FeaturedImageId
            );

            // We only need to save the change to the Category entity itself if you track the IsMature flag there.
            // (Assuming Category entity updates are not strictly necessary here since image records hold the state)

            return updatedCount > 0;
        }

        /// <summary>
        /// DELETE /folder/{categoryId}: Deletes ALL images belonging to a category (folder).
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>
        public async Task<bool> DeleteGalleryFolderAsync(int categoryId)
        {
            // 1. Repository: Use bulk delete method
            int deletedCount = await _galleryRepository.DeleteImagesByCategoryIdAsync(categoryId);

            // 2. Business Logic: If successfully deleted, consider deleting the category record itself 
            // from the category lookup table, unless it's a code-defined enum value.
            // Assuming we DO NOT delete the category record, as it's enum-managed.

            return deletedCount > 0;
        }

        /// <summary>
        /// DELETE /images/{imageId}: Deletes a single image record.
        /// </summary>
        /// <param name="imageId"></param>
        /// <returns></returns>
        public async Task<bool> DeleteImageAsync(long imageId)
        {
            // 1. Repository: Get entity to track
            GalleryImage? imageToDelete = await _galleryRepository.GetTrackedByIdAsync(imageId);

            if (imageToDelete == null)
            {
                return false;
            }

            // 2. Repository: Delete and Save
            await _galleryRepository.Delete(imageToDelete);
            int rowsDeleted = await _galleryRepository.SaveChangesAsync();

            // 3. Business Logic: If the deleted image was the featured one, 
            // a new featured image must be chosen (e.g., the oldest one in the folder).
            // For now, we skip this complex logic and let the admin handle setting a new featured image.

            return rowsDeleted > 0;
        }
    }
}
