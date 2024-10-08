import { array, boolean, Decoder, iso8601, nullable, number, object, optional, string } from 'decoders';

export interface EmployeeCreated {
	Id: number;
	ContractId:number;
	CustomerSiteName : number |string;
    MspLocationName : number |string;
	CustomerSiteId : number;
    MspLocationId : number;
    EmployeeId :  number;
    DistanceToCustomerSite: number;
    DistanceUnitId :  number ;
    EngineerTypeId :  number ;
    EngineerLevelId :  number ;
    BudgetedCost  : number;
	CreatedBy:  number;
	ModifiedBy:number|string | null;
	ModifiedOn: typeof iso8601 | null| string;
	CreatedOn:typeof iso8601 | string;
    EmployeeName :  string;
	CreatedUserName:string;
    ModifiedUserName:string|null;
    EmployeeReportedOn : typeof iso8601 | string;
    EmployeeBillingRate :  number;
	EmployeeLastSiteWorkingDate:typeof iso8601 |null| string;
	IsDeleted: Boolean;
}
export const employeeDecoder: Decoder<EmployeeCreated> = object({
	Id:number,
	ContractId:number,
	CustomerSiteName: string,
	MspLocationName: string,
	CustomerSiteId : number,
    MspLocationId : number,
    EmployeeId : number,
	DistanceToCustomerSite: number,
	DistanceUnitId: number,
	EngineerTypeId : number,
	EngineerLevelId:number,
	BudgetedCost:number,
	CreatedBy:number,
	CreatedOn:string,
	ModifiedBy:nullable(number),
	ModifiedOn:nullable(string),
	CreatedUserName:string,
    ModifiedUserName: nullable(string),
	EmployeeName:string,
	EmployeeReportedOn: string,
	EmployeeBillingRate : number,
	EmployeeLastSiteWorkingDate: nullable(string),
	IsDeleted: boolean
});
export interface MultipleExistedEmployees {
	ContractManPowerList : EmployeeCreated[];
	TotalRows: number;
  }
  
  export const  multipleExistedEmployeeDecoder: Decoder<MultipleExistedEmployees> = object({
	ContractManPowerList : array(employeeDecoder),
	TotalRows: number
  });

export interface ManPowerData {
	IsManpowerSummaryCreated: Boolean; 
  }
  
  export const createManPowerDecoder: Decoder<ManPowerData> = object({
	  IsManpowerSummaryCreated: boolean
  });