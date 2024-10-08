CREATE OR ALTER PROCEDURE [dbo].[selected_business_units] 
    @UserId INT
AS
BEGIN 
    SET NOCOUNT ON;
    SELECT
        MED.[Name] AS BusinessUnit,
		UBU.BusinessUnitId
    FROM UserInfo U
        LEFT JOIN UserBusinessUnit UBU ON U.Id = UBU.UserId
        LEFT JOIN MasterEntityData MED ON MED.Id = UBU.BusinessUnitId
    WHERE
        U.Id = @UserId
		AND UBU.IsActive = 1
END 