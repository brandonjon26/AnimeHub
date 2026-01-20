using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AnimeHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddStructuredLogging : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LogLevelLookup",
                columns: table => new
                {
                    LogLevelId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogLevelLookup", x => x.LogLevelId);
                });

            migrationBuilder.CreateTable(
                name: "LogSourceLookup",
                columns: table => new
                {
                    LogSourceId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogSourceLookup", x => x.LogSourceId);
                });

            migrationBuilder.CreateTable(
                name: "LogEntry",
                columns: table => new
                {
                    LogEntryId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LogLevelId = table.Column<int>(type: "int", nullable: false),
                    LogSourceId = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExceptionType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ExceptionMessage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StackTrace = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TraceId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Payload = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LogEntry", x => x.LogEntryId);
                    table.ForeignKey(
                        name: "FK_LogEntry_LogLevelLookup_LogLevelId",
                        column: x => x.LogLevelId,
                        principalTable: "LogLevelLookup",
                        principalColumn: "LogLevelId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LogEntry_LogSourceLookup_LogSourceId",
                        column: x => x.LogSourceId,
                        principalTable: "LogSourceLookup",
                        principalColumn: "LogSourceId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "LogLevelLookup",
                columns: new[] { "LogLevelId", "Description" },
                values: new object[,]
                {
                    { 0, "Information" },
                    { 1, "Warning" },
                    { 2, "Error" },
                    { 3, "Critical" }
                });

            migrationBuilder.InsertData(
                table: "LogSourceLookup",
                columns: new[] { "LogSourceId", "Description" },
                values: new object[,]
                {
                    { 0, "System" },
                    { 1, "WebAPI" },
                    { 2, "Scraper" },
                    { 3, "Database" },
                    { 4, "Security" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_LogEntry_LogLevelId",
                table: "LogEntry",
                column: "LogLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_LogEntry_LogSourceId",
                table: "LogEntry",
                column: "LogSourceId");

            migrationBuilder.CreateIndex(
                name: "IX_LogEntry_Timestamp",
                table: "LogEntry",
                column: "Timestamp");

            migrationBuilder.CreateIndex(
                name: "IX_LogEntry_TraceId",
                table: "LogEntry",
                column: "TraceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LogEntry");

            migrationBuilder.DropTable(
                name: "LogLevelLookup");

            migrationBuilder.DropTable(
                name: "LogSourceLookup");
        }
    }
}
