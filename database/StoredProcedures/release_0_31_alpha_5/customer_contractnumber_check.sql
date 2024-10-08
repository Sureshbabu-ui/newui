CREATE OR ALTER    PROCEDURE [dbo].[customer_contractnumber_check]
 @ContractId INT
 AS
 BEGIN 
 SET NOCOUNT ON;
SELECT 
    C.ContractNumber,
    CI.CustomerId,
    (C.SiteCount - COUNT(CCS.ContractId)) AS SiteCount
FROM 
    Contract AS C
    JOIN CustomerInfo AS CI ON CI.Id = C.CustomerInfoId   
    LEFT JOIN ContractCustomerSite CCS ON CCS.ContractId = C.Id AND CCS.isDeleted = 0
WHERE
    C.Id = @ContractId
GROUP BY
    C.ContractNumber,
    CI.CustomerId,
    C.SiteCount;
END