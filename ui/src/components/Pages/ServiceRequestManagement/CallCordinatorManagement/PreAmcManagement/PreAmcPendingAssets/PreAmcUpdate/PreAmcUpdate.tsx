import * as yup from 'yup';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { store } from '../../../../../../../state/store';
import { UpdatePreAMCDetails, initializeAsset, setIsAssetInfo, toggleInformationModalStatus, updateErrors, updateField } from './PreAmcUpdate.slice';
import { startPreloader, stopPreloader } from '../../../../../../Preloader/Preloader.slice';
import { convertBackEndErrorsToValidationErrors, formatDate, formatSelectInput } from '../../../../../../../helpers/formats';
import { ValidationErrorComp } from '../../../../../../ValidationErrors/ValidationError';
import { useStore } from '../../../../../../../state/storeHooks';
import { getAllPreAmcPendingAssetList, updatePreAmc } from '../../../../../../../services/assets';
import { loadPreAmcPendingAssets } from '../PreAmcPendingAssets.slice';
import { getPreAMCPendingCount } from '../../../../../../../services/contractPreAmc';
import { setPreAMCPendingCount } from '../../PreAmcManagement.slice';
import Select from 'react-select';
import { getRegionWiseServiceEngineers } from '../../../../../../../services/users';

export function PreAmcUpdate() {
    const modalRef = useRef<HTMLButtonElement>(null);
    const { t, i18n } = useTranslation();
    const { errors, displayInformationModal, preAmcInfo, assetInfo, IsAssetInfo } = useStore(
        ({ preamcupdate }) => preamcupdate,
    );
    const [selectEngineersList, setEngineersList] = useState<any>(null)

    const validationSchema = yup.object().shape({
        PreAmcCompletedDate: yup.string()
            .when('IsPreAmcCompleted', (IsPreAmcCompleted, schema) =>
                preAmcInfo.IsPreAmcCompleted === true
                    ? schema
                        .required('validation_error_update_preamc_completed_date_required')
                        .test('is-future', "validation_error_update_preamc_completed_date_validation", function (value) {
                            if (!value) return true;
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return new Date(value) <= today;
                        })
                    : schema.nullable()
            ), EngineerId: yup.number().when('IsPreAmcCompleted', (IsPreAmcCompleted, schema) =>
                preAmcInfo.IsPreAmcCompleted === true
                    ? schema.positive('validation_error_update_preamc_engineer_required')
                    : schema.nullable()
            ),
    });

    function InformationModal() {
        const { t, i18n } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={reDirectRoute}>
                {t('update_preamc_assets_created_successfully')}
            </SweetAlert>
        );
    }

    useEffect(() => {
        store.dispatch(updateField({ name: "Id", value: assetInfo.Id }));
        EngineersList()
    }, [assetInfo.Id])

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
        store.dispatch(setIsAssetInfo(false))
    }

    function onUpdateField(ev: any) {
        var name = ev.target.name;
        var value = ev.target.value;
        var checked = ev.target.checked
        if (name === "IsPreAmcCompleted") {
            value = checked ? true : false
        }
        store.dispatch(updateField({ name: name as keyof UpdatePreAMCDetails['preAmcInfo'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(preAmcInfo, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await updatePreAmc(preAmcInfo)
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
                id="PreAmcUpdate"
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header mx-3">
                            <h5 className="modal-title app-primary-color">{IsAssetInfo ? t('assetdetails_title_assetinfo') : t('preamc_assetdetails_title_preamcupdate')}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                id="closePreAmcUpdateModal"
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
                                    {/* Asset Details Start */}
                                    {!IsAssetInfo && (
                                        <h6 className='fw-bold app-primary-color'>{t('preamc_assetdetails_title_assetdetails')}</h6>
                                    )}
                                    <div className="row">
                                        {/* col-1 */}
                                        <div className="col-md-4">
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_categoryname')}</label>
                                                <div >{assetInfo.AssetProductCategory}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_slno')}</label>
                                                <div >{assetInfo.ProductSerialNumber}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_assetcondition')}</label>
                                                <div >{assetInfo.ProductCondition ? assetInfo.ProductCondition : "---"}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_ispmneeded')}</label>
                                                <div >{assetInfo.IsPreventiveMaintenanceNeeded ? t('preamc_assetdetails_yes') : t('preamc_assetdetails_no')}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_isvipasset')}</label>
                                                <div >{assetInfo.IsVipProduct ? t('preamc_assetdetails_yes') : t('preamc_assetdetails_no')}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_isenterpriseasset')}</label>
                                                <div >{assetInfo.IsEnterpriseProduct ? t('preamc_assetdetails_yes') : t('preamc_assetdetails_no')}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_isoutsourcingneeded')}</label>
                                                <div >{assetInfo.IsOutSourcingNeeded ? t('preamc_assetdetails_yes') : t('preamc_assetdetails_no')}</div>
                                            </div>
                                        </div>

                                        {/* col-2 */}
                                        <div className="col-md-4">
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_make')}</label>
                                                <div >{assetInfo.ProductMake}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_customersite')}</label>
                                                <div >{assetInfo.CustomerSite ? assetInfo.CustomerSite : "---"}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_accelassetid')}</label>
                                                <div >{assetInfo.MspAssetId ? assetInfo.MspAssetId : "---"}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_pmf')}</label>
                                                <div >{assetInfo.PreventiveMaintenanceFrequency ? assetInfo.PreventiveMaintenanceFrequency : "---"}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_assetsupporttype')}</label>
                                                <div >{assetInfo.ProductSupportType ? assetInfo.ProductSupportType : "---"}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_resolutiontimeinhours')}</label>
                                                <div >{assetInfo.ResolutionTimeInHours}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_outsourcingvendor')}</label>
                                                <div >{assetInfo.VendorBranch ? assetInfo.VendorBranch : "---"}</div>
                                            </div>
                                        </div>

                                        {/* col-3 */}
                                        <div className="col-md-4">
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_model')}</label>
                                                <div>{assetInfo.ProductModel}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_customerassetid')}</label>
                                                <div className='pre-line'>{assetInfo.CustomerAssetId ? assetInfo.CustomerAssetId : "---"}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_warrantyenddate')}</label>
                                                <div className='pre-line'>{assetInfo.WarrantyEndDate ? formatDate(assetInfo.WarrantyEndDate) : "---"}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_amcenddate')}</label>
                                                <div className='pre-line'>{assetInfo.AmcEndDate ? formatDate(assetInfo.AmcEndDate) : "---"}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_standbytimeinhours')}</label>
                                                <div >{assetInfo.StandByTimeInHours}</div>
                                            </div>
                                            <div className="pt-2">
                                                <label className="form-text">{t('preamc_assetdetails_responsetimeinhours')}</label>
                                                <div className='text-break'>{assetInfo.ResponseTimeInHours}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {!IsAssetInfo && (
                                        <>
                                            <h6 className='fw-bold app-primary-color mt-3'>{t('preamc_assetdetails_title_preamcdetails')}</h6>
                                            {/* Update Assets form */}
                                            <div className="form-check form-switch ps-4 ms-3 mb-2 mt-2">
                                                <input
                                                    className="form-check-input switch-input-lg ps-1"
                                                    type="checkbox"
                                                    name="IsPreAmcCompleted"
                                                    id="ActiveSwitch"
                                                    checked={preAmcInfo.IsPreAmcCompleted}
                                                    value={preAmcInfo.IsPreAmcCompleted.toString()}
                                                    onChange={onUpdateField}
                                                ></input>
                                                <span>{t('update_assets_label_is_pre_amc_completed')}</span>
                                            </div>
                                            {preAmcInfo.IsPreAmcCompleted == true &&
                                                (
                                                    <div className="row">
                                                        <div className="mb-1 mt-1 col">
                                                            <label className='red-asterisk'>{t('update_assets_label_pre_amc_completeddate')}</label>
                                                            <input value={preAmcInfo.PreAmcCompletedDate ? preAmcInfo.PreAmcCompletedDate.split('T')[0] : ""} type="date" name="PreAmcCompletedDate" onChange={onUpdateField} className="form-control" max={new Date().toISOString().split("T")[0]}></input>
                                                            <div className="small text-danger"> {t(errors['PreAmcCompletedDate'])}</div>
                                                        </div>
                                                        {/* PreAmcEndDate */}
                                                        <div className="mb-1 mt-1 col">
                                                            <label className="red-asterisk">{t('update_assets_label_choose_engineer')}</label>
                                                            <Select
                                                                options={selectEngineersList}
                                                                value={selectEngineersList && selectEngineersList.find(option => option.value == preAmcInfo.EngineerId) || null}
                                                                onChange={onSelectChange}
                                                                isSearchable
                                                                classNamePrefix="react-select"
                                                                name="EngineerId"
                                                                placeholder="Select"
                                                            />
                                                            <div className="small text-danger"> {t(errors["EngineerId"])}</div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            {preAmcInfo.IsPreAmcCompleted == true &&
                                                (
                                                    <button type="button" onClick={onSubmit} className="btn app-primary-bg-color text-white mt-2">
                                                        {t('update_assets_button')}
                                                    </button>
                                                )
                                            }
                                            {/* Update assets form ends here */}
                                        </>
                                    )}
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