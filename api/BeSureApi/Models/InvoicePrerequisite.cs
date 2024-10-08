using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class InvoicePrerequisiteCreate
    {
        [Required(ErrorMessage = "validation_error_invoiceprerequisitecreate_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_invoiceprerequisitecreate_name_max")]
        public string DocumentName { get; set; }
        [Required(ErrorMessage = "validation_error_invoiceprerequisitecreate_code_required")]
        [StringLength(8, ErrorMessage = "validation_error_invoiceprerequisitecreate_code_max")]
        public string DocumentCode { get; set; }
        [Required(ErrorMessage = "validation_error_invoiceprerequisitecreate_description_required")]
        [StringLength(128, ErrorMessage = "validation_error_invoiceprerequisitecreate_name_max")]
        public string? Description { get; set; }
        public string IsActive { get; set; }
    }

    public class InvoicePrerequisiteList
    {
        public int Id { get; set; }
        public string DocumentName { get; set; }
        public string DocumentCode { get; set; }
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class InvoicePrerequisiteUpdate
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
    }
}