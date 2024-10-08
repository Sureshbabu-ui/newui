using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class PartSubCategory
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
        public string ProductCategory { get; set; }
        public string PartCategory { get; set; }
    }
    public class UpdatedPartSubCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }

    public class PartSubCategoryNames
    {
        public string Name { get; set; }
        public int Id { get; set; }
    }

    public class PartSubCategoryCreate
    {
        [Required(ErrorMessage = "validation_error_partsubcategorycreate_product_category_required")]
        public int ProductCategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_partsubcategorycreate_part_category_required")]
        public int PartProductCategoryToPartCategoryMappingId { get; set; }
        [Required(ErrorMessage = "validation_error_partsubcategorycreate_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_part_create_Name_max")]
        public string PartSubCategoryName { get; set; }        
    }
}