using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AnimeHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class ReworkGalleryImageCategoryToEnum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GalleryImageCategory",
                columns: table => new
                {
                    GalleryImageCategoryId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GalleryImageCategory", x => x.GalleryImageCategoryId);
                });

            migrationBuilder.CreateTable(
                name: "GalleryImage",
                columns: table => new
                {
                    GalleryImageId = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImageUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    AltText = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    IsFeatured = table.Column<bool>(type: "bit", nullable: false),
                    GalleryImageCategoryId = table.Column<int>(type: "int", nullable: false),
                    DateAdded = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GalleryImage", x => x.GalleryImageId);
                    table.ForeignKey(
                        name: "FK_GalleryImage_GalleryImageCategory_GalleryImageCategoryId",
                        column: x => x.GalleryImageCategoryId,
                        principalTable: "GalleryImageCategory",
                        principalColumn: "GalleryImageCategoryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "GalleryImageCategory",
                columns: new[] { "GalleryImageCategoryId", "Name" },
                values: new object[,]
                {
                    { 1, "Standard Anime/Isekai" },
                    { 2, "Chibi Style" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_GalleryImage_GalleryImageCategoryId",
                table: "GalleryImage",
                column: "GalleryImageCategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GalleryImage");

            migrationBuilder.DropTable(
                name: "GalleryImageCategory");
        }
    }
}
