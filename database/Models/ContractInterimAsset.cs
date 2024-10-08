using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ContractInterimAsset
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract? Contract { get; set; }
        [ForeignKey("CustomerSiteId")]
        public int CustomerSiteId { get; set; }
        public CustomerSite? CustomerSite { get; set; }
        [ForeignKey("AssetProductCategoryId")]
        public int AssetProductCategoryId { get; set; }
        public AssetProductCategory? AssetProductCategory { get; set; }
        public int ProductMakeId { get; set; }
        [ForeignKey("ProductMakeId")]
        public Make? ProductMake { get; set; }
        public int ProductModelId { get; set; }
        [ForeignKey("ProductModelId")]
        public Product? ProductModel { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? ProductSerialNumber { get; set; }
        [ForeignKey("MasterEntityData")]
        public int InterimAssetStatusId { get; set; }
        public MasterEntityData? InterimAssetStatus { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? ReviewRemarks { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ReviewedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ReviewedOn { get; set; }
    }
}
