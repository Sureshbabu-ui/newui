using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace database.Models
{
    public class ContractManpowerAllocation
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract? Contract { get; set; }
        [ForeignKey("CustomerSiteId")]
        public int CustomerSiteId { get; set; }
        public CustomerSite? CustomerSite { get; set; }
        public int EmployeeId { get; set; }
        [ForeignKey("EmployeeId")]
        public UserInfo? UserInfo { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(16,2)")]
        public decimal CustomerAgreedAmount { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(16,2)")]
        public decimal BudgetedAmount { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(16,2)")]
        public decimal MarginAmount { get; set; }
        [Column(TypeName = "date")]
        public DateTime? StartDate { get; set; }
        [Column(TypeName = "date")]
        public DateTime? EndDate { get; set; }
        [ForeignKey("MasterEntityData")]
        public int AllocationStatusId { get; set; }
        public MasterEntityData? AllocationStatus { get; set; }
        [StringLength(128)]
        [Column(TypeName = "varchar")]
        public string? Remarks { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        [DefaultValue(false)]
        public Boolean IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}
