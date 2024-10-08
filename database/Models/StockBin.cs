using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class StockBin
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string BinCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string BinName { get; set; }
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
