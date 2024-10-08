using Microsoft.AspNetCore.Authorization;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using BeSureApi.Models;
using Dapper;
using System.Data;

namespace BeSureApi.Authorization
{
    public class IsAccountNotDisabledHandler : AuthorizationHandler<IsAccountEnabledRequirement>
    {
        private readonly IConfiguration _config;
        public IsAccountNotDisabledHandler(IConfiguration config)
        {
            _config = config;
        }
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsAccountEnabledRequirement requirement)
        {
            using var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            var procedure = "user_is_disabled";
            var parameters = new DynamicParameters();
            parameters.Add("UserId", context.User.HasClaim(c => c.Type == "LoggedUserId"));
            parameters.Add("IsUserDisabled", dbType: DbType.Int32, direction: ParameterDirection.Output);
            connection.Query<UserCreate>(procedure, parameters, commandType: CommandType.StoredProcedure);
            int isUserDisabled = parameters.Get<int>("IsUserDisabled");

            if ( Convert.ToBoolean(isUserDisabled) )
            {
                context.Fail();
            }
            else
            {
                context.Succeed(requirement);
            }
            return Task.CompletedTask;
        }
    }
}
