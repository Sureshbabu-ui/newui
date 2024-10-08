using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using BeSureApi.Models;

namespace database.Models
{

    [Microsoft.EntityFrameworkCore.Index(nameof(TransactionDate),nameof(Particulars),nameof(TransactionAmount), IsUnique = true)]
    public class BankCollection
    {

        public int Id { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime TransactionDate { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string Particulars { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        public decimal TransactionAmount { get; set; }
        [ForeignKey("CustomerInfoId")]
        public int? CustomerInfoId { get; set; }
        public CustomerInfo CustomerInfo { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? TransactionReferenceNumber { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? CustomerBankName { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? PaymentMethodId { get; set; }
        public MasterEntityData? PaymentMethod { get; set; }
        [ForeignKey("TenantBankAccountId")]
        public int TenantBankAccountId { get; set; }
        public TenantBankAccount TenantBankAccount { get; set; }
        [ForeignKey("MasterEntityData")]
        public int BankCollectionStatusId { get; set; }
        public MasterEntityData? BankCollectionStatus { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ClaimedOn { get; set; }
        public int? ClaimedBy { get; set; }
        [ForeignKey("ClaimedBy")]
        public UserInfo? ClaimedByUserInfo { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ChequeRealizedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ChequeReturnedOn { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? ChequeReturnedReason { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        [DefaultValue(false)]
        public bool? IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
