CREATE OR ALTER PROCEDURE [dbo]. [make_list_download]
AS
BEGIN
	SET NOCOUNT ON;
	SELECT
      Make.Code,
      Make.[Name]
	  FROM Make
END