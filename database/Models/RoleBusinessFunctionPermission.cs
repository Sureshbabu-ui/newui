using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using BeSureApi.Models;

namespace database.Models
{
    public class RoleBusinessFunctionPermission
    {
        public int Id { get; set; }
        [ForeignKey("RoleId")]
        public int RoleId { get; set; }
        public Role? Role { get; set; }
        [ForeignKey("BusinessFunctionId")]
        public int BusinessFunctionId { get; set; }
        public BusinessFunction? BusinessFunction { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
    }
}
