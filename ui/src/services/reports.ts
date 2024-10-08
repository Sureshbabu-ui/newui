import axios from "axios";
import { BookingDetailReport } from "../types/bookingDetailReport";
import { PartReturnReportReport } from "../types/patreturn";
import { PendingCallReportReport } from "../types/pendingCallReport";
import { getBrowserTimeZone } from "../helpers/formats";
import { BarcodeReport, ConsumptionReport, ConsumptionSummaryReport } from "../types/partStock";
import { FIATReport } from "../types/user";
import { ContractRenewDueReport } from "../types/contractRenewDueReport";
import { DemandReport } from "../types/partindentdemand";
import { CustomerSiteReport } from "../types/customerSite";
import { PMAssetDetailReportFilter, PMAssetSummaryReportFilter, PreAmcAssetDetailReportFilter } from "../types/assetReport";
import settings from "../config/settings";
import { setupInterceptorsTo } from "../interceptor";
import { ContractAssetDownloadFilter } from "../types/assets";

axios.defaults.baseURL = settings.baseApiUrl;
setupInterceptorsTo(axios)

export const downloadBookingDetailReport = async (BookingReports: BookingDetailReport) => {
  const { DateFrom, DateTo, AgreementTypeId, TenantOfficeId, TenantRegionId, CustomerId, ContractStatusId } = BookingReports;
  let url = `report/bookingdetail/download?`;
  if (DateFrom) {
    url += `&DateFrom=${DateFrom}`;
  } if (DateTo) {
    url += `&DateTo=${DateTo}`;
  } if (AgreementTypeId) {
    url += `&ContractTypeId=${AgreementTypeId}`;
  } if (TenantRegionId) {
    url += `&AccelRegionId=${TenantRegionId}`;
  } if (TenantOfficeId) {
    url += `&AccelLocationId=${TenantOfficeId}`;
  } if (CustomerId) {
    url += `&CustomerId=${CustomerId}`;
  }
  if (ContractStatusId) {
    url += `&ContractStatusId=${ContractStatusId}`;
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadPartReturnReport = async (PartReturnReports: PartReturnReportReport) => {
  const { DateFrom, DateTo, ReturnedPartTypeId, TenantOfficeId, TenantRegionId, ServiceEngineerId, IsUnderWarranty } = PartReturnReports;
  let url = `report/partreturns/download?`;
  if (DateFrom) {
    url += `&DateFrom=${DateFrom}`;
  } if (DateTo) {
    url += `&DateTo=${DateTo}`;
  } if (ReturnedPartTypeId) {
    url += `&ReturnedPartTypeId=${ReturnedPartTypeId}`;
  } if (TenantRegionId) {
    url += `&TenantRegionId=${TenantRegionId}`;
  } if (TenantOfficeId) {
    url += `&TenantOfficeId=${TenantOfficeId}`;
  } if (ServiceEngineerId) {
    url += `&ServiceEngineerId=${ServiceEngineerId}`;
  } if (IsUnderWarranty) {
    url += `&IsUnderWarranty=${IsUnderWarranty}`;
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadPendingCallReport = async (PendingCallReportReports: PendingCallReportReport) => {
  const { DateFrom, DateTo, TenantOfficeId, TenantRegionId } = PendingCallReportReports;
  let url = `report/pendingcall/download?&TimeZone=${getBrowserTimeZone()}`;
  if (DateFrom) {
    url += `&DateFrom=${DateFrom}`;
  } if (DateTo) {
    url += `&DateTo=${DateTo}`;
  }
  if (TenantRegionId) {
    url += `&TenantRegionId=${TenantRegionId}`;
  } if (TenantOfficeId) {
    url += `&TenantOfficeId=${TenantOfficeId}`;
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadBarcodeReport = async (BarcodeReport: BarcodeReport) => {
  const { DateFrom, DateTo, TenantOfficeId, TenantRegionId, IsUnderWarranty } = BarcodeReport;
  let url = `report/barcode/download?`;
  if (DateFrom) {
    url += `&DateFrom=${DateFrom}`;
  } if (DateTo) {
    url += `&DateTo=${DateTo}`;
  } if (TenantRegionId) {
    url += `&TenantRegionId=${TenantRegionId}`;
  } if (TenantOfficeId) {
    url += `&TenantOfficeId=${TenantOfficeId}`;
  } if (IsUnderWarranty) {
    url += `&IsUnderWarranty=${IsUnderWarranty}`;
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadFIATEngDetailReport = async (FiatEngReport: FIATReport) => {
  const { DateFrom, DateTo, TenantOfficeId, TenantRegionId } = FiatEngReport;
  let url = `report/fiat/engineer/detail/download?&TimeZone=${getBrowserTimeZone()}`;
  if (DateFrom) {
    url += `&DateFrom=${DateFrom}`;
  } if (DateTo) {
    url += `&DateTo=${DateTo}`;
  }
  if (TenantRegionId) {
    url += `&TenantRegionId=${TenantRegionId}`;
  } if (TenantOfficeId) {
    url += `&TenantOfficeId=${TenantOfficeId}`;
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadContractRenewDueReport = async (ContractRenewDueReport: ContractRenewDueReport) => {
  const { DateFrom, DateTo, TenantOfficeId, TenantRegionId } = ContractRenewDueReport;
  let url = `report/contract/renewaldue/download?&TimeZone=${getBrowserTimeZone()}`;
  if (DateFrom) {
    url += `&DateFrom=${DateFrom}`;
  } if (DateTo) {
    url += `&DateTo=${DateTo}`;
  }
  if (TenantRegionId) {
    url += `&TenantRegionId=${TenantRegionId}`;
  } if (TenantOfficeId) {
    url += `&TenantOfficeId=${TenantOfficeId}`;
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadFIATRECountReport = async (FiatEngReport: FIATReport) => {
  const { DateFrom, DateTo, TenantOfficeId, TenantRegionId } = FiatEngReport;
  let url = `report/fiat/re/count/download?&TimeZone=${getBrowserTimeZone()}`;
  if (DateFrom) {
    url += `&DateFrom=${DateFrom}`;
  } if (DateTo) {
    url += `&DateTo=${DateTo}`;
  }
  if (TenantRegionId) {
    url += `&TenantRegionId=${TenantRegionId}`;
  } if (TenantOfficeId) {
    url += `&TenantOfficeId=${TenantOfficeId}`;
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadDemandReport = async (DemandReport: DemandReport) => {
  const { DateFrom, DateTo, TenantOfficeId, TenantRegionId } = DemandReport;
  let url = `report/demand/download?&TimeZone=${getBrowserTimeZone()}`;
  if (DateFrom) {
    url += `&DateFrom=${DateFrom}`;
  } if (DateTo) {
    url += `&DateTo=${DateTo}`;
  }
  if (TenantRegionId) {
    url += `&TenantRegionId=${TenantRegionId}`;
  } if (TenantOfficeId) {
    url += `&TenantOfficeId=${TenantOfficeId}`;
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadCustomerSiteReport = async (CustomerSiteReport: CustomerSiteReport) => {
  const { ContractId, CustomerId, TenantOfficeId, TenantRegionId } = CustomerSiteReport;
  let url = `report/customersite/download?&TimeZone=${getBrowserTimeZone()}`;
  if (ContractId) {
    url += `&ContractId=${ContractId}`;
  } if (CustomerId) {
    url += `&CustomerId=${CustomerId}`;
  }
  if (TenantRegionId) {
    url += `&TenantRegionId=${TenantRegionId}`;
  } if (TenantOfficeId) {
    url += `&TenantOfficeId=${TenantOfficeId}`;
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadConsumptionSummaryReport = async (ConsumptionSummaryReport: ConsumptionSummaryReport) => {
  const { DateFrom, DateTo, TenantOfficeId, TenantRegionId } = ConsumptionSummaryReport;
  let url = `report/consumption/summary/download?&TimeZone=${getBrowserTimeZone()}`;
  if (DateFrom) {
    url += `&DateFrom=${DateFrom}`;
  } if (DateTo) {
    url += `&DateTo=${DateTo}`;
  }
  if (TenantRegionId) {
    url += `&TenantRegionId=${TenantRegionId}`;
  } if (TenantOfficeId) {
    url += `&TenantOfficeId=${TenantOfficeId}`;
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadConsumptionReport = async (ConsumptionReport: ConsumptionReport) => {
  const { DateFrom, DateTo, TenantOfficeId, TenantRegionId } = ConsumptionReport;
  let url = `report/consumption/download?&TimeZone=${getBrowserTimeZone()}`;
  if (DateFrom) {
    url += `&DateFrom=${DateFrom}`;
  } if (DateTo) {
    url += `&DateTo=${DateTo}`;
  }
  if (TenantRegionId) {
    url += `&TenantRegionId=${TenantRegionId}`;
  } if (TenantOfficeId) {
    url += `&TenantOfficeId=${TenantOfficeId}`;
  }
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadPMAssetDetailReport = async (PMAssetReportFilter: PMAssetDetailReportFilter) => {
  let url = `report/pmassetdetail?TimeZone=${getBrowserTimeZone()}&`;

  const queryParams = Object.entries(PMAssetReportFilter)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => value ? `${key}=${value}` : '');

  url += queryParams.join('&');

  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadPMAssetSummaryReport = async (PMAssetReportFilter: PMAssetSummaryReportFilter) => {
  let url = `report/pmassetsummary?TimeZone=${getBrowserTimeZone()}&`;

  const queryParams = Object.entries(PMAssetReportFilter)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => value ? `${key}=${value}` : '');

  url += queryParams.join('&');

  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadPreAmcAssetDetailReport = async (PreAmcAssetReportFilter: PreAmcAssetDetailReportFilter) => {
  let url = `report/preamcassetdetail?TimeZone=${getBrowserTimeZone()}&`;

  const queryParams = Object.entries(PreAmcAssetReportFilter)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => value ? `${key}=${value}` : '');

  url += queryParams.join('&');

  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadPreAmcAssetSummaryReport = async (PMAssetReportFilter: PMAssetSummaryReportFilter) => {
  let url = `report/preamcassetsummary?TimeZone=${getBrowserTimeZone()}&`;

  const queryParams = Object.entries(PMAssetReportFilter)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => value ? `${key}=${value}` : '');

  url += queryParams.join('&');

  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadContractAssetListReport = async (ContractId: string,Filters:ContractAssetDownloadFilter) => {
  let url = `report/contract/asset/list/download?&TimeZone=${getBrowserTimeZone()}&ContractId=${ContractId}&`;
  const queryParams = Object.entries(Filters)
    .filter(([key, value]) => value <2)
    .map(([key, value]) => value <2  ? `${key}=${Boolean(value)}` : '');

  url += queryParams.join('&');
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

export const downloadContractManpowerAllocationListReport = async (ContractId: string) => {
  const url = `report/contract/manpower/allocation/list/download?&TimeZone=${getBrowserTimeZone()}&ContractId=${ContractId}`;
  return await axios.get(url, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}