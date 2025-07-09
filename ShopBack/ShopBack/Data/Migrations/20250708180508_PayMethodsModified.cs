using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShopBack.Data.Migrations
{
    /// <inheritdoc />
    public partial class PayMethodsModified : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StripeCustomerId",
                table: "PayMethods",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StripeCustomerId",
                table: "PayMethods");
        }
    }
}
