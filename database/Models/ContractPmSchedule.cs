using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ContractPmSchedule
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract Contract { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string PmScheduleNumber { get; set; }
        [Column(TypeName = "date")]
        public DateTime PeriodFrom { get; set; }
        [Column(TypeName = "date")]
        public DateTime PeriodTo { get; set; }
        [Column(TypeName = "date")]
        public DateTime PmDueDate { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
    }
}
