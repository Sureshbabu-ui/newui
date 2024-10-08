using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(Code), IsUnique = true)]
    [Microsoft.EntityFrameworkCore.Index(nameof(ModelName), IsUnique = true)]
    public class Product
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string Code { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(96)]
        public string ModelName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? Description { get; set; }
        [ForeignKey("AssetProductCategoryId")]
        public int AssetProductCategoryId { get; set; }
        public AssetProductCategory? AssetProductCategory { get; set; }
        [ForeignKey("MakeId")]
        public int MakeId { get; set; }
        public Make? Make { get; set; }
        public short? ManufacturingYear { get; set; }
        public int? AmcValue { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
        public int? DeletedBy { get; set; }
    }
}
