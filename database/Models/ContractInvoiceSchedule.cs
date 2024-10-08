using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class ContractInvoiceSchedule
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract Contract { get; set; }
        public short ScheduleNumber { get; set; }
        [Column(TypeName = "date")]
        public DateTime StartDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime EndDate { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal RrPerDay { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal TotalRrValue { get; set; }
        [Column(TypeName = "date")]
        public DateTime ScheduledInvoiceDate { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal ScheduledInvoiceAmount { get; set; }
        [DefaultValue(false)]
        public bool IsInvoiceApproved { get; set; }
        public int? InvoiceApprovedBy { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        [DefaultValue(false)]
        public Boolean? IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
        [ForeignKey("InvoiceApprovedBy")]
        public UserInfo? UserInfo { get; set; }

    }
}
