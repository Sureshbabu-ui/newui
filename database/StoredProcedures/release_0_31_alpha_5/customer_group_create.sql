CREATE OR ALTER PROCEDURE [dbo].[customer_group_create]
    @GroupCode VARCHAR(64),
    @GroupName VARCHAR(64),
    @CreatedBy INT,
    @IsCustomerGroupCreated INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
	INSERT INTO CustomerGroup
        (GroupCode,
        GroupName,
        CreatedBy,
        CreatedOn)
    VALUES
        (@GroupCode,
        @GroupName,
        @CreatedBy,
        GETUTCDATE())
    SET
        @IsCustomerGroupCreated = 1
END 

