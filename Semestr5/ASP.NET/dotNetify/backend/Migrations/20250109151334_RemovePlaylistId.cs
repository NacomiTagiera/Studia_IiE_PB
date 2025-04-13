using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace dotNETify.Migrations
{
    /// <inheritdoc />
    public partial class RemovePlaylistId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
           migrationBuilder.DropColumn(
           name: "PlaylistId",
           table: "Songs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
               name: "PlaylistId",
               table: "Songs",
               type: "integer",
               nullable: true);
        }
    }
}
