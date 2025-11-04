using AnimeHub.Api.DTOs;
using AnimeHub.Api.Repositories;
using AnimeHub.Api.Entities;
using AutoMapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
    }
}
