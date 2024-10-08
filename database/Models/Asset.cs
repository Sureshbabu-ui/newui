using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class Asset
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? MspAssetId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? CustomerAssetId { get; set; }
        [ForeignKey("AssetProductCategoryId")]
        public int AssetProductCategoryId { get; set; }
        public AssetProductCategory AssetProductCategory { get; set; }
        [ForeignKey("ProductMakeId")]
        public int ProductMakeId { get; set; }
        public Make ProductMake { get; set; }
        [ForeignKey("ProductModelId")]
        public int ProductModelId { get; set; }
        public Product ProductModel { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? ProductSerialNumber { get; set; }
        [Column(TypeName = "date")]
        public DateTime? WarrantyEndDate { get; set; }
        [ForeignKey("TenantOfficeId")]
        public int TenantOfficeId { get; set; }
        public TenantOffice TenantOffice { get; set; }
        [ForeignKey("CustomerSiteId")]
        public int CustomerSiteId { get; set; }
        public CustomerSite? CustomerSite { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
    }
}