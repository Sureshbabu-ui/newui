using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class BusinessEvent
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
    public class BusinessEventCreate
    {
        [Required(ErrorMessage = "validation_error_businessevent_create_code_required")]
        [StringLength(8, ErrorMessage = "validation_error_businessevent_create_code_max")]
        public string Code { get; set; }
        [Required(ErrorMessage = "validation_error_businessevent_create_name_required")]
        [StringLength(32, ErrorMessage = "validation_error_businessevent_create_name_max")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_businessevent_status_required")]
        public string IsActive { get; set; }
    }
}