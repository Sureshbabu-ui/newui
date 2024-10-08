using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class Country
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(3)]
        public string IsoThreeCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(2)]
        public string IsoTwoCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string Name { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string CallingCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(3)]
        public string CurrencyCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string CurrencyName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string CurrencySymbol { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [DefaultValue((1))]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
