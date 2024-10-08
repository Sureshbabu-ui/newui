
CREATE OR ALTER  PROCEDURE [dbo].[businessmodule_name_list] 
AS 
BEGIN 
    SELECT  
        BM.Id,
        BM.BusinessModuleName
    FROM BusinessModule BM
	WHERE IsActive=1
END

