using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class BusinessFunction
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string BusinessFunctionName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string BusinessFunctionCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Description { get; set; }
        [ForeignKey("BusinessModuleId")]
        public int BusinessModuleId { get; set; }
        public BusinessModule? BusinessModule { get; set; }
        [ForeignKey("BusinessModuleId")]
        public int? BusinessFunctionTypeId { get; set; }
        public MasterEntityData? BusinessFunctionType { get; set; }
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
