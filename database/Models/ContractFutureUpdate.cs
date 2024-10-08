using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ContractFutureUpdate
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract Contract { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string SerialNumber { get; set; }
        [Column(TypeName = "date")]
        public DateTime? TargetDate { get; set; }
        [DefaultValue(0)]
        public int ProbabilityPercentage { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? RenewedMergedContractNumber { get; set; }
        public int StatusId { get; set; }
        public int SubStatusId { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        [DefaultValue(0)]
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
