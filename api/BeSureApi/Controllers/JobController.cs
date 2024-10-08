using BeSureApi.Exceptions;
using BeSureApi.Services.JobService;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Data.SqlClient;
using System.Data;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using BeSureApi.Authorization.BusinessFunctionCode;
using BeSureApi.Authorization;
using BeSureApi.Services.LogService;

namespace BeSureApi.Controllers
{
    [Route("api/jobs")]
    [ApiController]
    public class JobController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogService _logService;
        private readonly IJobExecutionService _jobExecutionService;
        private readonly IScheduledJobService _scheduledJobService;
        private readonly SqlConnection _connection;
        private readonly int _retry;
        public JobController(IConfiguration configuration, 
                                IJobExecutionService jobExecutionService, 
                                IScheduledJobService scheduledJobService,
                                ILogService logging)
        {
            _config = configuration;
            _jobExecutionService = jobExecutionService;
            _scheduledJobService = scheduledJobService;
            _logService = logging;
            _connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
            _retry = 3;
        }
        [HttpPost]
        [Route("scheduled")]
        public async Task<IActionResult> ScheduledJobTrigger()
        {
            try
            {
                await _scheduledJobService.CheckAndMoveScheduledJob();
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,

                }));
            }
            catch (Exception ex)
            {
                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        message = new[] {
                            new ExceptionHandler(ex,"checking_planned_job_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }

        [HttpPost]
        [Route("execute")]
        public async Task<IActionResult> JobExecutionTrigger()
        {
            try
            {
                await _jobExecutionService.ExecuteJobs(_retry);
                return Ok(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status200OK,

                }));
            }
            catch (Exception ex)
            {

                return BadRequest(JsonSerializer.Serialize(new
                {
                    status = StatusCodes.Status400BadRequest,
                    errors = new
                    {
                        message = new[] {
                            new ExceptionHandler(ex,"job_execution_failed", _logService).GetMessage()
                        }
                    }
                }));
            }
        }
    }
}
