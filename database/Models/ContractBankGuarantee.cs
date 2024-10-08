using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class ContractBankGuarantee
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract Contract { get; set; }
        [ForeignKey("MasterEntityData")]
        public int GuaranteeType { get; set; }
        public MasterEntityData? GuaranteeTypeData { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string GuaranteeNumber { get; set; }
        [ForeignKey("BankBranchInfoId")]
        public int BankBranchInfoId { get; set; }
        public BankBranchInfo BankBranchInfo { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal GuaranteeAmount { get; set; }
        [Column(TypeName = "date")] 
        public DateTime GuaranteeStartDate { get; set; }
        [Column(TypeName = "date")] 
        public DateTime GuaranteeEndDate { get; set; }
        public short GuaranteeClaimPeriodInDays { get; set; }
        [ForeignKey("MasterEntityData")]
        public int GuaranteeStatusId { get; set; }
        public MasterEntityData? GuaranteeStatus { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string Remarks { get; set; }
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
    }
}
