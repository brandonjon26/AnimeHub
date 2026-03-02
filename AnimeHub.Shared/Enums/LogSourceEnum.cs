namespace AnimeHub.Shared.Enums
{
    public enum LogSource
    {
        None = 0,      // Default record
        System = 1,    // General application startup/shutdown
        WebAPI = 2,    // Standard API request/response flow
        Scraper = 3,   // External Python Scraper jobs
        Database = 4,  // EF Core or SQL specific issues
        Security = 5   // Auth failures, suspicious activity
    }
}
