using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class AssetProductCategoryPartNotCovered
    {
        public int Id { get; set; }
        [ForeignKey("AssetProductCategoryId")]
        public int AssetProductCategoryId { get; set; }
        public AssetProductCategory AssetProductCategory { get; set; }
        [ForeignKey("PartCategoryId")]
        public int PartCategoryId { get; set; }
        public PartCategory PartCategory { get; set; }
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
