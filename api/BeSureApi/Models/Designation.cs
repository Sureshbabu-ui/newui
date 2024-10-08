using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class Designation
    {
            public int Id { get; set; }
            public string Code { get; set; }
            public string Name { get; set; }
            public bool IsActive { get; set; }
            public string CreatedByFullName { get; set; }
            public DateTime CreatedOn { get; set; }
            public string? UpdatedByFullName { get; set; }
            public DateTime? UpdatedOn { get; set; }
        }
        public class DesignationCreate
        {
        [Required(ErrorMessage = "validation_error_designation_create_code_required")]
        [StringLength( 8, ErrorMessage = "validation_error_designation_create_code_max")]
        public string Code { get; set; }
        [Required(ErrorMessage = "validation_error_designation_create_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_designation_create_name_max")]
        public string Name { get; set; }
        public string IsActive { get; set; }
    }
    public class DesignationEdit
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "validation_error_designation_create_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_designation_create_name_max")]
        public string Name { get; set; }
        public string IsActive { get; set; }
    }
}