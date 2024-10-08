import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ReviewDetail {
  Id: string;
  ReviewComment: string;
  UserId: null,
  CreatedOn: null,
  ReviewStatus: string,
  ReviewedBy: string
}

export interface reviewHistoryState {
  ReviewedJsonDetails: ReviewDetail[];
}

const initialState: reviewHistoryState = {
  ReviewedJsonDetails: [{
    ReviewComment: '',
    UserId: null,
    CreatedOn: null,
    Id: '',
    ReviewStatus: '',
    ReviewedBy: ''
  }],
};

const slice = createSlice({
  name: 'contractreviewhistory',
  initialState,
  reducers: {
    initializeContract: () => initialState,
    loadReviewDetails: (state, { payload: reviewDetails }: PayloadAction<ReviewDetail[]>) => {
      state.ReviewedJsonDetails = reviewDetails;
    },
  },
});

export const {
  initializeContract,
  loadReviewDetails,
} = slice.actions;

export default slice.reducer;