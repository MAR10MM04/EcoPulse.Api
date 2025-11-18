using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcoPulse.Api.Migrations
{
    /// <inheritdoc />
    public partial class AgregarRelacionesTablas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entregas_CentrosAcopio_CentroAcopioIdCentroAcopio",
                table: "Entregas");

            migrationBuilder.DropIndex(
                name: "IX_Entregas_CentroAcopioIdCentroAcopio",
                table: "Entregas");

            migrationBuilder.DropColumn(
                name: "CentroAcopioIdCentroAcopio",
                table: "Entregas");

            migrationBuilder.CreateIndex(
                name: "IX_Entregas_IdCentroAcopio",
                table: "Entregas",
                column: "IdCentroAcopio");

            migrationBuilder.CreateIndex(
                name: "IX_Entregas_IdMaterial",
                table: "Entregas",
                column: "IdMaterial");

            migrationBuilder.AddForeignKey(
                name: "FK_Entregas_CentrosAcopio_IdCentroAcopio",
                table: "Entregas",
                column: "IdCentroAcopio",
                principalTable: "CentrosAcopio",
                principalColumn: "IdCentroAcopio",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Entregas_Materiales_IdMaterial",
                table: "Entregas",
                column: "IdMaterial",
                principalTable: "Materiales",
                principalColumn: "IdMaterial",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Entregas_CentrosAcopio_IdCentroAcopio",
                table: "Entregas");

            migrationBuilder.DropForeignKey(
                name: "FK_Entregas_Materiales_IdMaterial",
                table: "Entregas");

            migrationBuilder.DropIndex(
                name: "IX_Entregas_IdCentroAcopio",
                table: "Entregas");

            migrationBuilder.DropIndex(
                name: "IX_Entregas_IdMaterial",
                table: "Entregas");

            migrationBuilder.AddColumn<int>(
                name: "CentroAcopioIdCentroAcopio",
                table: "Entregas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Entregas_CentroAcopioIdCentroAcopio",
                table: "Entregas",
                column: "CentroAcopioIdCentroAcopio");

            migrationBuilder.AddForeignKey(
                name: "FK_Entregas_CentrosAcopio_CentroAcopioIdCentroAcopio",
                table: "Entregas",
                column: "CentroAcopioIdCentroAcopio",
                principalTable: "CentrosAcopio",
                principalColumn: "IdCentroAcopio",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
