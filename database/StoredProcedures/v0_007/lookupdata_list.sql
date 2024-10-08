CREATE OR ALTER   PROCEDURE [dbo].[lookupdata_list]
AS
BEGIN
 select  
 MED.Id,
 ME.EntityType,
 MED.Code, 
 MED.Name from MasterEntity ME
 LEFT JOIN MasterEntityData MED ON MED.MasterEntityId=ME.Id 
 AND MED.IsActive=1 
 AND MED.IsDeleted = 0
END
