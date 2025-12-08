using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class CharacterSystemGeneralization : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccessoryAttireJoins_AyamiAccessories_AccessoryId",
                table: "AccessoryAttireJoins");

            migrationBuilder.DropForeignKey(
                name: "FK_AccessoryAttireJoins_AyamiAttires_AttireId",
                table: "AccessoryAttireJoins");

            migrationBuilder.DropTable(
                name: "AyamiAccessories");

            migrationBuilder.DropTable(
                name: "AyamiAttires");

            migrationBuilder.DropTable(
                name: "AyamiProfiles");

            migrationBuilder.RenameColumn(
                name: "AccessoryId",
                table: "AccessoryAttireJoins",
                newName: "CharacterAccessoryId");

            migrationBuilder.RenameColumn(
                name: "AttireId",
                table: "AccessoryAttireJoins",
                newName: "CharacterAttireId");

            migrationBuilder.RenameIndex(
                name: "IX_AccessoryAttireJoins_AccessoryId",
                table: "AccessoryAttireJoins",
                newName: "IX_AccessoryAttireJoins_CharacterAccessoryId");

            migrationBuilder.CreateTable(
                name: "CharacterAccessories",
                columns: table => new
                {
                    CharacterAccessoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsWeapon = table.Column<bool>(type: "bit", nullable: false),
                    UniqueEffect = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterAccessories", x => x.CharacterAccessoryId);
                });

            migrationBuilder.CreateTable(
                name: "LoreTypes",
                columns: table => new
                {
                    LoreTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoreTypes", x => x.LoreTypeId);
                });

            migrationBuilder.CreateTable(
                name: "LoreEntries",
                columns: table => new
                {
                    LoreEntryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LoreTypeId = table.Column<int>(type: "int", maxLength: 50, nullable: false),
                    Narrative = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoreEntries", x => x.LoreEntryId);
                    table.ForeignKey(
                        name: "FK_LoreEntries_LoreTypes_LoreTypeId",
                        column: x => x.LoreTypeId,
                        principalTable: "LoreTypes",
                        principalColumn: "LoreTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CharacterProfiles",
                columns: table => new
                {
                    CharacterProfileId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    JapaneseFirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    JapaneseLastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Age = table.Column<int>(type: "int", nullable: false),
                    Origin = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Vibe = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Height = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    BodyType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Hair = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Eyes = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Skin = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UniquePower = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    GreatestFeatLoreId = table.Column<int>(type: "int", nullable: false, defaultValueSql: "0"),
                    MagicAptitude = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PrimaryEquipment = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BestFriendCharacterId = table.Column<int>(type: "int", nullable: true),
                    RomanticTensionDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterProfiles", x => x.CharacterProfileId);
                    table.ForeignKey(
                        name: "FK_CharacterProfiles_CharacterProfiles_BestFriendCharacterId",
                        column: x => x.BestFriendCharacterId,
                        principalTable: "CharacterProfiles",
                        principalColumn: "CharacterProfileId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CharacterProfiles_LoreEntries_GreatestFeatLoreId",
                        column: x => x.GreatestFeatLoreId,
                        principalTable: "LoreEntries",
                        principalColumn: "LoreEntryId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CharacterAttires",
                columns: table => new
                {
                    CharacterAttireId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    AttireType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    HairstyleDescription = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CharacterProfileId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterAttires", x => x.CharacterAttireId);
                    table.ForeignKey(
                        name: "FK_CharacterAttires_CharacterProfiles_CharacterProfileId",
                        column: x => x.CharacterProfileId,
                        principalTable: "CharacterProfiles",
                        principalColumn: "CharacterProfileId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CharacterLoreLinks",
                columns: table => new
                {
                    CharacterProfileId = table.Column<int>(type: "int", nullable: false),
                    LoreEntryId = table.Column<int>(type: "int", nullable: false),
                    CharacterRole = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterLoreLinks", x => new { x.CharacterProfileId, x.LoreEntryId });
                    table.ForeignKey(
                        name: "FK_CharacterLoreLinks_CharacterProfiles_CharacterProfileId",
                        column: x => x.CharacterProfileId,
                        principalTable: "CharacterProfiles",
                        principalColumn: "CharacterProfileId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CharacterLoreLinks_LoreEntries_LoreEntryId",
                        column: x => x.LoreEntryId,
                        principalTable: "LoreEntries",
                        principalColumn: "LoreEntryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CharacterAttires_CharacterProfileId",
                table: "CharacterAttires",
                column: "CharacterProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterLoreLinks_LoreEntryId",
                table: "CharacterLoreLinks",
                column: "LoreEntryId");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterProfiles_BestFriendCharacterId",
                table: "CharacterProfiles",
                column: "BestFriendCharacterId",
                unique: true,
                filter: "[BestFriendCharacterId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterProfiles_GreatestFeatLoreId",
                table: "CharacterProfiles",
                column: "GreatestFeatLoreId");

            migrationBuilder.CreateIndex(
                name: "IX_LoreEntries_LoreTypeId",
                table: "LoreEntries",
                column: "LoreTypeId");

            migrationBuilder.Sql(@"
                DELETE FROM [dbo].[AccessoryAttireJoins]
                WHERE CharacterAccessoryId = 0 OR CharacterAccessoryId NOT IN (
                    SELECT CharacterAccessoryId FROM [dbo].[CharacterAccessories]
                );
            ");

            migrationBuilder.AddForeignKey(
                name: "FK_AccessoryAttireJoins_CharacterAccessories_CharacterAccessoryId",
                table: "AccessoryAttireJoins",
                column: "CharacterAccessoryId",
                principalTable: "CharacterAccessories",
                principalColumn: "CharacterAccessoryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AccessoryAttireJoins_CharacterAttires_CharacterAttireId",
                table: "AccessoryAttireJoins",
                column: "CharacterAttireId",
                principalTable: "CharacterAttires",
                principalColumn: "CharacterAttireId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AccessoryAttireJoins_CharacterAccessories_CharacterAccessoryId",
                table: "AccessoryAttireJoins");

            migrationBuilder.DropForeignKey(
                name: "FK_AccessoryAttireJoins_CharacterAttires_CharacterAttireId",
                table: "AccessoryAttireJoins");

            migrationBuilder.DropTable(
                name: "CharacterAccessories");

            migrationBuilder.DropTable(
                name: "CharacterAttires");

            migrationBuilder.DropTable(
                name: "CharacterLoreLinks");

            migrationBuilder.DropTable(
                name: "CharacterProfiles");

            migrationBuilder.DropTable(
                name: "LoreEntries");

            migrationBuilder.DropTable(
                name: "LoreTypes");

            migrationBuilder.RenameColumn(
                name: "CharacterAccessoryId",
                table: "AccessoryAttireJoins",
                newName: "AccessoryId");

            migrationBuilder.RenameColumn(
                name: "CharacterAttireId",
                table: "AccessoryAttireJoins",
                newName: "AttireId");

            migrationBuilder.RenameIndex(
                name: "IX_AccessoryAttireJoins_CharacterAccessoryId",
                table: "AccessoryAttireJoins",
                newName: "IX_AccessoryAttireJoins_AccessoryId");

            migrationBuilder.CreateTable(
                name: "AyamiAccessories",
                columns: table => new
                {
                    AyamiAccessoryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsWeapon = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AyamiAccessories", x => x.AyamiAccessoryId);
                });

            migrationBuilder.CreateTable(
                name: "AyamiProfiles",
                columns: table => new
                {
                    AyamiProfileId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BodyType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Eyes = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Hair = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Height = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    JapaneseFirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    JapaneseLastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PrimaryEquipment = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Skin = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Vibe = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
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
                    ProfileId = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Hairstyle = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_AyamiAttires_ProfileId",
                table: "AyamiAttires",
                column: "ProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_AccessoryAttireJoins_AyamiAccessories_AccessoryId",
                table: "AccessoryAttireJoins",
                column: "AccessoryId",
                principalTable: "AyamiAccessories",
                principalColumn: "AyamiAccessoryId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AccessoryAttireJoins_AyamiAttires_AttireId",
                table: "AccessoryAttireJoins",
                column: "AttireId",
                principalTable: "AyamiAttires",
                principalColumn: "AyamiAttireId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
