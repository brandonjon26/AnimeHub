using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixCharacterProfileTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CharacterProfiles_BestFriendCharacterId",
                table: "CharacterProfiles");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterProfiles_BestFriendCharacterId",
                table: "CharacterProfiles",
                column: "BestFriendCharacterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CharacterProfiles_BestFriendCharacterId",
                table: "CharacterProfiles");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterProfiles_BestFriendCharacterId",
                table: "CharacterProfiles",
                column: "BestFriendCharacterId",
                unique: true,
                filter: "[BestFriendCharacterId] IS NOT NULL");
        }
    }
}
