using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopBack.Data.Migrations
{
    /// <inheritdoc />
    public partial class OrdersTableFixed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProductsId",
                table: "OrderItems",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductsId",
                table: "OrderItems",
                column: "ProductsId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_Products_ProductsId",
                table: "OrderItems",
                column: "ProductsId",
                principalTable: "Products",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_Products_ProductsId",
                table: "OrderItems");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_ProductsId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "ProductsId",
                table: "OrderItems");
        }
    }
}
