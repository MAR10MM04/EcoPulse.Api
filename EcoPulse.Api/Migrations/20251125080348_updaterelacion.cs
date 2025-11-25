using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcoPulse.Api.Migrations
{
    /// <inheritdoc />
    public partial class updaterelacion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entregas_CentrosAcopio_IdCentroAcopio",
                table: "Entregas");

            migrationBuilder.AddForeignKey(
                name: "FK_Entregas_CentrosAcopio_IdCentroAcopio",
                table: "Entregas",
                column: "IdCentroAcopio",
                principalTable: "CentrosAcopio",
                principalColumn: "IdCentroAcopio",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entregas_CentrosAcopio_IdCentroAcopio",
                table: "Entregas");

            migrationBuilder.AddForeignKey(
                name: "FK_Entregas_CentrosAcopio_IdCentroAcopio",
                table: "Entregas",
                column: "IdCentroAcopio",
                principalTable: "CentrosAcopio",
                principalColumn: "IdCentroAcopio",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
