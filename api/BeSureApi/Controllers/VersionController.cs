using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BeSureApi.Controllers
{
    [Route("api/version")]
    [ApiController]
    public class VersionController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public VersionController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("get")]
        public IActionResult Get()
        {
            string version = _configuration["BeSureVersion:Version"];

            return Ok(version);
        }
    }
}
