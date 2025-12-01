using AnimeHub.Api.Repositories;
using AnimeHub.Api.Entities;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AnimeHub.Api.DTOs.GalleryImage;
using Microsoft.AspNetCore.Http;

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

        public async Task<IEnumerable<GalleryImageDto>> GetImagesByCategoryNameAsync(string categoryName, bool isAdult)
        {
            // Find the target category entity using a direct repository query 
            // Add a custom method to the *Category* repository for efficient lookup by name.

            // TEMPORARY FIX (using existing methods)
            GalleryImageCategory? categoryEntity = (await _categoryRepository.GetAllAsync())
                                    .FirstOrDefault(c => c.Name.Equals(categoryName, StringComparison.OrdinalIgnoreCase));

            if (categoryEntity == null)
            {
                return Enumerable.Empty<GalleryImageDto>();
            }

            int categoryId = categoryEntity.GalleryImageCategoryId;

            // SECURITY CHECK: Determine if the folder contains mature content
            bool isFolderMature = await _galleryRepository.HasMatureContentAsync(categoryId);

            // Block Access if restricted
            if (isFolderMature && !isAdult)
            {
                // Return an empty collection, blocking unauthorized access.
                return Enumerable.Empty<GalleryImageDto>();
            }

            // Call the new repository method that includes the category data
            IEnumerable<GalleryImage> imagesForCategory = await _galleryRepository.GetByCategoryWithCategoryAsync(
                categoryEntity.GalleryImageCategoryId
            );

            // Map entities to DTOs (mapping will now succeed)
            return _mapper.Map<IEnumerable<GalleryImageDto>>(imagesForCategory);
        }

        /// <summary>
        /// POST /batch: Creates a new category/folder and adds a batch of images.
        /// </summary>
        /// <param name="dto">Batch metadata (CategoryName, IsMature, ImageMetadata).</param>
        /// <param name="files">The array of IFormFiles uploaded by the user.</param>
        /// <returns>The ID of the newly created category, or 0 on failure.</returns>
        public async Task<int> CreateImageBatchAsync(GalleryImageCreateBatchDto dto, IFormFile[] files)
        {
            // 1. Business Logic: Check if Category Name already exists
            GalleryImageCategory? existingCategory = await _categoryRepository.GetByNameAsync(dto.CategoryName);
            if (existingCategory != null)
            {
                return 0; // Category already exists, creation failed
            }

            // 2. Category Creation: Map DTO to Category Entity
            GalleryImageCategory newCategory = _mapper.Map<GalleryImageCategory>(dto);

            // 3. Repository: Add the new category and get its ID
            // NOTE: We assume CreateNewCategoryAsync returns the ID (or 0 on failure).
            int categoryId = await _categoryRepository.CreateNewCategoryAsync(newCategory);

            if (categoryId <= 0)
            {
                return 0; // Failed to create category
            }

            // 4. File and Entity Mapping
            List<GalleryImage> newImages = new List<GalleryImage>();
            long featuredImageId = 0; // To store the ID of the featured image after saving

            for (int i = 0; i < files.Length; i++)
            {
                IFormFile file = files[i];
                ImageMetadataDto imageMetadata = dto.Images[i];

                // **SIMULATE FILE STORAGE AND URL GENERATION**
                // In a real application, this is where you'd call a file storage service (e.g., Azure Blob, S3, local disk).
                // Example: string imageUrl = await _fileStorageService.UploadAsync(file);

                // For demonstration, we create a placeholder URL based on category and file name.
                string safeCategoryName = dto.CategoryName.Replace(" ", "-").ToLower();
                string safeFileName = Path.GetFileName(file.FileName); // Using Path.GetFileName for safety
                string imageUrl = @$"\images\ayami\{safeFileName}";

                // Create the image entity
                GalleryImage newImage = new GalleryImage
                {
                    ImageUrl = imageUrl,
                    AltText = file.FileName, // Use filename as default alt text
                    IsFeatured = imageMetadata.IsFeatured,
                    IsMatureContent = dto.IsMatureContent,
                    GalleryImageCategoryId = categoryId, // Use the new ID
                    DateAdded = DateTime.UtcNow,
                    DateModified = DateTime.UtcNow
                };

                newImages.Add(newImage);
            }

            // 5. Repository: Add all new image entities
            await _galleryRepository.AddRangeAsync(newImages);
            int rowsAdded = await _galleryRepository.SaveChangesAsync();

            return rowsAdded > 0 ? categoryId : 0;
        }

        /// <summary>
        /// POST /single: Adds a single image to an existing category.
        /// </summary>
        /// <param name="dto">Image metadata (CategoryId, AltText, IsFeatured, etc.).</param>
        /// <param name="file">The single IFormFile uploaded by the user.</param>
        /// <returns>The newly created GalleryImageDto.</returns>
        public async Task<GalleryImageDto?> CreateSingleImageAsync(GalleryImageCreateSingleDto dto, IFormFile file)
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

            // **SIMULATE FILE STORAGE AND URL GENERATION**
            // In a production application, this should call a secure file storage service.

            // Get a safe filename. We don't need the category name embedded since it's a single add.
            string safeFileName = Path.GetFileName(file.FileName);
            string imageUrl = @$"\images\ayami\{safeFileName}"; // Placeholder URL

            // 4. Mapping: Create new entity
            GalleryImage newImage = new GalleryImage
            {
                ImageUrl = imageUrl,
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

            // Set the navigation property here instead
            newImage.Category = category;

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
        /// PUT /images/{imageId}: Updates the category, maturity flag, and alt text for a single image.
        /// </summary>
        /// <param name="imageId">The ID of the image to update.</param>
        /// <param name="dto">The new data (New category ID, IsMatureContent).</param>
        /// <returns>True if the image was successfully updated, otherwise False.</returns>
        public async Task<bool> UpdateSingleImageAsync(long imageId, GalleryImageUpdateSingleDto dto)
        {
            // 1. Retrieve the image to update (Needs to be tracked for changes)
            GalleryImage? imageToUpdate = await _galleryRepository.GetTrackedByIdAsync(imageId);

            if (imageToUpdate == null)
            {
                return false; // Image not found
            }

            // 2. Validate the target category's existence
            GalleryImageCategory? targetCategory = await _categoryRepository.GetReadOnlyByIdAsync(dto.NewGalleryImageCategoryId);

            if (targetCategory == null)
            {
                return false; // New category does not exist
            }

            // --- Business Logic Checks ---

            int originalCategoryId = imageToUpdate.GalleryImageCategoryId;
            bool wasFeatured = imageToUpdate.IsFeatured;

            // 3. Update Image Properties
            imageToUpdate.IsMatureContent = dto.IsMatureContent;
            imageToUpdate.DateModified = DateTime.UtcNow;

            // Check if the image is moving to a *new* category
            if (originalCategoryId != dto.NewGalleryImageCategoryId)
            {
                // Set the new category ID
                imageToUpdate.GalleryImageCategoryId = dto.NewGalleryImageCategoryId;

                // If the image was featured in its original category, we must unset it.
                // NOTE: We rely on the admin to set a new featured image for the *original* folder later, 
                // but we *must* ensure the moved image is not featured in the new category unless explicitly set.
                if (wasFeatured)
                {
                    imageToUpdate.IsFeatured = false;

                    // Business Logic: If the image was the featured one for the OLD category, 
                    // the old category now needs a new featured image (or it will default to the first image in the category).
                    // For now, we will leave the old category without a featured image and rely on a nightly job/admin to fix this.
                    // This is a known, acceptable tradeoff for the current sprint scope.
                }
            }

            // NOTE: We are NOT changing the IsFeatured flag based on the DTO here,
            // as changing the featured image should be a separate, explicit action 
            // that updates the whole category (or we would need a new DTO field for it).
            // This method is for *moving* and *maturing*, not setting the featured status.

            // 4. Repository: Update the entity (already tracked) and save changes
            await _galleryRepository.Update(imageToUpdate); // Update call for explicit clarity, though tracking handles it.
            int rowsAffected = await _galleryRepository.SaveChangesAsync();

            return rowsAffected > 0;
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

            // 2. If images are successfully deleted, delete the category
            if (deletedCount > 0)
            {
                try
                {
                    await DeleteCategoryAsync(categoryId);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    return false;
                }
            }
            else
            {
                throw new Exception("Images failed to delete, please review");
                return false;
            }

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

        public async Task<bool> DeleteCategoryAsync(int categoryId)
        {
            // Call the repository method to delete the category
            int deletedCount = await _categoryRepository.DeleteCategoryByIdAsync(categoryId);

            // return true or false
            return deletedCount > 0;
        }
    }
}
