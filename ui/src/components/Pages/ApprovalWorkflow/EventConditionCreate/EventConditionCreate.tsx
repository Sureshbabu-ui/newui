import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { useStore } from "../../../../state/storeHooks";
import { checkForPermission } from "../../../../helpers/permissions";
import { store } from "../../../../state/store";
import { startPreloader, stopPreloader } from "../../../Preloader/Preloader.slice";
import { initializeEventConditionMasterList } from "../EventConditionMasterList/EventConditionMasterList.slice";
import { getEventConditionMasterList } from "../../../../services/ApprovalWorkflow/eventConditionMaster";
import { addCondition, clearWorkflowDetail, CreateEventConditionState, loadApprovalWorkflows, loadEventConditionDetails, loadEventConditionMasters, loadMasterData, removeCondition, setSelectedColumn, toggleInformationModalStatus, updateCondition, updateErrors, updateField } from "./EventConditionCreate.slice";
import { Container } from "react-bootstrap";
import { getApprovalWorkflowNames } from "../../../../services/approvalWorkflow";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../helpers/formats";
import Select from 'react-select';
import { getValuesInMasterDataByTable } from "../../../../services/masterData";
import { getDivisionNames } from "../../../../services/division";
import { getTenantOfficeName } from "../../../../services/tenantOfficeInfo";
import * as yup from 'yup';
import { createEventCondition, getEventConditionListView } from "../../../../services/ApprovalWorkflow/eventCondition";
import SweetAlert from "react-bootstrap-sweetalert";
import { getDesignations } from "../../../../services/designation";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";
import { ValidationErrorComp } from "../../../ValidationErrors/ValidationError";
import { conditionalOperators } from "../../../../helpers/approvalWorkflow";

