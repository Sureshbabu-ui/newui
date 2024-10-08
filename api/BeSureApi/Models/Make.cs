using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class Make
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
    public class MakeUpdate
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
    public class MakeCreate
    {
        [Required(ErrorMessage = "validation_error_make_create_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_make_create_name_max")]
        public string Name { get; set; }
    }
}
