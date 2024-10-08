import { DateTime } from 'luxon';
import i18n from 'i18next';
import { GenericErrors, ValidationErrors } from '../types/error';
import { ToWords } from 'to-words';
import { PartCategoryNames } from '../types/partCategory';

const toWords = new ToWords();

export const IsImageValid = async (url: string): Promise<boolean> => {
  if (!url) return false;

  return new Promise<boolean>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export const formatDateTime = (dateTime: string | null) => {
  if (dateTime == null)
    return ""
  const format = i18n.t(`format_datetime`);
  const utcDateTime = DateTime.fromISO(dateTime, { zone: 'utc' });
  return utcDateTime.toLocal().toFormat(format).toString();
};

export const formatDate = (dateTime: string | null) => {
  if (dateTime == null)
    return ""
  const format = i18n.t(`format_date`);
  const utcDateTime = DateTime.fromISO(dateTime, { zone: 'utc' });
  return utcDateTime.toLocal().toFormat(format).toString();
};

export const customFormatDate = (inputDate) => {
  const dateObj = new Date(inputDate);
  const month = dateObj.toLocaleString('default', { month: 'long' });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  return formattedDate;
};
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const formatDocumentName = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  return `${year}${month}${day}${hour}${minutes}${seconds}`;

}

export function appendFormData(formData: FormData, data: any, parentKey: string | null = null) {
  if (data === null) {
    data = '';
  }

  if (typeof data === 'object' && !(data instanceof File)) {
    Object.keys(data).forEach((key) => {
      appendFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
    });
  } else {
    formData.append(parentKey as string, data);
  }
}


export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 8) - hash);
  }
  const color = Math.floor(Math.abs((Math.sin(hash) * 16777215) % 1 * 16777215)).toString(16);
  return "#" + "000000".substring(0, 6 - color.length) + color;
};
interface Entity {
  [key: string]: any
}
export const formatSelectInput = (entitiesLists: Entity[], label: string, value: any) => {
  return entitiesLists.map((data) => ({
    value: data[value],
    label: data[label],
  }));
}

export const formatSelectInputWithCode = (entitiesLists: Entity[], label: string, value: any, code?: null | string) => {
  return entitiesLists.map((data) => ({
    value: data[value],
    label: data[label],
    code: data[code ?? '']
  }));
}

export const cityFormatSelectInput = (entitiesLists: Entity[], label: string, value: any, TenantOfficeId?: null | string) => {
  return entitiesLists.map((data) => ({
    value: data[value],
    label: data[label],
    TenantOfficeId: data[TenantOfficeId ?? ""]
  }));
}

export const formatSelectedInputs = (entitiesList1: Entity[], entitiesList2: Entity[], label1: string, label2: string, value1: string, value2: string): { label: string; value: string }[] => {
  const joinTwoEntities: { label: string; value: string }[] = [];
  entitiesList1.forEach((data1) => {
    entitiesList2.forEach((data2) => {
      joinTwoEntities.push({
        label: `${data1[label1]} ${data2[label2]}`,
        value: `${data1[value1]}:${data2[value2]}`,
      });
    });
  });
  return joinTwoEntities;
};

export const formatSelectedInputsWithCode = (entitiesList1: Entity[], entitiesList2: Entity[], label1: string, label2: string, value1: string, value2: string, code1: string, code2: string): { label: string; value: string }[] => {
  const joinTwoEntities: { label: string; value: string; code: string; }[] = [];
  entitiesList1.forEach((data1) => {
    entitiesList2.forEach((data2) => {
      joinTwoEntities.push({
        label: `${data1[label1]} ${data2[label2]}`,
        value: `${data1[value1]}:${data2[value2]}`,
        code: `${data1[code1]}:${data2[code2]}`,
      });
    });
  });
  return joinTwoEntities;
};

export const checkIfSameState = (TenantGstNumber: string, CustomerGstNumber: string): boolean => {
  const splitTenantGstNumber = TenantGstNumber.slice(0, 2);
  const splitCustomerGstNumber = CustomerGstNumber.slice(0, 2);
  const result = splitTenantGstNumber === splitCustomerGstNumber ? true : false;
  return result;
};

export const getFieldColumnClass = (Id: string) => {
  if (['4', '5'].includes(Id)) {
    return 'col-4 mb-2';
  }
  else {
    return 'col-6 mb-2'
  }
};

export const formatSelectInputWithThreeArgParenthesis = (entitiesLists: Entity[], label1: string, label2: string, value: any) => {
  return entitiesLists.map((data) => ({
    value: data[value],
    label: `${data[label1]}  (${data[label2]})`,
  }));
}

