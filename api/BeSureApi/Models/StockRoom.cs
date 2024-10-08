using System.ComponentModel.DataAnnotations;

namespace BeSureApi.Models
{
    public class StockRoomList
    {
        public int Id { get; set; }
        public string RoomName { get; set; }
        public string RoomCode { get; set; }
        public bool IsActive { get; set; }
        public string Description { get; set; }
    }

    public class StockRoomCreate
    {
        [Required(ErrorMessage = "validation_error_api_stockroom_create_roomname_required")]
        public string RoomName { get; set; }
        [Required(ErrorMessage = "validation_error_api_stockroom_create_roomcode_required")]
        public string RoomCode { get; set; }
        [Required(ErrorMessage = "validation_error_api_stockroom_create_description_required")]
        public string Description { get; set; }
        public int IsActive { get; set; }
    }
    public class StockRoomEdit
    {
        [Required(ErrorMessage = "validation_error_api_stockroom_update_roomname_required")]
        public string RoomName { get; set; }
        [Required(ErrorMessage = "validation_error_api_stockroom_update_description_required")]
        public string Description { get; set; }
        public int Id { get; set; }
        public int IsActive { get; set; }
    }
}