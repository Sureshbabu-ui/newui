using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(EmployeeCode), IsUnique = true)]
    public class UserInfo
    {
        public int Id { get; set; }
        [ForeignKey("UserLogin")]
        public int UserLoginId { get; set; }
        public UserLogin? UserLogin { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string FullName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string Email { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(25)]
        public string Phone { get; set; }
        [ForeignKey("MasterEntityData")]
        public int EngagementTypeId { get; set; }
        public MasterEntityData? EngagementType { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string EmployeeCode { get; set; }
        [ForeignKey("MasterEntityData")]
        public int UserCategoryId { get; set; }
        public MasterEntityData? UserCategory { get; set; }
        [ForeignKey("DivisionId")]
        public int DivisionId { get; set; }
        public Division? Division { get; set; }
        [ForeignKey("MasterEntityData")]
        public int DepartmentId { get; set; }
        public MasterEntityData? Department { get; set; }
        [ForeignKey("Designation")]
        public int DesignationId { get; set; }
        public Designation? Designation { get; set; }
        [ForeignKey("TenantOffice")]
        public int TenantOfficeId { get; set; }
        public TenantOffice? TenantOffice { get; set; }
        [ForeignKey("MasterEntityData")]
        public int GenderId { get; set; }
        public MasterEntityData? Gender { get; set; }
        public int? ReportingManagerId { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(256)]
        public string? DocumentUrl { get; set; }
        public int? DocumentSize { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ExpiryDate { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int? ModifiedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? ModifiedOn { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; }
        [DefaultValue(false)]
        public bool IsDeleted { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
        public int? DeletedBy { get; set; }
        [ForeignKey("MasterEntityData")]
        public int? UserGradeId { get; set; }
        public MasterEntityData? UserGrade { get; set; }
    }
}
