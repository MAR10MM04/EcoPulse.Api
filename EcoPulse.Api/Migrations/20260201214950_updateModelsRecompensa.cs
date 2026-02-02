using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EcoPulse.Api.Migrations
{
    /// <inheritdoc />
    public partial class updateModelsRecompensa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Activo",
                table: "Recompensas",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaCreacion",
                table: "Recompensas",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "Stock",
                table: "Recompensas",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UrlFoto",
                table: "Recompensas",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Recompensas_IdComercio",
                table: "Recompensas",
                column: "IdComercio");

            migrationBuilder.CreateIndex(
                name: "IX_Comercios_IdUsuario",
                table: "Comercios",
                column: "IdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_Comercios_Usuarios_IdUsuario",
                table: "Comercios",
                column: "IdUsuario",
                principalTable: "Usuarios",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Recompensas_Comercios_IdComercio",
                table: "Recompensas",
                column: "IdComercio",
                principalTable: "Comercios",
                principalColumn: "IdComercio",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comercios_Usuarios_IdUsuario",
                table: "Comercios");

            migrationBuilder.DropForeignKey(
                name: "FK_Recompensas_Comercios_IdComercio",
                table: "Recompensas");

            migrationBuilder.DropIndex(
                name: "IX_Recompensas_IdComercio",
                table: "Recompensas");

            migrationBuilder.DropIndex(
                name: "IX_Comercios_IdUsuario",
                table: "Comercios");

            migrationBuilder.DropColumn(
                name: "Activo",
                table: "Recompensas");

            migrationBuilder.DropColumn(
                name: "FechaCreacion",
                table: "Recompensas");

            migrationBuilder.DropColumn(
                name: "Stock",
                table: "Recompensas");

            migrationBuilder.DropColumn(
                name: "UrlFoto",
                table: "Recompensas");
        }
    }
}
