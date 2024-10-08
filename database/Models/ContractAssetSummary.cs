using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ContractAssetSummary
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract? Contract { get; set; }
        [ForeignKey("AssetProductCategoryId")]
        public int AssetProductCategoryId { get; set; }
        public AssetProductCategory? AssetProductCategory { get; set; }
        public int ProductCountAtBooking { get; set; }
        [DefaultValue(0)]
        public int ProductCount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal AmcRate { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal AmcValue { get; set; }    
        [DefaultValue(false)]
        public bool? IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
