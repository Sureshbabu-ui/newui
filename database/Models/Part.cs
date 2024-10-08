using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class Part
    {
        public int Id { get; set; }
        [ForeignKey("PartProductCategoryId")]
        public int PartProductCategoryId { get; set; }
        public PartProductCategory? PartProductCategory { get; set; }
        [ForeignKey("PartCategoryId")]
        public int PartCategoryId { get; set; }
        public PartCategory? PartCategory { get; set; }
        [ForeignKey("PartSubCategoryId")]
        public int? PartSubCategoryId { get; set; }
        public PartSubCategory? PartSubCategory { get; set; }
        [ForeignKey("MakeId")]
        public int MakeId { get; set; }
        public Make? Make { get; set; }
        [ForeignKey("ProductId")]
        public int? ProductId { get; set; }
        public Product? Product { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string HsnCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string PartCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? MainCodeSol { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? TagSol { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string PartName { get; set; }
        [Column(TypeName = "decimal(8,2)")]
        public decimal? GstRate { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string OemPartNumber { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(1024)]
        public string? Description { get; set; }
        [DefaultValue(true)]
        public bool IsDefectiveReturnMandatory { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(16,2)")]
        public decimal Quantity { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public int ApprovedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ApprovedOn { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
