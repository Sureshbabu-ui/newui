import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventConditionEdit, EventConditionListView, EventDetail } from '../../../../types/ApprovalWorkflow/eventCondition';
import { ValidationErrors } from '../../../../types/error';
import { valuesInMasterDataByTableDetailsSelect, valuesInMasterDataByTableSelect } from '../../../../types/masterData';
import { EventConditionMasterList, EventConditionMasterListDetail } from '../../../../types/ApprovalWorkflow/eventConditionMaster';
import { formatSelectInput } from '../../../../helpers/formats';

export interface MasterDataList {
    key: string,
    values: valuesInMasterDataByTableDetailsSelect[],
}

export interface ConditionArrayDetail {
    key: string;
    columnName,
    valueType,
    tableName,
    columnDisplayName,
    operator: string | null;
    value: string | null;
}

const generateConditionValue = (selectedConditionArray: ConditionArrayDetail[]) => {
    const filteredConditions = selectedConditionArray.filter(item => item.columnName && item.operator && item.value);
    const conditions = filteredConditions.map(item => '@' + item.columnName + ' ' + item.operator + ' ' + item.value);
    return conditions.join(' AND ')
}

export interface EditEventConditionState {
    eventCondition: EventConditionEdit;
    eventDetail: EventDetail,
    errors: ValidationErrors;
    submitting: boolean;
    displayInformationModal: boolean;
    masterDataList: MasterDataList[];
    eventConditionMasterData: EventConditionMasterListDetail[];
    approvalWorkflows: valuesInMasterDataByTableDetailsSelect[];
    columns: valuesInMasterDataByTableDetailsSelect[];
    selectedConditionArray: ConditionArrayDetail[];
    selectedColumn: number | null;
}

const initialState: EditEventConditionState = {
    eventCondition: {
        EventConditionId: null,
        ApprovalWorkflowId: null,
        ConditionName: null,
        ConditionValue: null
    },
    eventDetail: {
        EventId: null,
        EventGroupName: null,
        EventName: null
    },
    masterDataList: [],
    eventConditionMasterData: [],
    approvalWorkflows: [],
    columns: [],
    errors: {},
    submitting: false,
    displayInformationModal: false,
    selectedConditionArray: [],
    selectedColumn: null
};

const slice = createSlice({
    name: 'eventconditionedit',
    initialState,
    reducers: {
        initializeApprovalWorkFlowCreate: () => initialState,
        clearWorkflowDetail: (state) => {
            state.eventCondition.ApprovalWorkflowId = null,
                state.eventCondition.ConditionName = null,
                state.eventCondition.ConditionValue = null,
                state.errors = {}
            state.displayInformationModal = false
        },
        updateField: (
            state,
            { payload: { name, value } }: PayloadAction<{ name: keyof EditEventConditionState['eventCondition']; value: any }>
        ) => {
            state.eventCondition[name] = value as never;
        },
        setSelectedColumn: (
            state,
            { payload: value }: PayloadAction<number | null>
        ) => {
            state.selectedColumn = value
        },
        updateCondition: (
            state,
            { payload: { name, value, type } }: PayloadAction<{ name: string; value: string, type: string }>
        ) => {
            state.selectedConditionArray = state.selectedConditionArray.map(item =>
                item.key == name
                    ? {
                        ...item,
                        [type == 'value' ? 'value' : 'operator']: value
                    }
                    : item
            );
            state.eventCondition.ConditionValue = generateConditionValue(state.selectedConditionArray)
        },
        loadEventConditionDetails: (state, { payload: { EventDetail, EventConditionList } }: PayloadAction<EventConditionListView>) => {
            state.eventDetail = EventDetail;
            const selectedCondition = EventConditionList.find(item => item.Id == state.eventCondition.EventConditionId)
            state.eventCondition.ApprovalWorkflowId = selectedCondition?.ApprovalWorkflowId ?? null
            state.eventCondition.ConditionValue =selectedCondition?.ConditionValue??null
            state.selectedConditionArray = []
            const conditions = selectedCondition?.ConditionValue?.split('AND ');
            conditions?.map((item, index) => {
                const conditionValues = item.split(' ')
                const masterColumn = state.eventConditionMasterData?.find(item => item.ColumnName == conditionValues[0].replace('@', ''))
                if (masterColumn) {
                    state.selectedConditionArray.push({
                        key: index.toString(),
                        columnName: conditionValues[0].replace('@', ''),
                        valueType: masterColumn?.ValueType ?? null,
                        tableName: masterColumn?.TableName ?? null,
                        columnDisplayName: masterColumn?.ColumnDisplayName ?? null,
                        operator: conditionValues[1],
                        value: conditionValues[2]
                    });
                }
            }
            )
            state.eventCondition.ConditionName = selectedCondition?.ConditionName ?? null
        },
        updateErrors: (state, { payload: errors }: PayloadAction<ValidationErrors>) => {
            state.errors = errors;
        },
        startSubmitting: (state) => {
            state.submitting = true;
        },
        stopSubmitting: (state) => {
            state.submitting = false;
        },
        toggleInformationModalStatus: (state) => {
            state.displayInformationModal = !state.displayInformationModal;
        },
        loadMasterData: (state, { payload: { name, value: { MasterData } } }: PayloadAction<{ name: string; value: valuesInMasterDataByTableSelect }>) => {
            state.masterDataList.push({ key: name, values: MasterData.map((masterData) => (masterData)).sort((item1, item2) => item1.value - item2.value) })
        },
        loadApprovalWorkflows: (state, { payload: { MasterData } }: PayloadAction<valuesInMasterDataByTableSelect>) => {
            state.approvalWorkflows = MasterData.map((masterData) => (masterData)).sort((item1, item2) => item1.value - item2.value)
        },

        loadEventConditionMasters: (state, { payload: { EventConditionMasters } }: PayloadAction<EventConditionMasterList>) => {
            state.eventConditionMasterData = EventConditionMasters;
            state.columns = formatSelectInput(EventConditionMasters, 'ColumnDisplayName', 'MasterColumnId')
        },

        addCondition: (state) => {
            const event = state.eventConditionMasterData.find(item => item.MasterColumnId == state.selectedColumn)
            if (event)
                state.selectedConditionArray.push({
                    key: ((state.selectedConditionArray[state.selectedConditionArray.length - 1 ?? 0 - 1]?.key ?? 0) + 1).toString(),
                    tableName: event?.TableName,
                    columnName: event?.ColumnName,
                    columnDisplayName: event?.ColumnDisplayName,
                    valueType: event?.ValueType,
                    operator: null,
                    value: null
                });
            state.eventCondition.ConditionValue = generateConditionValue(state.selectedConditionArray)
        },

        removeCondition: (
            state,
            { payload: value }: PayloadAction<string | null>
        ) => {
            state.selectedConditionArray = state.selectedConditionArray.filter(item => item.key != value)
            state.eventCondition.ConditionValue = generateConditionValue(state.selectedConditionArray)
        },
    },
});

export const {
    initializeApprovalWorkFlowCreate,
    updateErrors,
    startSubmitting,
    toggleInformationModalStatus,
    loadEventConditionDetails,
    updateField,
    stopSubmitting,
    loadMasterData,
    clearWorkflowDetail,
    loadEventConditionMasters,
    loadApprovalWorkflows,
    updateCondition,
    addCondition,
    removeCondition,
    setSelectedColumn
} = slice.actions;

export default slice.reducer;