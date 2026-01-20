namespace AnimeHub.Api.Entities.Enums
{
    public enum LogSource
    {
        System = 0,    // General application startup/shutdown
        WebAPI = 1,    // Standard API request/response flow
        Scraper = 2,   // External Python Scraper jobs
        Database = 3,  // EF Core or SQL specific issues
        Security = 4   // Auth failures, suspicious activity
    }
}
