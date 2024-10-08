﻿using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace database.Models
{
    [Microsoft.EntityFrameworkCore.Index(nameof(Code), IsUnique = true)]
    public class PaymentFrequency
    {
        public int Id { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(8)]
        public string Code { get; set; }
        [Column(TypeName = "varchar")]
        [StringLength(64)]
        public string Name { get; set; }
        public int CalendarMonths { get; set; }
        [DefaultValue(1)]
        public bool IsActive { get; set; }
        public int CreatedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? UpdatedOn { get; set; }
        public int? UpdatedBy { get; set; }
        public bool IsDeleted { get; set; }
        public int? DeletedBy { get; set; }
        [Column(TypeName = "datetime")]
        public DateTime? DeletedOn { get; set; }
    }
}