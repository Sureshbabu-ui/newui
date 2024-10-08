using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class GoodsIssuedReceivedDetail
    {
        public int Id { get; set; }
        [ForeignKey("GoodsIssuedReceivedNoteId")]
        public int GoodsIssuedReceivedNoteId { get; set; }
        public GoodsIssuedReceivedNote? GoodsIssuedReceivedNote { get; set; }
        [ForeignKey("PartStockId")]
        public int PartStockId { get; set; }
        public PartStock? PartStock { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(16,2)")]
        public decimal IssuedQuantity { get; set; }
    }
}
