using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace BeSureApi.Models
{
    public class UserInfo
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int CurrentTokenVersion { get; set; }
        public bool IsConcurrentLoginAllowed { get; set; }
        public bool IsUserExpired { get; set; }
        public string CreatedOn { get; set; }
        public bool IsPasscodeExpired { get; set; }
    }
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string PassCode { get; set; }
        public string UserCategory { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set; }
        public Boolean IsDeleted { get; set; }
        public DateTime? DeletedOn { get; set; }
    }
    public class SelectedUser
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public bool CreatedOn { get; set; }
        public string EmployeeCode { get; set; }
        public string? EngineerGeolocation { get; set; }
        public string? EngineerHomeLocation { get; set; }
        public string? ServiceEngineerType { get; set; }
        public string? ServiceEngineerLevel { get; set; }
        public string? ServiceEngineerCategory { get; set; }
        public string DesignationCode { get; set; }
        public string? UserGrade { get; set; }
        public string DocumentUrl {  get; set; }
        public string? BusinessUnits { get; set; }
        public bool IsActive {  get; set; }
    }
    public class UserLogin
    {
        public int Id { get; set; }
        public string Passcode { get; set; }
        public int IsActive { get; set; }
        public bool IsUserExpired { get; set; }
        public int TotalFailedLoginAttempts { get; set; }
        public bool HasServiceEngineerRole { get; set; }
        public bool HasBesurePermission { get; set; }
    }

    public class UserPasscodeHistory
    {
        public string Passcode { get; set; }
    }

    public class UsersList
    {
        public int Id { get; set; }
        public string EmployeeCode { get; set; }
        public string FullName { get; set; }
        public string Department { get; set; }
        public string Designation { get; set; }
        public string Gender { get; set; }
        public string Location { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public bool UserInfoStatus { get; set; }
        public bool UserLoginStatus { get; set; }
        public bool IsDeleted { get; set; }
        public string UserCategory { get; set; }
        public string? DocumentUrl { get; set; }

    }

    public class UserLoginHistory
    {
        public DateTime CreatedOn { get; set; }
        public string ClientInfo { get; set; }
        public int UserId { get; set; }
        public DateTime? LoggedOutOn {get;set;}
    }

    public class Profile
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public DateTime CreatedOn { get; set; }
        public string EmployeeCode { get; set; }
    }

    public class Credentials
    {
        [Required(ErrorMessage = "validation_error_login_empcode_required")]
        public string EmployeeCode { get; set; }
        [Required(ErrorMessage = "validation_error_login_password_required")]
        public string Passcode { get; set; }
        public BrowserDetails Details { get; set; }
    }

    public class BrowserDetails
    {
        public string Browser { get; set; }
        public string TimeZone { get; set; }
        public string IpAddress { get; set; }
    }

    public class ForgotPasscode
    {
        [Required(ErrorMessage = "validation_error_forgot_password_empcode_required")]
        public string EmployeeCode { get; set; }
        public BrowserDetails Details { get; set; }
    }

    public class CodeVerification
    {
        [Required(ErrorMessage = "forgotpassword_code_verification_employee_code_required_validation")]
        public string EmployeeCode { get; set; }

        [Required(ErrorMessage = "validation_error_forgot_password_code_required")]
        public string Code { get; set; }
        public BrowserDetails Details { get; set; }
    }

    public class PasscodeUpdate
    {
        public string EmployeeCode { get; set; }
        public string Code { get; set; }
        [Required(ErrorMessage = "changepassword_passcode_required_validation")]
        [CustomPasscode]
        public string Passcode { get; set; }
        [Compare("Passcode", ErrorMessage = "changepassword_compare_passcode_mismatch")]
        public string ConfirmPasscode { get; set; }
        public BrowserDetails Details { get; set; }
    }

    public class CustomPasscodeAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object? value, ValidationContext validationContext)
        {
            if (value == null)
            {
                return new ValidationResult("login_api_custom_passcode_attribute_enter_passcode");
            }
            else
            {
                var config = validationContext.GetService(typeof(IConfiguration)) as IConfiguration;
                if (config != null)
                {
                    if (!Regex.IsMatch(value.ToString() ?? "", $"^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{{{config.GetValue<int>("Config:minLengthPassword")},{config.GetValue<int>("Config:maxLengthPassword")}}}$"))
                    {
                        return new ValidationResult($"login_api_passcode_rule {config.GetValue<int>("Config:minLengthPassword")}-{config.GetValue<int>("Config:maxLengthPassword")} login_api_passcode_rule_remaining_text");
                    }
                }
                else
                {
                    throw new InvalidOperationException("IConfiguration is not available.");
                }

                return ValidationResult.Success;
            }
        }
    }
    public class UpdatedRoles
    {
        public List<string> UserRoleAssigned { get; set; }
        public List<string> UserRoleRevoked { get; set; }
    }

    public class UserCreate
    {
        public string FullName { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_email_required")]
        [EmailAddress(ErrorMessage = "validation_error_valid_email_required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_phone_required")]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "validation_error_invalid_phone")]
        public string Phone { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_category_required")]
        public string UserCategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_engagement_type_required")]
        public int EngagementTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_forgot_password_empcode_required")]
        public string EmployeeCode { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_division_required")]
        public int DivisionId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_department_required")]
        public int DepartmentId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_division_required")]
        public int DesignationId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_tenant_office_required")]
        public int TenantOfficeId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_gender_required")]
        public int GenderId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_reporting_manager_required")]
        public int? ReportingManagerId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_role_required")]
        public string UserRoles { get; set; }
        public int? EngineerCategory { get; set; }
        public string? EngineerGeolocation { get; set; }
        public string? EngineerAddress { get; set; }
        public int? EngineerCityId { get; set; }
        public int? EngineerCountryId { get; set; }
        public string? EngineerPincode { get; set; }
        public int? EngineerStateId { get; set; }
        public int? EngineerLevel { get; set; }
        public int? EngineerType { get; set; }
        public bool IsConcurrentLoginAllowed { get; set; }
        public IFormFile DocumentFile { get; set; }
        public long DocumentSize { get; set; }
        public string? DocumentUrl { get; set; }
        public DateTime? UserExpiryDate { get; set; }
        public string BusinessUnits { get; set; }
        public string? ReviewStatus { get; set; }
        public Decimal? BudgetedAmount { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? StartDate { get; set; }
        public Decimal? CustomerAgreedAmount { get; set; }
        public int? CustomerSiteId { get; set; }
        public int? ContractId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_usergrade_required")]
        public int UserGradeId { get; set; }
    }

    public class UserEditApproval
    {
        public string FullName { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_email_required")]
        [EmailAddress(ErrorMessage = "validation_error_valid_email_required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_phone_required")]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "validation_error_invalid_phone")]
        public string Phone { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_category_required")]
        public string UserCategoryId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_engagement_type_required")]
        public int EngagementTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_forgot_password_empcode_required")]
        public string EmployeeCode { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_division_required")]
        public int DivisionId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_department_required")]
        public int DepartmentId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_division_required")]
        public int DesignationId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_tenant_office_required")]
        public int TenantOfficeId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_gender_required")]
        public int GenderId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_reporting_manager_required")]
        public int? ReportingManagerId { get; set; }
        [Required(ErrorMessage = "validation_error_create_user_role_required")]
        public string UserRoles { get; set; }
        public int? EngineerCategory { get; set; }
        public string? EngineerGeolocation { get; set; }
        public string? EngineerAddress { get; set; }
        public int? EngineerCityId { get; set; }
        public int? EngineerCountryId { get; set; }
        public string? EngineerPincode { get; set; }
        public int? EngineerStateId { get; set; }
        public int? EngineerLevel { get; set; }
        public int? EngineerType { get; set; }
        public bool IsConcurrentLoginAllowed { get; set; }
        public string DocumentUrl { get; set; }
        public IFormFile? DocumentFile { get; set; }
        public long DocumentSize { get; set; }
        public DateTime? UserExpiryDate { get; set; }
        public string BusinessUnits { get; set; }
        public string? ReviewStatus { get; set; }
        public decimal? BudgetedAmount { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? StartDate { get; set; }
        public decimal? CustomerAgreedAmount { get; set; }
        public int? CustomerSiteId { get; set; }
        public int? ContractId { get; set; }
        public int? UserGradeId { get; set; }
    }

    public class UserUpdate
    {
        public int Id { get; set; }
        public string EmployeeCode { get; set; }
        public string FullName { get; set; }
        [Required(ErrorMessage = "validation_error_edit_api_user_email_required")]
        [EmailAddress(ErrorMessage = "validation_error_valid_email_required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "validation_error_edit_api_user_phone_required")]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$",
                ErrorMessage = "validation_error_invalid_phone")]
        public string Phone { get; set; }
        [Required(ErrorMessage = "validation_error_edit_api_user_role_required")]
        public string? UserRoles { get; set; }
        public string? UserRoleRevoked { get; set; }
        [Required(ErrorMessage = "validation_error_edit_api_user_category_required")]
        public int UserCategoryId { get; set; }
        public int EngagementTypeId { get; set; }
        [Required(ErrorMessage = "validation_error_edit_api_user_division_required")]
        public int DivisionId { get; set; }
        [Required(ErrorMessage = "validation_error_edit_api_user_department_required")]
        public int DepartmentId { get; set; }
        [Required(ErrorMessage = "validation_error_edit_api_user_division_required")]
        public int DesignationId { get; set; }
        [Required(ErrorMessage = "validation_error_edit_api_user_tenant_office_required")]
        public int TenantOfficeId { get; set; }
        [Required(ErrorMessage = "validation_error_edit_api_user_gender_required")]
        public int GenderId { get; set; }
        [Required(ErrorMessage = "validation_error_edit_api_user_reporting_manager_required")]
        public int? ReportingManagerId { get; set; }
        public bool IsDeleted { get; set; }
        public int? EngineerCategory { get; set; }
        public string? EngineerGeolocation { get; set; }
        public string? EngineerAddress { get; set; }
        public string? EngineerPincode { get; set; }
        public int? EngineerCityId { get; set; }
        public int? EngineerStateId { get; set; }
        public int? EngineerCountryId { get; set; }
        public int? EngineerLevel { get; set; }
        public int? EngineerType { get; set; }
        public bool IsConcurrentLoginAllowed { get; set; }
        public IFormFile? DocumentFile { get; set; }
        public int? DocumentSize { get; set; }
        public string? DocumentUrl { get; set; }
        public string BusinessUnits { get; set; }
        public string? BusinessUnitsRevoked { get; set; }
        public decimal? BudgetedAmount { get; set; }
        public string? EndDate { get; set; }
        public string? StartDate { get; set; }
        public decimal? CustomerAgreedAmount { get; set; }
        public int? CustomerSiteId { get; set; }
        public int? ContractId { get; set; }
        [Required(ErrorMessage = "validation_error_edit_user_usergrade_required")]
        public int UserGradeId { get; set; }
    }

    public class UserStatus
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
    }

    public class PasscodeReset
    {
        [Required(ErrorMessage = "login_api_passcode_reset_old_passcode_required")]
        public string OldPasscode { get; set; }
        [CustomPasscode]
        public string NewPasscode { get; set; }
        [Required(ErrorMessage = "login_api_passcode_reset_confirm_passcode_required")]
        [Compare("NewPasscode", ErrorMessage = "login_api_passcode_reset_passcode_mismatch")]
        public string ConfirmPasscode { get; set; }
        public BrowserDetails Details { get; set; }
    }
    public class ChangeUserPasscode
    {
        public int UserId { get; set; }
        public Boolean IsActive { get; set; }
        [CustomPasscode]
        public string NewPasscode { get; set; }
        [Compare("NewPasscode", ErrorMessage = "login_api_change_user_passcode_reset_passcode_mismatch")]
        [Required(ErrorMessage = "login_api_change_user_passcode_reset_confirm_passcode_required")]
        public string ConfirmPasscode { get; set; }
        public BrowserDetails Details { get; set; }
    }
    public class UserDetails
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string UserCategoryId { get; set; }
    }
    
         public class UsersLoginHistoryList
    {
        public string EmployeeName { get; set; }
        public string EmployeeCode { get; set; }
        public string LoginDate { get; set; }
        public string Location { get; set; }
        public string Designation { get; set; }
        public DateTime? LoggedOutOn { get; set; }
        public string ClientInfo { get; set; }
    }

    public class usersStatusUpdate
    {
        public string useridList { get; set; }
    }
    public class UserEmailNotificationDetails
    {
        public string? FullName { get; set; }
        public string? Email { get; set; }
    }
}