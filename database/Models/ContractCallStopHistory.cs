using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class ContractCallStopHistory
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        [Column(TypeName = "date")]
        public DateTime StopDate { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string StopReason { get; set; }
        public int StoppedBy { get; set; }
        [Column(TypeName = "date")]
        public DateTime? ResetDate { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? ResetReason { get; set; }
        public int? ResetBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
    }
}
