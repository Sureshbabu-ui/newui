using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class PartProductCategoryToPartCategoryMapping
    {
        public int Id { get; set; }
        [ForeignKey("PartCategoryId")]
        public int PartCategoryId { get; set; }
        public PartCategory? PartCategory { get; set; }
        [ForeignKey("PartProductCategoryId")]
        public int PartProductCategoryId { get; set; }
        public PartProductCategory? PartProductCategory { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
    }
}
