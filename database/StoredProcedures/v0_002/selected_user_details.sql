CREATE OR ALTER   PROCEDURE [dbo].[selected_user_details] 
    @UserId INT
AS
BEGIN 
    SET NOCOUNT ON;
		SELECT
			UI.Id,
			UI.FullName,
			UI.Email,
			UI.Phone,
			UI.CreatedOn,
			UI.UserCategoryId,
			UI.DepartmentId,
			UI.DesignationId,
			SEI.EngineerLevel,
			SEI.EngineerCategory,
			SEI.EngineerType,
			SEI.EngineerGeolocation,
			SEI.[Address] AS EngineerAddress,
			SEI.CityId AS EngineerCityId,
			SEI.StateId AS EngineerStateId,
			SEI.CountryId AS EngineerCountryId,
			SEI.Pincode AS EngineerPincode,
			UI.DivisionId,
			UI.EmployeeCode,
			UI.EngagementTypeId,
			UI.GenderId,
			UI.ReportingManagerId,
			UI.TenantOfficeId,
			UL.IsConcurrentLoginAllowed,
			UI.DocumentUrl,
			UI.DocumentSize,
			CMA.BudgetedAmount,
			CMA.CustomerAgreedAmount,
			CMA.EndDate,
			CMA.StartDate,
			CMA.ContractId,
			CMA.CustomerSiteId,
			C.CustomerInfoId
		FROM UserInfo UI
		    LEFT JOIN UserLogin UL ON UL.Id= UI.UserLoginId
			LEFT JOIN MasterEntityData UserCategory ON UserCategory.Id = UserCategoryId
			LEFT JOIN ServiceEngineerInfo SEI ON SEI.UserInfoId = UI.Id
			LEFT JOIN ContractManpowerAllocation CMA ON CMA.EmployeeId = UI.Id
			LEFT JOIN Contract C ON C.Id = CMA.ContractId
		WHERE
			UI.Id = @UserId
END