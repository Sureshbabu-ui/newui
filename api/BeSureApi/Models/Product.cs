using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string ModelName { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string Make { get; set; }
        public short ManufacturingYear { get; set; }
        public int AmcValue { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class ProductCreate
    {
        [Required(ErrorMessage = "validation_error_product_create_model_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_product_create_model_name_max")]
        public string ModelName { get; set; }
        public string Description { get; set; }
        [Required(ErrorMessage = "validation_error_product_create_category_required")]
        public int CategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_product_create_make_required")]
        public int MakeId { get; set; }
       
        public short? ManufacturingYear { get; set; }
        public int? AmcValue { get; set; }
    }
    public class ProductUpdate
    {
        public int ProductId { get; set; }
        [Required(ErrorMessage = "validation_error_product_create_model_name_required")]
        [StringLength(64, ErrorMessage = "validation_error_product_create_model_name_max")]
        public string ModelName { get; set; }
        public string? Description { get; set; }
        [Required(ErrorMessage = "validation_error_product_create_category_required")]
        public int AssetProductCategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_product_create_make_required")]
        public int MakeId { get; set; }
       
        public short ? ManufacturingYear { get; set; }
        public int? AmcValue { get; set; }
        public int UpdatedBy { get; set; }
    }
    public class Deleteproduct
    {
        public int Id { get; set; }
        public int DeletedBy { get; set; }
    }
}
