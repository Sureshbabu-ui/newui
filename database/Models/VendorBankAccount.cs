using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class VendorBankAccount
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        [ForeignKey("VendorBranchId")]
        public int? VendorBranchId { get; set; }
        public VendorBranch VendorBranch { get; set; }
        [ForeignKey("BankBranchId")]
        public int BankBranchId { get; set; }
        public BankBranch BankBranch { get; set; }
        [ForeignKey("MasterEntityData")]
        public int BankAccountTypeId { get; set; }
        public MasterEntityData? BankAccountType { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string AccountNumber { get; set; }
        [DefaultValue(1)]
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        [DefaultValue(0)]
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}