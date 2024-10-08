namespace BeSureApi.Models
{
    public class RoleBusinessFunctionPermissionUpdate
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public int BusinessFunctionId { get; set; }
        public bool Status { get; set; }
        public string Name { get; set; }
        public int BusinessModuleId { get; set; }
        public string BusinessModuleName { get; set; }
    }

    public class RoleBusinessFunctionPermissionRoleWiseList
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public int BusinessFunctionId { get; set; }
        public string Description { get; }
        public bool Status { get; set; }
        public string Name { get; set; }
        public int BusinessModuleId { get; set; }
        public string BusinessModuleName { get; set; }
        public string BusinessModuleDescription { get;}
    }

    public class RoleBusinessFunctionPermissionUpdateList
    {
        public List<RoleBusinessFunctionPermissionUpdate> RoleFunctionPermissions { get; set; }
    }
}