using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class Division
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
    public class DivisionCreate
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "validation_error_code_required")]
        [StringLength(8, ErrorMessage = "validation_error_division_create_code_max")]
        public string Code { get; set; }
        [Required(ErrorMessage = "validation_error_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_division_create_name_max")]
        public string Name { get; set; }
        public string IsActive { get; set; }
    }

    public class DivisionUpdate
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string IsActive { get; set; }
        public int? UpdatedBy {  get; set; }
    }
}
