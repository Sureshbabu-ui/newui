CREATE OR ALTER PROCEDURE [dbo].[bankbranch_list]
    @Page INT = 1,
    @PerPage INT = 10,
    @Search VARCHAR(50) = NULL
AS 
BEGIN 
    SET NOCOUNT ON;
    IF @Page < 1
    SET @Page = 1;

    SELECT   		
        BBI.Id,
        BB.BankId,
        BB.BranchCode,
        BBI.BranchName,
        BBI.[Address],
        BBI.CityId,
        C.[Name] AS CityName,
        BBI.StateId,
        S.[Name] AS StateName,
        BBI.CountryId,
        BBI.Pincode,
        BBI.ContactPerson,
        BBI.ContactNumberOneCountryCode,
        BBI.ContactNumberOne,
        BBI.ContactNumberTwoCountryCode,
        BBI.ContactNumberTwo,
        BBI.Email,
        BBI.Ifsc,
        BBI.MicrCode,
        BBI.SwiftCode,
        UI.FullName AS CreatedByFullName,
        BB.CreatedOn,
        B.BankName
    FROM BankBranchInfo BBI 
        LEFT JOIN BankBranch BB ON BB.Id = BBI.BranchId
        LEFT JOIN UserInfo UI ON UI.Id = BBI.CreatedBy
        LEFT JOIN Bank B ON B.Id = BB.BankId
        LEFT JOIN City C ON C.Id = BBI.CityId
        LEFT JOIN [State] S ON S.Id = BBI.StateId
    WHERE 
		BBI.EffectiveTo IS NULL AND BBI.IsDeleted = 0 AND
        (@Search IS NULL OR
        (BBI.BranchName LIKE '%' + @Search + '%' OR 
        BB.BranchCode LIKE '%' + @Search + '%'))
    ORDER BY BBI.CreatedOn DESC OFFSET (@Page - 1) * @PerPage ROWS FETCH NEXT @PerPage ROWS ONLY
END
