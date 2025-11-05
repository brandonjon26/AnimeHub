using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AnimeHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAyamiProfileTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "GalleryImageCategory",
                keyColumn: "GalleryImageCategoryId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "GalleryImageCategory",
                keyColumn: "GalleryImageCategoryId",
                keyValue: 2);

            migrationBuilder.CreateTable(
                name: "AyamiProfiles",
                columns: table => new
                {
                    AyamiProfileId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    JapaneseFirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    JapaneseLastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Vibe = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Height = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    BodyType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Hair = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Eyes = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Skin = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PrimaryEquipment = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AyamiProfiles", x => x.AyamiProfileId);
                });

            migrationBuilder.CreateTable(
                name: "AyamiAttires",
                columns: table => new
                {
                    AyamiAttireId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Hairstyle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    ProfileId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AyamiAttires", x => x.AyamiAttireId);
                    table.ForeignKey(
                        name: "FK_AyamiAttires_AyamiProfiles_ProfileId",
                        column: x => x.ProfileId,
                        principalTable: "AyamiProfiles",
                        principalColumn: "AyamiProfileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AyamiAccessories",
                columns: table => new
                {
                    AyamiAccessoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsWeapon = table.Column<bool>(type: "bit", nullable: false),
                    AttireId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AyamiAccessories", x => x.AyamiAccessoryId);
                    table.ForeignKey(
                        name: "FK_AyamiAccessories_AyamiAttires_AttireId",
                        column: x => x.AttireId,
                        principalTable: "AyamiAttires",
                        principalColumn: "AyamiAttireId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AyamiAccessories_AttireId",
                table: "AyamiAccessories",
                column: "AttireId");

            migrationBuilder.CreateIndex(
                name: "IX_AyamiAttires_ProfileId",
                table: "AyamiAttires",
                column: "ProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AyamiAccessories");

            migrationBuilder.DropTable(
                name: "AyamiAttires");

            migrationBuilder.DropTable(
                name: "AyamiProfiles");

            migrationBuilder.InsertData(
                table: "GalleryImageCategory",
                columns: new[] { "GalleryImageCategoryId", "Name" },
                values: new object[,]
                {
                    { 1, "Standard Anime/Isekai" },
                    { 2, "Chibi Style" }
                });
        }
    }
}
