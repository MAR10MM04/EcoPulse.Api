using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcoPulse.Api.Migrations
{
    /// <inheritdoc />
    public partial class updatecentro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ciudad",
                table: "CentrosAcopio");

            migrationBuilder.DropColumn(
                name: "Direccion",
                table: "CentrosAcopio");

            migrationBuilder.DropColumn(
                name: "Estado",
                table: "CentrosAcopio");

            migrationBuilder.AddColumn<double>(
                name: "Latitud",
                table: "CentrosAcopio",
                type: "double",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitud",
                table: "CentrosAcopio",
                type: "double",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitud",
                table: "CentrosAcopio");

            migrationBuilder.DropColumn(
                name: "Longitud",
                table: "CentrosAcopio");

            migrationBuilder.AddColumn<string>(
                name: "Ciudad",
                table: "CentrosAcopio",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Direccion",
                table: "CentrosAcopio",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Estado",
                table: "CentrosAcopio",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
