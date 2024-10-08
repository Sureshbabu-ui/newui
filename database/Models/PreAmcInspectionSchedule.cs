using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class PreAmcInspectionSchedule
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract? Contract { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string ScheduleNumber { get; set; }
        [ForeignKey("ContractCustomerSiteId")]
        public int ContractCustomerSiteId { get; set; }
        public ContractCustomerSite? ContractCustomerSite { get; set; }
        [Column(TypeName = "date")]
        public DateTime StartsOn { get; set; }
        [Column(TypeName = "date")]
        public DateTime EndsOn { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
