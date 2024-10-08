using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class PartProductCategory
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string CategoryName { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
    public class PartProductCategoryCreate
    {
        [Required(ErrorMessage = "validation_error_product_category_create_category_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_product_category_create_code_max")]
        public string CategoryName { get; set; }
    }

    public class PartProductCategoryEdit
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "validation_error_product_category_create_category_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_product_category_create_code_max")]
        public string CategoryName { get; set; }
    }

    public class PartNotCovered
    {
        public string ProductCategoryId { get; set; }
        public string PartCategoryData { get; set; }
        public int CreatedBy { get; set;}
    }

    public class PartCategoryNames
    {
        public string Name { get; set; }
        public int Id { get; set; }
    }

    public class DeleteproductCategory
    {
        public int Id { get; set; }
        public int DeletedBy { get; set; }
    }

    public class AssetProductCategoryPartCategoryNames
    {
        public string Name { get; set; }
        public int Id { get; set; }
        public int PartProductCategoryToPartCategoryMappingId { get; set; }
    }
}
