using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Contracts;
using System.ComponentModel;

namespace database.Models
{
    public class ImprestStock
    {
        public int Id { get; set; }
        [ForeignKey("PartStockId")]
        public int PartStockId { get; set; }
        public PartStock? PartStock { get; set; }
        [ForeignKey("CustomerId")]
        public int CustomerId { get; set; }
        public Customer? Customer { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract? Contract { get; set; }
        [ForeignKey("CustomerSiteId")] 
        public int? CustomerSiteId { get; set; }
        public CustomerSite? CustomerSite { get; set; }
        [ForeignKey("ServiceEngineerId")]
        public int? ServiceEngineerId { get; set; }
        public UserInfo? ServiceEngineer { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime ReservedFrom {  get; set; }
        [Column(TypeName = "datetime")]
        public DateTime ReservedTo { get; set; }

        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Remarks { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime AllocatedOn { get; set; }
        public int AllocatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ReleasedOn { get; set; }
        public int? ReleasedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ReceivedOn { get; set; }
        public int? ReceivedBy { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(256)]
        public string? CustomerHandoverInfo { get; set; }
        [DefaultValue(0)]
        public bool IsCurrentlyDeployed { get; set; }
        [DefaultValue(1)]
        public bool IsActive { get; set; }
    }
}