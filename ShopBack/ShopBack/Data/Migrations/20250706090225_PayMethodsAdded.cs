using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ShopBack.Data.Migrations
{
    /// <inheritdoc />
    public partial class PayMethodsAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Payments");

            migrationBuilder.AddColumn<int>(
                name: "PaymentMethodId",
                table: "Payments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "PayMethods",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CardLastFourDigits = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CardBrand = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ExpiryMonth = table.Column<int>(type: "integer", nullable: false),
                    ExpiryYear = table.Column<int>(type: "integer", nullable: false),
                    PaymentProviderToken = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PayMethods", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PayMethods_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_PaymentMethodId",
                table: "Payments",
                column: "PaymentMethodId");

            migrationBuilder.CreateIndex(
                name: "IX_PayMethods_UserId",
                table: "PayMethods",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_PayMethods_PaymentMethodId",
                table: "Payments",
                column: "PaymentMethodId",
                principalTable: "PayMethods",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_PayMethods_PaymentMethodId",
                table: "Payments");

            migrationBuilder.DropTable(
                name: "PayMethods");

            migrationBuilder.DropIndex(
                name: "IX_Payments_PaymentMethodId",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "PaymentMethodId",
                table: "Payments");

            migrationBuilder.AddColumn<string>(
                name: "PaymentMethod",
                table: "Payments",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }
    }
}
