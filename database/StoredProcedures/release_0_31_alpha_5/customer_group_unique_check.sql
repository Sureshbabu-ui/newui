CREATE OR ALTER  PROCEDURE [dbo].[customer_group_unique_check]
    @GroupCode VARCHAR(8),
    @GroupName VARCHAR(64),
    @IsGroupCodeExist INT OUTPUT,
    @IsGroupNameExist INT OUTPUT
AS
BEGIN 
SET NOCOUNT ON;
    IF (NOT EXISTS (SELECT ID FROM CustomerGroup WHERE GroupCode = @GroupCode))
        SET @IsGroupCodeExist = 0;
    ELSE
        SET @IsGroupCodeExist = 1;

    IF (NOT EXISTS (SELECT ID FROM CustomerGroup WHERE GroupName = @GroupName))
        SET @IsGroupNameExist = 0;
    ELSE
        SET @IsGroupNameExist = 1;
END