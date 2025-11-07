using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class UserProfileCascadeDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Drop the existing Foreign Key constraint
            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_AspNetUsers_UserId",
                table: "UserProfiles");

            // 2. Recreate the Foreign Key constraint with ON DELETE CASCADE
            migrationBuilder.AddForeignKey(
                name: "FK_UserProfiles_AspNetUsers_UserId", // Use the original name
                table: "UserProfiles",
                column: "UserId", // Use the EXISTING UserId column
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade); // The key change
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert: Drop the cascading constraint and recreate with NoAction (default)
            migrationBuilder.DropForeignKey(
                name: "FK_UserProfiles_AspNetUsers_UserId",
                table: "UserProfiles");

            migrationBuilder.AddForeignKey(
                name: "FK_UserProfiles_AspNetUsers_UserId",
                table: "UserProfiles",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }
    }
}
