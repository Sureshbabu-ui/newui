using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class ContractManPower
    {
        public int Id { get; set; }
        [ForeignKey("ContractId")]
        public int ContractId { get; set; }
        public Contract? Contract { get; set; }
        [ForeignKey("CustomerSiteId")]
        public int CustomerSiteId { get; set; }
        public CustomerSite CustomerSite { get; set; }
        [ForeignKey("TenantOfficeInfoId")]
        public int TenantOfficeInfoId { get; set; }
        public TenantOfficeInfo TenantOfficeInfo { get; set; }
        [ForeignKey("MasterEntityData")]
        public int EngineerTypeId { get; set; }
        public MasterEntityData? EngineerType { get; set; }
        [ForeignKey("MasterEntityData")]
        public int EngineerLevelId { get; set; }
        public MasterEntityData? EngineerLevel { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(16,2)")]
        public decimal EngineerMonthlyCost { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(8,2)")]
        public decimal EngineerCount { get; set; }
        [Column(TypeName = "decimal(8,2)")]
        [DefaultValue(0)]
        public decimal DurationInMonth { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal CustomerAgreedAmount { get; set; }
        [Column(TypeName = "decimal(16,2)")]
        [DefaultValue(0)]
        public decimal BudgetedAmount { get; set; }
        [DefaultValue(0)]
        [Column(TypeName = "decimal(16,2)")]
        public decimal MarginAmount { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
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
