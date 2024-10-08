import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../state/storeHooks";
import { store } from "../../../../../state/store";
import { EditFutureUpdateState, initializeFutureUpdate, loadMasterData, toggleInformationModalStatus, updateErrors, updateField } from "./FutureUpdateEdit.slice";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import { futureUpdateEdit, getFutureUpdateList } from "../../../../../services/futureUpdates";
import SweetAlert from "react-bootstrap-sweetalert";
import { loadFutureUpdates } from "../FutureUpdatesList/FutureUpdateList.slice";
import * as yup from 'yup';
import { checkForPermission } from "../../../../../helpers/permissions";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { useParams } from "react-router-dom";
import Select from 'react-select';
import { getValuesInMasterDataByTable } from "../../../../../services/masterData";

const FutureUpdatesEdit = () => {
    const { ContractId } = useParams<{ ContractId: string }>();
    const { t } = useTranslation();
    const MODAL_NAME = "EditFutureUpdates"
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        editfutureupdate: { futureupdate, displayInformationModal, errors, masterentity },
        futureupddatelist: { visibleModal }
    } = useStore(({ editfutureupdate, futureupddatelist }) => ({ editfutureupdate, futureupddatelist }));

    useEffect(() => {
        GetMasterDataItems()
    }, [visibleModal == MODAL_NAME])

    async function GetMasterDataItems() {
        if (visibleModal == MODAL_NAME) {
            try {
                var { MasterData } = await getValuesInMasterDataByTable("ContractFutureUpdateStatus")
                const ContractFutureUpdateStatus = await formatSelectInput(MasterData, "Name", "Id")
                store.dispatch(loadMasterData({ name: "ContractFutureUpdateStatus", value: { Select: ContractFutureUpdateStatus } }));

                var { MasterData } = await getValuesInMasterDataByTable("ContractFutureUpdateSubStatus")
                const ContractFutureUpdateSubStatus = await formatSelectInput(MasterData, "Name", "Id")
                store.dispatch(loadMasterData({ name: "ContractFutureUpdateSubStatus", value: { Select: ContractFutureUpdateSubStatus } }));
            } catch (error) {
                console.error(error);
            }
        }
    }
    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        if (name == "ProbabilityPercentage") {
            store.dispatch(updateField({ name: name as keyof EditFutureUpdateState['futureupdate'], value: Number(value) }));
        } else if (name == "TargetDate" && value == "") {
            store.dispatch(updateField({ name: 'TargetDate', value: null }));
        }
        else {
            store.dispatch(updateField({ name: name as keyof EditFutureUpdateState['futureupdate'], value }));
        }
    }
    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(futureupdate, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await futureUpdateEdit(futureupdate)
        result.match({
            ok: ({ IsFutureUpdateUpdated }) => {
                IsFutureUpdateUpdated == true ? store.dispatch(toggleInformationModalStatus()) : store.dispatch(updateErrors({ "Message": "Update Warning" }))
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopPreloader());
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateFutureUpdate}>
                {t('future_update_edit_successfully')}
            </SweetAlert>
        );
    }

    const updateFutureUpdate = async () => {
        store.dispatch(initializeFutureUpdate())
        store.dispatch(toggleInformationModalStatus());
        const searchSubmit = store.getState().futureupddatelist.search;
        const search = store.getState().futureupddatelist.search;
        const FutureUpdate = await getFutureUpdateList(Number(ContractId), searchSubmit ? search : "");
        store.dispatch(loadFutureUpdates(FutureUpdate));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeFutureUpdate())
    }

    const validationSchema = yup.object().shape({
        ProbabilityPercentage: yup.number()
            .required('validation_error_future_update_create_probabilitypercentage_required')
            .min(0, 'validation_error_future_update_create_probabilitypercentage_minimum_value')
            .max(100, 'validation_error_future_update_create_probabilitypercentage_maximum_value'),
        StatusId: yup.number().required('validation_error_future_update_create_statusid_required'),
        SubStatusId: yup.number().required('validation_error_future_update_create_substatusid_required'),
    });

    function onSelectChange(selectedOption: any, Name: any) {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof EditFutureUpdateState['futureupdate'], value }));

    }

    return (
        <>
            <div
                className="modal fade"
                id='EditFutureUpdates'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('future_update_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditFutureUpdateModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("CONTRACT_FUTUREUPDATES_MANAGE") &&
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <ValidationErrorComp errors={errors} />
                                    <div className=''>
                                        <div className='row mb-1'>
                                            <div className='col-md-12'>
                                                <label className='red-asterisk'>{t('future_update_status')}</label>
                                                <Select
                                                    options={masterentity.ContractFutureUpdateStatus}
                                                    value={masterentity.ContractFutureUpdateStatus && masterentity.ContractFutureUpdateStatus.find(option => option.value == futureupdate.StatusId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "StatusId")}
                                                    isSearchable
                                                    classNamePrefix="react-select"
                                                    name="StatusId"
                                                    placeholder={t('future_update_status_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['StatusId'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className='mt-2 red-asterisk'>{t('future_update_substatus')}</label>
                                                <Select
                                                    options={masterentity.ContractFutureUpdateSubStatus}
                                                    value={masterentity.ContractFutureUpdateSubStatus && masterentity.ContractFutureUpdateSubStatus.find(option => option.value == futureupdate.SubStatusId) || null}
                                                    onChange={(selectedOption) => onSelectChange(selectedOption, "SubStatusId")}
                                                    isSearchable
                                                    classNamePrefix="react-select"
                                                    name="SubStatusId"
                                                    placeholder={t('future_update_substatus_placeholder')}
                                                />
                                                <div className="small text-danger"> {t(errors['SubStatusId'])}</div>
                                            </div>

                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('future_update_probability_percentage')}</label>
                                                <input name='ProbabilityPercentage' onChange={onUpdateField} type='text'
                                                    value={futureupdate.ProbabilityPercentage}
                                                    className={`form-control  ${errors["ProbabilityPercentage"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['ProbabilityPercentage'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 ">{t('future_update_target_date')}</label>
                                                <input
                                                    name='TargetDate'
                                                    onChange={onUpdateField}
                                                    type='date'
                                                    value={futureupdate.TargetDate ? futureupdate.TargetDate.split('T')[0] : ""}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className={`form-control  ${errors["TargetDate"] ? "is-invalid" : ""}`}
                                                />
                                                <div className="invalid-feedback">
                                                    {t(errors['TargetDate'])}
                                                </div>
                                            </div>

                                            <div className="col-md-12 mt-4 ">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end'
                                                    onClick={onSubmit}>
                                                    {t('future_update_edit_button')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default FutureUpdatesEdit