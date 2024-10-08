using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class GoodsReceivedNoteDetail
    {
        public int Id { get; set; }
        [ForeignKey("GoodsReceivedNoteId")]
        public int GoodsReceivedNoteId { get; set; }
        public GoodsReceivedNote? GoodsReceivedNote { get; set; }
        [ForeignKey("PartId")]
        public int PartId { get; set; }
        public Part? Part { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string SerialNumber { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(16,2)")]
        public decimal Rate { get; set; }
    }
}
