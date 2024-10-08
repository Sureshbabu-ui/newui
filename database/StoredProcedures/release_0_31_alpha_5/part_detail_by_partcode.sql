CREATE OR ALTER PROCEDURE [dbo].[part_detail_by_partcode]
	@PartCode VARCHAR(8)
AS
BEGIN
	SELECT
		P.Id,
		P.PartName,
		P.HsnCode,
		P.OemPartNumber
	FROM
        Part P
	WHERE P.PartCode = @PartCode
END