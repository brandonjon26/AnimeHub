using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnimeHub.Api.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeAyamiAccessories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AyamiAccessories_AyamiAttires_AttireId",
                table: "AyamiAccessories");

            migrationBuilder.DropIndex(
                name: "IX_AyamiAccessories_AttireId",
                table: "AyamiAccessories");

            migrationBuilder.DropColumn(
                name: "AttireId",
                table: "AyamiAccessories");

            migrationBuilder.CreateTable(
                name: "AccessoryAttireJoins",
                columns: table => new
                {
                    AccessoryId = table.Column<int>(type: "int", nullable: false),
                    AttireId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccessoryAttireJoins", x => new { x.AttireId, x.AccessoryId });
                    table.ForeignKey(
                        name: "FK_AccessoryAttireJoins_AyamiAccessories_AccessoryId",
                        column: x => x.AccessoryId,
                        principalTable: "AyamiAccessories",
                        principalColumn: "AyamiAccessoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AccessoryAttireJoins_AyamiAttires_AttireId",
                        column: x => x.AttireId,
                        principalTable: "AyamiAttires",
                        principalColumn: "AyamiAttireId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AccessoryAttireJoins_AccessoryId",
                table: "AccessoryAttireJoins",
                column: "AccessoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AccessoryAttireJoins");

            migrationBuilder.AddColumn<int>(
                name: "AttireId",
                table: "AyamiAccessories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_AyamiAccessories_AttireId",
                table: "AyamiAccessories",
                column: "AttireId");

            migrationBuilder.AddForeignKey(
                name: "FK_AyamiAccessories_AyamiAttires_AttireId",
                table: "AyamiAccessories",
                column: "AttireId",
                principalTable: "AyamiAttires",
                principalColumn: "AyamiAttireId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
