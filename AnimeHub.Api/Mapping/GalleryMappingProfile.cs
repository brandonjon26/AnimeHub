using AutoMapper;
using AnimeHub.Api.Entities;
using AnimeHub.Api.DTOs.GalleryImage;

namespace AnimeHub.Api.Mapping
{
    public class GalleryMappingProfile : Profile
    {
        public GalleryMappingProfile()
        {
            // Mapping for Gallery Categories
            CreateMap<GalleryImageCategory, GalleryImageCategoryDto>()
                .ForMember(
                    dest => dest.CoverUrl,
                    opt => opt.Ignore() // Cover URL is determined in the Service layer
                );

            // Mapping for Gallery Images
            CreateMap<GalleryImage, GalleryImageDto>()
                .ForMember(
                    dest => dest.CategoryName,
                    // Pull the display name from the related Category entity
                    opt => opt.MapFrom(src => src.Category!.Name)
                );

            // We only allow updates to certain fields
            CreateMap<GalleryImageUpdateDto, GalleryImage>()
                .ForMember(dest => dest.GalleryImageId, opt => opt.Ignore())       // ID is passed in the URL
                .ForMember(dest => dest.DateAdded, opt => opt.Ignore())            // DateAdded should not change
                .ForMember(dest => dest.DateModified, opt => opt.MapFrom(_ => DateTime.UtcNow)) // Set manually in service or map here
                .ForMember(dest => dest.GalleryImageCategoryId, opt => opt.Ignore()) // Category change is complex, ignore for now
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            // 2. ImageMetadataDto -> GalleryImage (for POST /batch processing)
            // Maps the core image fields (Url, AltText, IsFeatured). 
            // The Service layer manually sets CategoryId, IsMatureContent, and Dates.
            CreateMap<ImageMetadataDto, GalleryImage>()
                .ForMember(dest => dest.GalleryImageId, opt => opt.Ignore())
                .ForMember(dest => dest.GalleryImageCategoryId, opt => opt.Ignore())
                .ForMember(dest => dest.IsMatureContent, opt => opt.Ignore())
                .ForMember(dest => dest.DateAdded, opt => opt.Ignore())
                .ForMember(dest => dest.DateModified, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            // 3. GalleryImageCreateSingleDto -> GalleryImage (for POST /single)
            // Maps ImageUrl, AltText, IsFeatured. 
            // The Service layer manually sets CategoryId, IsMatureContent, and Dates.
            CreateMap<GalleryImageCreateSingleDto, GalleryImage>()
                .ForMember(dest => dest.GalleryImageId, opt => opt.Ignore())
                .ForMember(dest => dest.GalleryImageCategoryId, opt => opt.MapFrom(src => src.CategoryId)) // Map CategoryId explicitly
                .ForMember(dest => dest.IsMatureContent, opt => opt.Ignore()) // Determined by Category entity in Service
                .ForMember(dest => dest.DateAdded, opt => opt.Ignore())
                .ForMember(dest => dest.DateModified, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            // 4. GalleryImageUpdateFolderDto -> GalleryImage 
            // NO MAPPING REQUIRED. The DTO is passed directly to the Repository's ExecuteUpdateAsync
            // for efficient bulk operation, bypassing AutoMapper.
        }
    }
}
