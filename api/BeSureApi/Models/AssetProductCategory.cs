using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class AssetProductCategory
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string CategoryName { get; set; }
        public string PartProductCategory { get; set; }
        public string? GeneralNotCovered { get; set; }
        public string? SoftwareNotCovered { get; set; }
        public string? HardwareNotCovered { get; set; }
    }
    public class AssetProductCategoryCreate
    {
        [Required(ErrorMessage = "validation_error_product_category_create_category_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_product_category_create_code_max")]
        public string CategoryName { get; set; }
        [Required(ErrorMessage = "validation_error_assetproduct_category_create_partproduct_category_required")]
        public int PartProductCategoryId { get; set; }
        public string? GeneralNotCovered { get; set; }
        public string? SoftwareNotCovered { get; set; }
        public string? HardwareNotCovered { get; set; }
    }

    public class AssetProductCategoryEdit
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public int PartProductCategoryId { get; set; }
        public string? GeneralNotCovered { get; set; }
        public string? SoftwareNotCovered { get; set; }
        public string? HardwareNotCovered { get; set; }
    }
}
