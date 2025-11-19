using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class GalleryCategoryToIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. DROP THE FOREIGN KEY CONSTRAINT
            migrationBuilder.DropForeignKey(
                name: "FK_GalleryImage_GalleryImageCategory_GalleryImageCategoryId",
                table: "GalleryImage");

            // 2. DROP THE PRIMARY KEY CONSTRAINT
            migrationBuilder.DropPrimaryKey(
                name: "PK_GalleryImageCategory",
                table: "GalleryImageCategory");

            // --- STRUCTURAL CHANGE BATCHES (Prevents Invalid Column Name Error) ---

            // 3. Add the new column with the Identity property (Batch 1)
            migrationBuilder.Sql("ALTER TABLE [GalleryImageCategory] ADD [NewGalleryImageCategoryId] INT NOT NULL IDENTITY(1,1);");

            // 4. Drop the old column (Batch 2)
            migrationBuilder.Sql("ALTER TABLE [GalleryImageCategory] DROP COLUMN [GalleryImageCategoryId];");

            // 5. Rename the new column to the original name (Batch 3)
            migrationBuilder.Sql("EXEC sp_rename '[GalleryImageCategory].[NewGalleryImageCategoryId]', 'GalleryImageCategoryId', 'COLUMN';");

            // ----------------------------------------------------------------------

            // 6. RE-ADD PRIMARY KEY CONSTRAINT
            migrationBuilder.AddPrimaryKey(
                name: "PK_GalleryImageCategory",
                table: "GalleryImageCategory",
                column: "GalleryImageCategoryId");

            // 7. RESEED the identity counter (New inserts start at ID 3)
            migrationBuilder.Sql("DBCC CHECKIDENT('GalleryImageCategory', RESEED, 2)");

            // 8. RE-ADD FOREIGN KEY CONSTRAINT
            migrationBuilder.AddForeignKey(
                name: "FK_GalleryImage_GalleryImageCategory_GalleryImageCategoryId",
                table: "GalleryImage",
                column: "GalleryImageCategoryId",
                principalTable: "GalleryImageCategory",
                principalColumn: "GalleryImageCategoryId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // This is complex, but generally you would reverse the process:
            // 1. Drop FK
            // 2. Drop the column (or create a temp column, copy data, drop original, rename temp)
            // 3. Recreate the column without identity and with DatabaseGeneratedOption.None
            // 4. Re-add FK
            // Given the complexity, you can simplify the 'Down' migration if you don't intend to roll back:

            migrationBuilder.AlterColumn<int>(
                name: "GalleryImageCategoryId",
                table: "GalleryImageCategory",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .OldAnnotation("SqlServer:Identity", "1, 1");
        }
    }
}
