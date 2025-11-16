namespace AnimeHub.Api.DTOs.GalleryImage
{
    // DTO for the gallery folders/albums metadata
    public class GalleryImageCategoryDto
    {
        public int GalleryImageCategoryId { get; init; }
        public string Name { get; init; } = string.Empty;
        public string CoverUrl { get; set; } = string.Empty; // We'll assume the first featured image URL for now
        public bool isMatureContent { get; set; } = false;
    }
}
