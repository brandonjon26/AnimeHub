namespace AnimeHub.Api.Entities.Enums
{
    public enum GalleryImageCategoryEnum
    {        
        None = 0, // Default value      
        StandardAnimeIsekai = 1, // Maps to the 'standard' category in SQL        
        ChibiStyle = 2, // Maps to the 'chibi' category in SQL
        NSFWStyle = 3 // Maps to the 'NSFW' category in SQL
    }
}
