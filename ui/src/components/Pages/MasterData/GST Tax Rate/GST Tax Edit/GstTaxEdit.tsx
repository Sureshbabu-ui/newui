import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../state/storeHooks";
import { store } from "../../../../../state/store";
import { EditGstTaxRateState, initializeGstEdit, toggleInformationModalStatus, updateErrors, updateField } from "./GstTaxEdit.slice";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { getGstTaxRateList, gstEdit } from "../../../../../services/GstTaxRate";
import { convertBackEndErrorsToValidationErrors } from "../../../../../helpers/formats";
import SweetAlert from "react-bootstrap-sweetalert";
import * as yup from 'yup';
import { loadGstTaxRate } from "../GstList.slice";
import { checkForPermission } from "../../../../../helpers/permissions";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";

const GstTaxEdit = () => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLButtonElement>(null);
    const {
        gstedit: { gsttax, displayInformationModal, errors },
    } = useStore(({ gstedit }) => ({ gstedit }));

    useEffect(() => {
        store.dispatch(initializeGstEdit())
    }, [])

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        if (name == "IsActive") {
            value = ev.target.checked ? true : false;
        }
        store.dispatch(updateField({ name: name as keyof EditGstTaxRateState['gsttax'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        try {
            await validationSchema.validate(gsttax, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startPreloader());
        const result = await gstEdit(gsttax)
        result.match({
            ok: ({ IsGstUpdated }) => {
                IsGstUpdated == true ? store.dispatch(toggleInformationModalStatus()) : store.dispatch(updateErrors({ "Message": t('validation_error_gst_edit_warning') }))
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
            <SweetAlert success title="Success" onConfirm={updateGst}>
                {t('gst_edit_success_message')}
            </SweetAlert>
        );
    }

    const updateGst = async () => {
        store.dispatch(toggleInformationModalStatus());
        const search = store.getState().gsttaxratelist.search;
        const Gst = await getGstTaxRateList(search);
        store.dispatch(loadGstTaxRate(Gst));
        modalRef.current?.click()
    }

    const onModalClose = () => {
        store.dispatch(initializeGstEdit())
    }
    const validationSchema = yup.object().shape({
        TenantServiceName: yup.string().required('validation_error_gst_edit_service_name_required').max(64, 'validation_error_gst_edit_service_name_max'),
        ServiceAccountDescription: yup.string().required('validation_error_gst_edit_description_required').max(128, 'validation_error_gst_edit_description_max'),
        Cgst: yup.string().required('validation_error_gst_edit_cgst_required'),
        Sgst: yup.string().required('validation_error_gst_edit_sgst_required'),
        Igst: yup.string().required('validation_error_gst_edit_igst_required'),
    });

    return (
        <>
            <div
                className="modal fade"
                id='EditGst'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('gst_edit_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeEditGstModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        {checkForPermission("GSTRATE_MANAGE") &&
                            <div className="modal-body">
                                <div className="container-fluid">
                                    <ValidationErrorComp errors={errors} />
                                        <div className='row '>
                                            <div className='col-md-12'>
                                                <label className=" red-asterisk">{t('gst_tax_rate_table_service_name')}</label>
                                                <input name='TenantServiceName' onChange={onUpdateField} type='text'
                                                    value={gsttax.TenantServiceName??""}
                                                    className={`form-control  ${errors["TenantServiceName"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['TenantServiceName'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('gst_tax_rate_table_service_account_description')}</label>
                                                <textarea name='ServiceAccountDescription' onChange={onUpdateField}
                                                    value={gsttax.ServiceAccountDescription??""}
                                                    className={`form-control  ${errors["ServiceAccountDescription"] ? "is-invalid" : ""}`}
                                                ></textarea>
                                                <div className="invalid-feedback"> {t(errors['ServiceAccountDescription'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('gst_tax_rate_table_cgst')}</label>
                                                <input name='Cgst' onChange={onUpdateField} type='number'
                                                    value={gsttax.Cgst??""}
                                                    className={`form-control  ${errors["Cgst"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Cgst'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('gst_tax_rate_table_sgst')}</label>
                                                <input name='Sgst' onChange={onUpdateField} type='number'
                                                    value={gsttax.Sgst??""}
                                                    className={`form-control  ${errors["Sgst"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Sgst'])}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <label className="mt-2 red-asterisk">{t('gst_tax_rate_table_igst')}</label>
                                                <input name='Igst' onChange={onUpdateField} type='number'
                                                    value={gsttax.Igst??""}
                                                    className={`form-control  ${errors["Igst"] ? "is-invalid" : ""}`}
                                                ></input>
                                                <div className="invalid-feedback"> {t(errors['Igst'])}</div>
                                            </div>

                                            <div className="col-md-12">
                                                <div className="mt-2 form-check form-switch">
                                                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                                        {t('gst_edit_label_status')}
                                                        <input
                                                            className="form-check-input switch-input-lg"
                                                            type="checkbox"
                                                            name="IsActive"
                                                            id="flexSwitchCheckDefault"
                                                            checked={gsttax.IsActive.valueOf()}
                                                            value={gsttax.IsActive.toString()}
                                                            onChange={onUpdateField}
                                                        />
                                                    </label>
                                                    <div className="form-text">
                                                        {t('gst_edit_label_status_help_text')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12 mt-4 ">
                                                <button type='button' className='btn  app-primary-bg-color text-white mt-2 float-end' onClick={onSubmit}>
                                                    {t('gst_edit_button')}
                                                </button>
                                            </div>
                                        </div>
                                </div>
                                {displayInformationModal ? <InformationModal /> : ""}
                            </div>
                        }
                    </div>
                </div>
            </div></>
    )
}
export default GstTaxEdit
