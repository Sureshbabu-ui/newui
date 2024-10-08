CREATE OR ALTER PROCEDURE [dbo].[part_update_unique_check]
	@Id INT,
    @PartName VARCHAR(64),
    @IsPartNameExist INT OUTPUT
AS
BEGIN 
    SET NOCOUNT ON;
    IF (NOT EXISTS (SELECT ID FROM Part WHERE PartName = @PartName AND Id != @Id))
        SET @IsPartNameExist = 0;
    ELSE
        SET @IsPartNameExist = 1;
END