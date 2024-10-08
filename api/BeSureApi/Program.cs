global using BeSureApi.Models;
global using BeSureApi.Services.EmailService;
using BeSureApi.Authorization;
using BeSureApi.MiddleWareServices;
using BeSureApi.Services;
using BeSureApi.Services.ExcelService;
using BeSureApi.Services.JobService;
using BeSureApi.Services.LogService;
using Dapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using OfficeOpenXml;
using QuestPDF.Infrastructure;
using Swashbuckle.AspNetCore.Filters;
using System.Data;
using System.Data.SqlClient;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
QuestPDF.Settings.License = LicenseType.Community;
ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using the Bearer scheme(\"bearer{token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddScoped<IPdfService,PdfService>();
builder.Services.AddScoped<IExcelService, ExcelService>();
builder.Services.AddSingleton<IAuthorizationHandler, IsAccountNotDisabledHandler>();

//Registering Job services
builder.Services.AddScoped<IJobExecutionService, JobExecutionService>();
builder.Services.AddScoped<IScheduledJobService, ScheduledJobservice>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("userNotDisabled", policyBuilder => policyBuilder.AddRequirements(
        new IsAccountEnabledRequirement()
    ));
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
            .GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {               
                    var userId = context.Principal.FindFirstValue("LoggedUserId");
                    var tokenVersion = context.Principal.FindFirstValue("TokenVersion");

                    if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(tokenVersion))
                    {
                        context.Fail("Token does not contain required claims.");
                        return;
                    }
                    var config = context.HttpContext.RequestServices.GetService(typeof(IConfiguration)) as IConfiguration;
                    var log = context.HttpContext.RequestServices.GetService<ILogService>();
                    using var connection = new SqlConnection(config.GetConnectionString("DefaultConnection"));
                    connection.Open();
                try
                {
                    var procedure = "userinfo_details";
                    var parameters = new DynamicParameters();
                    parameters.Add("UserId", userId);
                    var userInfo = connection.QuerySingle<UserInfo>(procedure, parameters, commandType: CommandType.StoredProcedure);
                    if ((userInfo.CurrentTokenVersion != int.Parse(tokenVersion) && !userInfo.IsConcurrentLoginAllowed) || userInfo.IsUserExpired)
                    {
                        context.Fail("Token version is not valid.");
                        return;
                    }
                }
                catch (Exception ex)
                {
                     context.Fail("Failed to validate token due to an unexpected error.");
                }
                finally
                {
                    connection.Close(); 
                    connection.Dispose();
                }
            }
        };
    });
builder.Services.AddCors(p => p.AddPolicy("corspolicy", build =>
{
    build.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();

}));
builder.Services.AddScoped<CustomMiddleware>();


var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("corspolicy");
app.UseCustomMiddleware();

app.UseHttpsRedirection();
app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
