using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeSureApi.Models
{
    public class StockRoom
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string RoomCode { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(32)]
        public string RoomName { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(128)]
        public string Description { get; set; }
        [DefaultValue(true)]
        public bool IsActive { get; set; } = false;
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}