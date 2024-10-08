using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;

namespace BeSureApi.Models
{
    public class ContractInvoiceScheduleList
    {
        public int Id { get; set; }
        public short ScheduleNumber { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal RrPerDay { get; set; }
        public decimal TotalRrValue { get; set; }
        public DateTime ScheduledInvoiceDate { get; set; }
        public decimal ScheduledInvoiceAmount { get; set; }
        public int ContractInvoiceId { get; set; }
        public bool IsInvoiceApproved { get; set; }
    }
}