export const formatPartCategorySelectInput = (entitiesLists: PartCategoryNames[]) => {
  return entitiesLists.map((data) => ({
    value: data.Id,
    label: data.Name,
    PartProductCategoryToPartCategoryMappingId: data.PartProductCategoryToPartCategoryMappingId
  }));
}


export const
  formatSelectInputWithThreeArg = (entitiesLists: Entity[], label1: string, label2: string, value: any) => {
    return entitiesLists.map((data) => ({
      value: data[value],
      label: `${data[label1]} ,${data[label2]}`,
    }));
  }

export const
  formatSelectInputWithThreeArgWithParenthesis = (entitiesLists: Entity[], label1: string, label2: string, value: any) => {
    return entitiesLists.map((data) => ({
      value: data[value],
      label: `${data[label1]}  (${data[label2]})`,
    }));
  }

export const convertBackEndErrorsToValidationErrors = (errors: GenericErrors): ValidationErrors => {
  const validationErrors: ValidationErrors = {};
  Object.keys(errors).forEach((key) => {
    const errorMessages = errors[key];
    if (errorMessages.length > 0) {
      validationErrors[key] = errorMessages[0];
    }
  });
  return validationErrors;
}

export const getSLAExpiresOn = (reportedDateString: string | null, resolutionTime: number) => {
  if (reportedDateString === null) {
    return '00:00:00'; // or any other default value or error handling you prefer
  }

  const currentDate = DateTime.local();
  const utcDateTime = DateTime.fromISO(reportedDateString, { zone: 'utc' });
  const timeDifferenceMs = utcDateTime.valueOf() - currentDate.valueOf();
  const adjustedTimeDifferenceMs = timeDifferenceMs - (-1 * resolutionTime * 60 * 60 * 1000);
  const adjustedTimeDifference = Math.abs(adjustedTimeDifferenceMs);
  const days = Math.floor(adjustedTimeDifference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((adjustedTimeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((adjustedTimeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((adjustedTimeDifference % (1000 * 60)) / 1000);
  return (`${adjustedTimeDifferenceMs < 0 ? "-" : ""} ${days ? (days + "d") : ""} ${hours}:${minutes}:${seconds}`);
};

export const formatCurrencyToWords = (rupee: number): string => {
  return toWords.convert(rupee, { currency: true })
}

export const getDateDifferenceInDays = (dateEndStr: string, dateStartStr: string) => {
  const dateEnd = new Date(dateEndStr);
  const dateStart = new Date(dateStartStr);
  const diffInDays = dateEnd.getTime() - dateStart.getTime()
  const daydiff = diffInDays / (1000 * 60 * 60 * 24) + 1;
  return daydiff;
}

export const subtractUtcDateFromCurrent = (utcDateString: string): number => {
  // Convert the UTC date string to a Date object
  const utcDate = new Date(utcDateString);

  // Get the current date in UTC
  const currentDateUtc = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = currentDateUtc.getTime() - utcDate.getTime();

  // Convert the time difference to days
  const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

  // Return the result (rounded to the nearest whole number)
  return Math.round(daysDifference);
}

interface BarGraph {
  [key: string]: any,
}

export const formatBarGraphDetails = (entitiesLists: BarGraph[], xaxis: string, yaxis: any) => {
  return entitiesLists.map((data) => ({
    xaxis: data[xaxis],
    yaxis: data[yaxis],
  }));
}

export const formatCurrency = (amount: number | string | null): string => {
  if (amount == null) {
    return "0";
  }
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) {
    return "0";
  }
  const formattedCurrency = numericAmount.toLocaleString(i18n.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
    currencyDisplay: 'symbol',
  });
  return formattedCurrency;
};

export const getAgeing = (dateString: string) => {
  const utcDatetime = new Date(dateString);
  const currentDate = new Date();
  const currentTimezoneOffset = currentDate.getTimezoneOffset();
  currentDate.setMinutes(currentDate.getMinutes() + currentTimezoneOffset);
  const differenceInMilliseconds = currentDate.getTime() - utcDatetime.getTime();
  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const days = Math.floor(differenceInMilliseconds / millisecondsInDay);
  const remainingMilliseconds = differenceInMilliseconds % millisecondsInDay;
  const hours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  return `${days ? days + ' days' : ''} ${hours} hour ${minutes} minutes ago`;
}

export const getBrowserTimeZone = () => {

  return new Date().toLocaleDateString(undefined, { day: '2-digit', timeZoneName: 'long' }).substring(4)
}