const EventConditionCreate = () => {
    const { EventId } = useParams<{ EventId: string }>();

    const { t } = useTranslation();

    const {
        eventconditioncreate: { eventConditionMasterData, approvalWorkflows, eventCondition, masterDataList, selectedConditionArray, columns, selectedColumn, errors, displayInformationModal, eventDetail },
    } = useStore(({ eventconditioncreate, app }) => ({ eventconditioncreate, app }));

    useEffect(() => {
        if (checkForPermission('APPROVALWORKFLOW_MANAGE') && EventId)
            onLoad();
    }, [EventId]);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeEventConditionMasterList());
        try {
            const approvalWorkFlows = await getEventConditionListView(EventId, '');
            store.dispatch(loadEventConditionDetails(approvalWorkFlows));
            store.dispatch(updateField({ name: 'ApprovalEventId', value: EventId }));
            const result = await getEventConditionMasterList(Number(EventId))
            store.dispatch(loadEventConditionMasters(result));
            var { MasterData } = await getApprovalWorkflowNames()
            const workflows = await formatSelectInput(MasterData, "Name", "Id")
            store.dispatch(loadApprovalWorkflows({ MasterData: workflows }));
        } catch (error) {
            return;
        }
        store.dispatch(stopPreloader())
    }

    useEffect(() => {
        getMasterDatas()
    }, [eventConditionMasterData])

    const getMasterDatas = async () => {
        const fetchMasterData = async (tableName) => {
            const result = await getValuesInMasterDataByTable(tableName);
            return formatSelectInput(result.MasterData, 'Name', 'Id');
        };

        const lookupMappings = {
            DepartmentId: 'Department',
            UserCategoryId: 'UserCategory'
        };

        const masterDataFetchers = {
            DivisionId: async () => {
                const result = await getDivisionNames();
                return formatSelectInput(result.Divisions, 'Name', 'Id');
            },
            DesignationId: async () => {
                const result = await getDesignations();
                return formatSelectInput(result.Designations, 'Name', 'Id');
            },
            TenantOfficeId: async () => {
                const result = await getTenantOfficeName();
                return formatSelectInput(result.TenantOfficeName, 'OfficeName', 'Id');
            }
        };

        for (const item of eventConditionMasterData) {
            if (item.ValueType === 'SELECT') {
                if (lookupMappings[item.ColumnName]) {
                    const filteredResult = await fetchMasterData(lookupMappings[item.ColumnName]);
                    store.dispatch(loadMasterData({ name: item.ColumnName, value: { MasterData: filteredResult } }));
                } else if (masterDataFetchers[item.ColumnName]) {
                    const filteredResult = await masterDataFetchers[item.ColumnName]();
                    store.dispatch(loadMasterData({ name: item.ColumnName, value: { MasterData: filteredResult } }));
                }
            }
        }
    }

    const onSelectChange = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta.name ?? null;
        const value = selectedOption?.value ?? null;
        store.dispatch(updateField({ name: name as keyof CreateEventConditionState['eventCondition'], value }));
    }

    const onUpdateSelectValue = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : null;
        store.dispatch(updateCondition({ name, value, type: 'value' }));
    }

    const onUpdateOperator = (selectedOption: any, actionMeta: any) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : null;
        store.dispatch(updateCondition({ name, value, type: 'operator' }));
    }

    const onUpdateValue = async (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateCondition({ name, value, type: 'value' }));
    }

    const onUpdateField = async (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name, value: value }));
    }

     const onSelectColumn = (selectedOption: any, actionMeta: any) => {
        const value = selectedOption?.value ?? null;
        store.dispatch(setSelectedColumn(value));
    }

    const handleAddCondition = (ev: any) => {
        store.dispatch(addCondition())
    }

    const handleRemoveCondition = (ev: any) => {
        store.dispatch(removeCondition(ev.target.value))
    }

    const validationSchema = yup.object().shape({
        ConditionName: yup.string().required('validation_error_eventconditioncreate_workflow_required'),
        ApprovalWorkflowId: yup.string().required('validation_error_eventconditioncreate_workflow_required'),
    });

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={handleReload}>
                {t('eventconditioncreate_success_message')}
            </SweetAlert>
        );
    }

    const history = useHistory()
    const handleReload = async () => {
        store.dispatch(clearWorkflowDetail());
        history.push(`/config/workflowconfiguration/condition/${EventId}`)
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(eventCondition, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await createEventCondition(eventCondition);
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopPreloader());
    }

    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_manage_workflowconfiguration', Link: '/config/workflowconfiguration' },
            { Text: 'breadcrumbs_manage_eventconditionlist', Link: `/config/workflowconfiguration/condition/${EventId}` },
            { Text: 'breadcrumbs_manage_eventconditioncreate' }
        ];
    }

    return (<Container>
        <div>
            <BreadCrumb items={breadcrumbItems()} />
            <div className="row">
                <div className="col-md-6 mt-2 pt-3">
                    <div className="mb-2">
                        {`${t('eventconditioncreate_title_eventgroup')}: ${eventDetail.EventGroupName}`}
                    </div>
                    <div className="mb-2">
                        {`${t('eventconditioncreate_title_eventname')}: ${eventDetail.EventName}`}
                    </div>
                </div>
            </div>
            {errors && <ValidationErrorComp errors={errors} />}
            <div className="row">
                <div className="col-md-7">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="mb-3">
                                <label className="red-asterisk">{t('eventconditioncreate_input_conditionname')}</label>
                                <input name='ConditionName'
                                    value={eventCondition.ConditionName ?? ''}
                                    className={`form-control  ${errors["ConditionName"] ? "is-invalid" : ""}`}
                                    onChange={onUpdateField} type='text'
                                ></input>
                                <div className="invalid-feedback"> {t(errors['ConditionName'])}</div>
                            </div>
                            <div className="mb-3">
                                <label className="red-asterisk">{t('eventconditioncreate_input_workflow')}</label>
                                <Select
                                    options={approvalWorkflows}
                                    value={approvalWorkflows && approvalWorkflows.find(option => option.value == eventCondition.ApprovalWorkflowId) || null}
                                    onChange={onSelectChange}
                                    isSearchable
                                    isClearable
                                    name="ApprovalWorkflowId"
                                    placeholder={t('eventconditioncreate_select_workflow')}
                                    classNames={{
                                        control: (state) =>
                                            errors['ApprovalWorkflowId'] ? 'border-danger' : '',
                                    }}
                                />
                                <div className="small text-danger mt-1"> {t(errors['ApprovalWorkflowId'])}</div>
                            </div>
                        </div>
                    </div>
                    {columns.length > 0 ?
                        <div className="row">
                            <div className="col-md-8">
                                <Select
                                    options={columns}
                                    value={columns && columns.find(option => option.value == selectedColumn) || null}
                                    onChange={onSelectColumn}
                                    isSearchable
                                    isClearable
                                    name="selectedColumn"
                                    placeholder={t('eventconditioncreate_select_column')}
                                />
                            </div>
                            <div className="col-md-1 px-0 btn btn-small btn-success" onClick={handleAddCondition}>
                                +
                            </div>
                        </div>
                        : <></>
                    }
                    {eventConditionMasterData.length > 0 ?
                        <div className="row pe-0 ps-0 mb-2">

                            <div className=" pe-3 me-0 mt-4" id="">
                                {selectedConditionArray.map((event, index) => (
                                    <div key={index}>
                                        {index === 0
                                            || event.tableName !== selectedConditionArray?.[index - 1]?.tableName
                                            ? (
                                                <div className=" bg-light mb-1 pt-2">
                                                    <div className="col mb-1">
                                                        <div className="accordion-header">
                                                            <span className="col-md-4 py-1">{event.tableName}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null
                                        }
                                        <div className="">
                                            <div className="row px-0 py-2 pt-1 bg-white">
                                                <div className="col-md-1">
                                                    <span>{index == 0 ? "WHERE" : "AND"}</span>
                                                </div>
                                                <div className="col-md-2">
                                                    <span>{event.columnDisplayName}</span>
                                                </div>

                                                <div className="col-md-3">
                                                    <Select
                                                        options={conditionalOperators[event.valueType]}
                                                        value={
                                                            conditionalOperators[event.valueType].find(option => option.value == selectedConditionArray.find(item => item.key == event.key)?.operator)
                                                            || null}
                                                        onChange={onUpdateOperator}
                                                        isSearchable
                                                        isClearable
                                                        name={event.key}
                                                        placeholder={t('eventconditioncreate_select_masterdata')}
                                                    />
                                                </div>
                                                {event.valueType == 'SELECT' &&

                                                    <div className="col-md-5">
                                                        <Select
                                                            options={masterDataList?.find(item => item.key == event.columnName)?.values}
                                                            value={masterDataList?.find(item => item.key == event.columnName)?.values.find(option => option.value == selectedConditionArray.find(item => item.key == event.key)?.value) || null}
                                                            onChange={onUpdateSelectValue}
                                                            name={event.key}
                                                            isSearchable
                                                            isClearable
                                                            placeholder={t('eventconditioncreate_select_masterdata')}
                                                        />
                                                    </div>
                                                }
                                                {['NUMBER', 'STRING'].includes(event.valueType) &&

                                                    <div className="col-md-5">
                                                        <input
                                                            name={event.key}
                                                            type={event.valueType}
                                                            className='form-control'
                                                            onChange={onUpdateValue}
                                                        />
                                                    </div>
                                                }
                                                <div className="col-md-1">
                                                    <button className="btn btn-danger btn-small px-3" onClick={handleRemoveCondition} value={event.key}>
                                                        -
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        : <div className="ps-0 mt-2"></div>
                    }
                </div>
                <div className="col-md-5">
                    {t('approvalrequestlist_preview')}
                    <p>{eventCondition.ConditionValue}</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <button type='button' className='btn  app-primary-bg-color text-white w-75 mb-3' onClick={onSubmit}>
                        {t('eventconditioncreate_submit_button')}
                    </button>
                </div>
                <div className="col-md-6">
                </div>
            </div>
            {displayInformationModal ? <InformationModal /> : ""}
        </div>
    </Container>)
}
export default EventConditionCreate