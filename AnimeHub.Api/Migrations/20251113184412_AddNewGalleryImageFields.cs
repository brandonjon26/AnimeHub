using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddNewGalleryImageFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DateModified",
                table: "GalleryImage",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsMatureContent",
                table: "GalleryImage",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateModified",
                table: "GalleryImage");

            migrationBuilder.DropColumn(
                name: "IsMatureContent",
                table: "GalleryImage");
        }
    }
}
