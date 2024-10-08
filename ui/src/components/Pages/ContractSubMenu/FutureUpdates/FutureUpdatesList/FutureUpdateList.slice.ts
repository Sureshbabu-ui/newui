import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FutureUpdatesDetails, FutureUpdatesList } from '../../../../../types/futureupdates';

export interface FutureUpdateList {
    futureUpdates: FutureUpdatesDetails;
}
export interface FutureUpdatesListState {
    futureupdates: Option<readonly FutureUpdateList[]>;
    search: any;
    visibleModal: string
}
const initialState: FutureUpdatesListState = {
    futureupdates: None,
    search: null,
    visibleModal: ""
};
const slice = createSlice({
    name: 'futureupddatelist',
    initialState,
    reducers: {
        initializeFutureUpdatesList: () => initialState,
        loadFutureUpdates: (state, { payload: { FutureUpdates } }: PayloadAction<FutureUpdatesList>) => {
            state.futureupdates = Some(FutureUpdates.map((futureUpdates) => ({ futureUpdates })));
        },
        setSearch: (state, { payload: Searchname }: PayloadAction<string>) => {
            state.search = Searchname;
        },
        setVisibleModal: (state, { payload: ModalName }: PayloadAction<string>) => {
            state.visibleModal = ModalName;
        },
    },
});

export const { initializeFutureUpdatesList, setVisibleModal, loadFutureUpdates, setSearch } = slice.actions;
export default slice.reducer;