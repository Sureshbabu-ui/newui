using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class GstRate
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string TenantServiceCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string TenantServiceName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string ServiceAccountCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string ServiceAccountDescription { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(5,2)")]
        public decimal Cgst { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(5,2)")]
        public decimal Sgst { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(5,2)")]
        public decimal Igst { get; set; }
        [DefaultValue(1)]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
    }
}
