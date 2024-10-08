using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace database.Models
{
    public class ServiceEngineerInfo
    {
        public int Id { get; set; }
        [ForeignKey("UserInfoId")]
        public int UserInfoId { get; set; }
        public UserInfo? UserInfo { get; set; }
        [ForeignKey("MasterEntityData")]
        public int EngineerLevel { get; set; }
        public MasterEntityData? EngineerLevelData { get; set; }
        [ForeignKey("MasterEntityData")]
        public int EngineerCategory { get; set; }
        public MasterEntityData? EngineerCategoryData { get; set; }
        [ForeignKey("MasterEntityData")]
        public int EngineerType { get; set; }
        public MasterEntityData? EngineerTypeData { get; set; }
        [ForeignKey("CityId")]
        public int? CityId { get; set; }
        public City? City { get; set; }
        [ForeignKey("StateId")]
        public int? StateId { get; set; }
        public State? State { get; set; }
        [ForeignKey("CountryId")]
        public int? CountryId { get; set; }
        public Country? Country { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string? Pincode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string? Address { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string? EngineerGeolocation { get; set; }
        public int? CreatedBy { get; set; }
        public int? UpdatedBy { get; set; }
        public int? DeletedBy { get; set; }
        public DateTime? DeletedOn { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public DateTime? CreatedOn { get; set; }
        public bool IsActive { get; set; }
        public bool IsDeleted { get; set; }
    }
}
