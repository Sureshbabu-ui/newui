using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using NetTopologySuite.Geometries;

namespace database.Models
{
    public class PostalCode
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(16)]
        public string Pincode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string PostOfficeName { get; set; }
        public int? CityId { get; set; }
        [ForeignKey("CityId")]
        public City City { get; set; }
        public int StateId { get; set; }
        [ForeignKey("StateId")]
        public State State { get; set; }
        public int CountryId { get; set; }
        [ForeignKey("CountryId")]
        public Country Country { get; set; }
        public Point? GeoCoordinates { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string? TimeZone { get; set; }
        [DefaultValue((1))]
        public bool IsActive { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }

    }
}
