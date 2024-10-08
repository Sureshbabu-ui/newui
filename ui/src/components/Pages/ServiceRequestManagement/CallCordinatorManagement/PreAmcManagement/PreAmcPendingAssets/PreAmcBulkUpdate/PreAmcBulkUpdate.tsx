import * as yup from 'yup';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { store } from '../../../../../../../state/store';
import { initializeAsset, toggleInformationModalStatus, updateErrors, updateField } from './PreAmcBulkUpdate.slice';
import { startPreloader, stopPreloader } from '../../../../../../Preloader/Preloader.slice';
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from '../../../../../../../helpers/formats';
import { ValidationErrorComp } from '../../../../../../ValidationErrors/ValidationError';
import { useStore } from '../../../../../../../state/storeHooks';
import { getAllPreAmcPendingAssetList } from '../../../../../../../services/assets';
import { loadPreAmcPendingAssets } from '../PreAmcPendingAssets.slice';
import { BulkPreAmcPendingAssetUpdate, getPreAMCPendingCount } from '../../../../../../../services/contractPreAmc';
import { setPreAMCPendingCount } from '../../PreAmcManagement.slice';
import { getRegionWiseServiceEngineers } from '../../../../../../../services/users';
import Select from 'react-select';

export function PreAmcBulkUpdate() {
    const modalRef = useRef<HTMLButtonElement>(null);
    const { t } = useTranslation();
    const { errors, displayInformationModal, AssetIdList, preAmcDetails } = useStore(
        ({ preamcbulkupdate }) => preamcbulkupdate,
    );
    const [selectEngineersList, setEngineersList] = useState<any>(null)
    const validationSchema = yup.object().shape({
        PreAmcCompletedDate: yup.string()
            .required('validation_error_update_preamc_completed_date_required')
            .test('is-future', 'validation_error_update_preamc_completed_date_validation', function (value) {
                if (!value) return true;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return new Date(value) <= today;
            }),
        EngineerId: yup.number().positive('validation_error_update_preamc_engineer_required'),
    })

    function InformationModal() {
        const { t, i18n } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={reDirectRoute}>
                {t('update_preamc_assets_created_successfully')}
            </SweetAlert>
        );
    }

    useEffect(() => {
        EngineersList()
    }, [])

    const EngineersList = async () => {
        const { ServiceEngineers } = await getRegionWiseServiceEngineers();
        setEngineersList(formatSelectInput(ServiceEngineers, "FullName", "Id",));
    }

    const reDirectRoute = async () => {
        store.dispatch(toggleInformationModalStatus());
        modalRef.current?.click()
        store.dispatch(initializeAsset())
        try {
            const Assets = await getAllPreAmcPendingAssetList("", 1);
            store.dispatch(loadPreAmcPendingAssets(Assets));

            const result = await getPreAMCPendingCount();
            store.dispatch(setPreAMCPendingCount(result));
        } catch (error) {
            return error
        }
    }
    const onModalClose = () => {
        store.dispatch(initializeAsset())
    }

    function onUpdateField(ev: any) {
        var value = ev.target.value;
        store.dispatch(updateField({ name: "PreAmcCompletedDate", value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(preAmcDetails, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await BulkPreAmcPendingAssetUpdate({ ...preAmcDetails, AssetIdList: AssetIdList })
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            }
        });
        store.dispatch(stopPreloader());
    }

    const onSelectChange = (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        store.dispatch(updateField({ name: "EngineerId", value }));
    }

    return (
        <>
            <div
                className="modal fade px-0"
                id="PreAmcBulkUpdate"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{t('preamc_assetdetails_title_preamcupdate')}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                id="closePreAmcBulkUpdateModal"
                                aria-label="Close"
                                onClick={onModalClose}
                                ref={modalRef}
                            >
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className='container-fluid '>
                                <ValidationErrorComp errors={errors} />
                                <div className="col-md-12" >
                                    <div className="row">
                                        <div>
                                            <label className="mt-2 red-asterisk">{t('update_assets_label_choose_engineer')}</label>
                                            <Select
                                                options={selectEngineersList}
                                                value={selectEngineersList && selectEngineersList.find(option => option.value == preAmcDetails.EngineerId) || null}
                                                onChange={onSelectChange}
                                                isSearchable
                                                classNamePrefix="react-select"
                                                name="EngineerId"
                                                placeholder="Select"
                                            />
                                            <div className="small text-danger"> {t(errors["EngineerId"])}</div>
                                        </div>
                                        <div className="mb-1 col">
                                            <label className='red-asterisk'>{t('update_assets_label_pre_amc_completeddate')}</label>
                                            <input value={preAmcDetails.PreAmcCompletedDate} type="date" name="PreAmcCompletedDate" onChange={onUpdateField} max={new Date().toISOString().split("T")[0]} className="form-control"></input>
                                            <div className="small text-danger"> {t(errors['PreAmcCompletedDate'])}</div>
                                        </div>
                                    </div>
                                    <button type="button" onClick={onSubmit} className="btn app-primary-bg-color text-white mt-2">
                                        {t('update_assets_button')}
                                    </button>
                                    {/* Update assets form ends here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <>
                {displayInformationModal ? <InformationModal /> : ""}
            </>
        </>
    );
}