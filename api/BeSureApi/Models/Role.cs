using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public bool IsSystemRole { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
    public class RoleList
    {
        public int Id { get; set; }
        public string RoleName { get; set; }
        public Boolean IsActive { get; set; }
    }
    public class RoleCreate
    {
        [Required(ErrorMessage = "validation_error_role_create_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_role_create_name_max")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_role_create_code_required")]
        [StringLength(16, ErrorMessage = "validation_error_role_create_code_max")]
        public string Code { get; set; }
        public string IsActive { get; set; }
    }
    public class UpdatedRoleDetail
    {
        public int RoleId { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }
}