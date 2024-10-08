using Bogus.DataSets;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class DeliveryChallanDetail
    {
        public int Id { get; set; }
        [ForeignKey("DeliveryChallanId")]
        public int DeliveryChallanId { get; set; }
        public DeliveryChallan? DeliveryChallan { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string? PartIndentDemandNumber { get; set; }
        [ForeignKey("PartStockId")]
        public int PartStockId { get; set; }
        public PartStock? PartStock { get; set; }
    }
}
