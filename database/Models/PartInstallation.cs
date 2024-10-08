using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class PartInstallation
    {
        public int Id { get; set; }
        [ForeignKey("ServiceRequestId")]
        public int ServiceRequestId { get; set; }
        public ServiceRequest? ServiceRequest { get; set; }
        [ForeignKey("ServiceEngineerVisitId")]
        public int ServiceEngineerVisitId { get; set; }
        public ServiceEngineerVisit? ServiceEngineerVisit { get; set; }
        [ForeignKey("PartStockId")]
        public int PartStockId { get; set; }
        public PartStock? PartStock { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? InstalledOn { get; set; }
    }
}
