using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopBack.Data.Migrations
{
    /// <inheritdoc />
    public partial class SomeSmallFixes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitPrice",
                table: "OrderItems");

            migrationBuilder.AddColumn<string>(
                name: "Header",
                table: "ProductReviews",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Header",
                table: "ProductReviews");

            migrationBuilder.AddColumn<decimal>(
                name: "UnitPrice",
                table: "OrderItems",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
