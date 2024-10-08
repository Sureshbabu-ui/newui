using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class Tenant
    {
        [Required(ErrorMessage = "validation_error_tenant_create_name_required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_tenant_create_name_in_print_required")]
        public string NameOnPrint { get; set; }
        [Required(ErrorMessage = "validation_error_tenant_create_address_required")]
        public string Address { get; set; }
    }
    public class TenantUpdate
    {
        [Required(ErrorMessage = "validation_error_tenant_create_name_required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "validation_error_tenant_create_name_in_print_required")]
        public string NameOnPrint { get; set; }
        [Required(ErrorMessage = "validation_error_tenant_create_address_required")]
        public string CWHAddress { get; set; }
        [Required(ErrorMessage = "validation_error_tenant_create_address_required")]
        public string GRCAddress { get; set; }
        [Required(ErrorMessage = "validation_error_tenant_create_address_required")]
        public string HOAddress { get; set; }
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int City { get; set; }
        public int Country { get; set; }
        public int State { get; set; }
        public int CWHId { get; set; }
        public int GRCId { get; set; }
        public int HDOFId { get; set; }
        public string Address { get; set; }
        public string Pincode { get; set; }
        public string PanNumber { get; set; }
    }
    public class TenantList
    {
        public int Id { get; set; }
        public string TenantCode { get; set; }
        public string TenantId { get; set; }
        public string Name { get; set; }       
        public string NameOnPrint { get; set; }
        public string IsVerified { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
