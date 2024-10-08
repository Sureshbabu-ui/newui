import { store } from '../state/store';

export const checkForPermission = (FunctionCode: string) => {
  const permissionString = store.getState().app.permissionString;
  return permissionString?.split(',').includes(FunctionCode)
}

export const checkForMenuPermission = (...businessFunctions: string[]): boolean => {
  const permissions = store.getState().app.permissionString?.split(',') ?? [];
  for (const permission of permissions) {
    if (businessFunctions.includes(permission)) {
      return true;
    }
  }
  return false;
}