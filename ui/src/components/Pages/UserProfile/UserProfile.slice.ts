import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GenericErrors } from '../../../types/error';
import { MultipleUserRoles, RegisteredUser, UserEditTemplate, UserRole } from '../../../types/user';

export interface EditUserState {
  user: RegisteredUser;
}

const initialState: EditUserState = {
  user: {
    Id: 0,
    FullName: '',
    Email: '',
    Phone: '',
    Department:'',
    Designation:'',
    EmployeeCode:'',
    Gender:'',
    IsDeleted:false,
    Location:"",
    UserCategory:"",
    UserInfoStatus:false,
    UserLoginStatus:false,
    DocumentUrl:""
  }
};

const slice = createSlice({
  name: 'userprofile',
  initialState,
  reducers: {
    initializeUser: () => initialState,
    setUserProfile: (state, { payload: userDeails }: PayloadAction<any>) => {
      state.user = userDeails;
    },
    setUserProfileStatus: (state, { payload: status }: PayloadAction<any>) => {
      state.user.UserInfoStatus = status;
    },
  },
});

export const {
  initializeUser,
  setUserProfile,
  setUserProfileStatus
} = slice.actions;

export default slice.reducer;
