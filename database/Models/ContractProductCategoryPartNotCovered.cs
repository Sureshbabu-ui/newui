using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class ContractProductCategoryPartNotCovered
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract? Contract { get; set; }
        [ForeignKey("AssetProductCategoryId")]
        public int AssetProductCategoryId { get; set; }
        public AssetProductCategory? AssetProductCategory { get; set; }
        [ForeignKey("PartCategoryId")]
        public int PartCategoryId { get; set; }
        public PartCategory? PartCategory { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [DefaultValue(false)]
        public bool? IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
