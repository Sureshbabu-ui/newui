import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../state/storeHooks";
import { store } from "../../../../../state/store";
import { CreateFutureUpdateState, initializeFutureUpdate, loadMasterData, toggleInformationModalStatus, updateErrors, updateField } from "./FutureUpdateCreate.slice";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { futureUpdateCreate, getFutureUpdateList, getOldContractDetails } from "../../../../../services/futureUpdates";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../../helpers/formats";
import * as yup from 'yup';
import SweetAlert from "react-bootstrap-sweetalert";
import { loadFutureUpdates } from "../FutureUpdatesList/FutureUpdateList.slice";
import { checkForPermission } from "../../../../../helpers/permissions";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import Select from 'react-select';
import { getValuesInMasterDataByTable } from "../../../../../services/masterData";
import { useParams } from "react-router-dom";

const FutureUpdateCreate = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const { ContractId } = useParams<{ ContractId: string }>();
    const MODAL_NAME = "CreateFutureUpdate"
    const {
        futureupdatecreate: { futureupdate, displayInformationModal, errors, masterentity },
        futureupddatelist: { visibleModal }
    } = useStore(({ futureupdatecreate, futureupddatelist }) => ({ futureupdatecreate, futureupddatelist }));

    async function GetMasterDataItems() {
        if (visibleModal == MODAL_NAME) {
            store.dispatch(initializeFutureUpdate())
            store.dispatch(updateField({ name: 'ContractId', value: ContractId }));
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
    const contractno = store.getState().generalcontractdetails.singlecontract.ContractNumber

    useEffect(() => {
        GetMasterDataItems()
    }, [visibleModal == MODAL_NAME])

    useEffect(() => {
        async function GetOldContractNo() {
            try {
                var contractno = await getOldContractDetails(Number(ContractId))
                if (contractno.oldcontractdetails) {
                    store.dispatch(updateField({ name: 'RenewedMergedContractNumber', value: contractno.oldcontractdetails }));
                }

            } catch (error) {
                console.error(error);
            }
        }
        GetOldContractNo()
    }, [ContractId])

    const onUpdateField = (ev: any) => {
        const name = ev.target.name;
        const value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof CreateFutureUpdateState['futureupdate'], value }));
    }

    function onSelectChange(selectedOption: any, Name: any) {
        var value = selectedOption.value
        var name = Name
        store.dispatch(updateField({ name: name as keyof CreateFutureUpdateState['futureupdate'], value }));
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
        const result = await futureUpdateCreate(futureupdate)
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
    const validationSchema = yup.object().shape({
        ContractId: yup.number().required('validation_error_future_update_create_contractnumber_required'),
        ProbabilityPercentage: yup.string().required('validation_error_future_update_create_probabilitypercentage_required').min(0, 'validation_error_future_update_create_probabilitypercentage_minimum_value').max(100, 'validation_error_future_update_create_probabilitypercentage_maximum_value'),
        StatusId: yup.number().required('validation_error_future_update_create_statusid_required'),
        SubStatusId: yup.number().required('validation_error_future_update_create_substatusid_required')
    });
    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={updateFutureUpdate}>
                {t('future_update_create_successfully')}
            </SweetAlert>
        );
    }

    const updateFutureUpdate = async () => {
        store.dispatch(initializeFutureUpdate())
        store.dispatch(toggleInformationModalStatus());
        const FutureUpdate = await getFutureUpdateList(Number(ContractId), store.getState().futureupddatelist.search);
        store.dispatch(loadFutureUpdates(FutureUpdate));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeFutureUpdate())
    }

    return (
        <>
            {checkForPermission("CONTRACT_FUTUREUPDATES_MANAGE") &&
                <div
                    className="modal fade"
                    id='CreateFutureUpdate'
                    data-bs-backdrop='static'
                    data-bs-keyboard='false'
                    aria-hidden='true'
                >
                    <div className="modal-dialog ">
                        <div className="modal-content">
                            <div className="modal-header mx-2">
                                <h5 className="modal-title">{t('future_update_create_title')}</h5>
                                <button
                                    type='button'
                                    className="btn-close"
                                    data-bs-dismiss='modal'
                                    id='closeCreateFutureUpdateModal'
                                    aria-label='Close'
                                    onClick={onModalClose}
                                    ref={modalRef}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <ValidationErrorComp errors={errors} />
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <label className="mt-2 ">{t('future_update_contract_number')}</label>
                                            <input name='ContractId' disabled type='text'
                                                value={contractno || ""}
                                                className={`form-control  ${errors["ContractId"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['ContractId'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 ">{t('future_update_renewed_merged_contract_number')}</label>
                                            <input name='RenewedMergedContractNumber' maxLength={16} onChange={onUpdateField} disabled type='text'
                                                value={futureupdate.RenewedMergedContractNumber}
                                                className={`form-control  ${errors["RenewedMergedContractNumber"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['RenewedMergedContractNumber'])}</div>
                                        </div>
                                        <div className="mb-3 mt-2">
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
                                        <div className="mb-3">
                                            <label className='red-asterisk'>{t('future_update_substatus')}</label>
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
                                            <label className="red-asterisk">{t('future_update_probability_percentage')}</label>
                                            <input name='ProbabilityPercentage' maxLength={16} onChange={onUpdateField} type='text'
                                                value={futureupdate.ProbabilityPercentage || ""}
                                                className={`form-control  ${errors["ProbabilityPercentage"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['ProbabilityPercentage'])}</div>
                                        </div>
                                        <div className='col-md-12'>
                                            <label className="mt-2 ">{t('future_update_target_date')}</label>
                                            <input name='TargetDate' maxLength={16} onChange={onUpdateField} type='date'
                                                value={futureupdate.TargetDate ? futureupdate.TargetDate.split('T')[0] : ""}
                                                min={new Date().toISOString().split('T')[0]}
                                                className={`form-control  ${errors["TargetDate"] ? "is-invalid" : ""}`}
                                            ></input>
                                            <div className="invalid-feedback"> {t(errors['TargetDate'])}</div>
                                        </div>
                                        <div className="col-md-12 mt-4 ">
                                            <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                Create
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
export default FutureUpdateCreate