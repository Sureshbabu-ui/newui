using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Data.SqlClient;
using System.Data;
using BeSureApi.Exceptions;
using BeSureApi.Services.LogService;

namespace BeSureApi.Authorization
{
    public class HasPermissionAttribute : Attribute, IAuthorizationFilter
    {
        public string FunctionCode { get; set; }
        public HasPermissionAttribute(string code)
        {
            FunctionCode = code;
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var config = context.HttpContext.RequestServices.GetService(typeof(IConfiguration)) as IConfiguration;
            var log=context.HttpContext.RequestServices.GetService<ILogService>();
            using var connection = new SqlConnection(config.GetConnectionString("DefaultConnection"));
            connection.Open(); 
            var procedure = "user_function_permission_exist";
            var parameters = new DynamicParameters();
            parameters.Add("UserId", context.HttpContext.User.FindFirst( c => c.Type == "LoggedUserId").Value);
            parameters.Add("BusinessFunctionCode", FunctionCode);
            parameters.Add("IsGranted", dbType: DbType.Boolean, direction: ParameterDirection.Output);
          
            try
            {
                connection.Query(procedure, parameters, commandType: CommandType.StoredProcedure);
                bool isGranted = parameters.Get<bool>("IsGranted");
                if (isGranted == true)
                {
                    // Access is allowed 
                }
                else
                {
                    context.Result = new ForbidResult(); 
                }
            }
            catch (Exception ex)
            {
                new ExceptionHandler(ex, "No access", log).GetMessage();
                context.Result = new ForbidResult(); 
            }
            finally
            {
                connection.Close();
                connection.Dispose();
            }
        }
    }
}