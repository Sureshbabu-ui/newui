using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class CustomerGroup
    {
        public int Id { get; set; }
        public string GroupCode { get; set; }
        public string GroupName { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
    }
    public class CustomerGroupCreate
    {
        [Required(ErrorMessage = "validation_error_customer_group_create_code_required")]
        public string GroupCode { get; set; }
        [Required(ErrorMessage = "validation_error_customer_group_create_name_required")]
        public string GroupName { get; set; }
    }
    public class CustomerGroupUpdate
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "validation_error_customer_group_create_name_required")]
        public string GroupName { get; set; }
    }
}
