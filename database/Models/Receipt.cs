using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    public class Receipt
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string  ReceiptNumber{ get; set; } 
        [Column(TypeName = "date")]
        public DateTime? ReceiptDate { get; set; }
        [ForeignKey("CustomerInfoId")]
        public int? CustomerInfoId { get; set; }
        public CustomerInfo CustomerInfo { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? CustomerName { get; set; }
        [ForeignKey("BankCollectionId")]
        public int BankCollectionId { get; set; }
        public BankCollection BankCollection { get; set; }
        [ForeignKey("MasterEntityData")]
        public int PaymentMethodId { get; set; }
        public MasterEntityData? PaymentMethod { get; set; }
        [Column(TypeName = "varchar(64)")]
        public string? TransactionReferenceNumber{ get; set; }
        [ForeignKey("TenantBankAccountId")]
        public int? TenantBankAccountId { get; set; }
        public TenantBankAccount TenantBankAccount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal ReceiptAmount { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? DeletedReason { get; set; }
    }
}
