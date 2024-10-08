using BeSureApi.Models;
using Dapper;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;

namespace BeSureApi.Helpers
{
    public class JobQueueHelper
    {
        private readonly IConfiguration _configuration;
        public JobQueueHelper(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task AddMailToJobQueue(EmailDto emailDto)
        {
            string jsonString = JsonSerializer.Serialize(emailDto);

            using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

            var procedure = "job_add";
            var parameters = new DynamicParameters();

            parameters.Add("@IsPlannedJob", false);
            parameters.Add("@Priority", 1);
            parameters.Add("@CommandName", "SendEmail");
            parameters.Add("@Params", jsonString);
            parameters.Add("@FailedAttempts", 0);
            parameters.Add("@FailedReason", "nil");
            parameters.Add("@LastFailedOn", null);
            parameters.Add("@IsCompleted", false);
            parameters.Add("@IsSuccess", false);

            var resp = await connection.QueryAsync<Job>(procedure, parameters, commandType: CommandType.StoredProcedure);
        }
    }
}
