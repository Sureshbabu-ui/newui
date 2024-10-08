import { useTranslation } from "react-i18next"
import { useStoreWithInitializer } from "../../../../state/storeHooks";
import { LocationSettingDetailsState, toggleUpdate, initializeLocationSetting, loadLoactionSettingDetails, loadTenantOffices, updateField, toggleInformationModalStatus, updateErrors, startSubmitting, stopSubmitting, startSelectLoading, stopSelectLoading } from "./LocationSetting.slice";
import { dispatchOnCall } from "../../../../state/store";
import { useEffect, useState } from "react"
import { store } from "../../../../state/store";
import { convertBackEndErrorsToValidationErrors, formatSelectInput } from "../../../../helpers/formats";
import Select from "react-select";
import { editLocationSetting, getLocationSetting } from "../../../../services/locationsettings";
import SweetAlert from "react-bootstrap-sweetalert";
import { ValidationErrorComp } from "../../../ValidationErrors/ValidationError";
import * as yup from 'yup';
import {getTenantOfficeName } from "../../../../services/tenantOfficeInfo";
import NoRecordFoundSvg from "../../../../../src/svgs/NoRecordFound.svg" 

const LocationSetting = () => {
    const { t } = useTranslation()
    const { locationSetting, tenantOffices, errors, isUpdateDisabled, displayInformationModal, submitting, selectLoading } = useStoreWithInitializer(
        ({ locationsetting }) => locationsetting,
        dispatchOnCall(initializeLocationSetting())
    );
    const [formattedOfficeList, setFormattedOfficeList] = useState<any>(null)

    useEffect(() => {
        onLoad();
    }, []);
 
    const onLoad = async () => {
        try {
            store.dispatch(startSelectLoading()) 
            const TenantLocations = await getTenantOfficeName();
            setFormattedOfficeList(formatSelectInput(TenantLocations.TenantOfficeName, "OfficeName", "Id"))
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopSelectLoading())
    }

    const onSelectChange = async (selectedOption: any, Name: any) => {
        var value = selectedOption.value
        const loactionSettings = await getLocationSetting(value)
        store.dispatch(loadLoactionSettingDetails(loactionSettings.unwrap().LocationSetting))
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(updateField({ name: name as keyof LocationSettingDetailsState['locationSetting'], value }));
    }

    const enableEdit = () => {
        store.dispatch(toggleUpdate())
    }

    const updateLocationSettings = async () => {

        store.dispatch(updateErrors({}));
        try {
            await validationSchema.validate(locationSetting, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        store.dispatch(startSubmitting())
        const result = await editLocationSetting(locationSetting)
        result.match({
            ok: () => {
                store.dispatch(toggleInformationModalStatus());
            },
            err: (e) => {
                const errorMessages = convertBackEndErrorsToValidationErrors(e)
                store.dispatch(updateErrors(errorMessages));
            },
        });
        store.dispatch(stopSubmitting())
    }

    const InformationModal = () => {
        const { t } = useTranslation();
        return (
            <SweetAlert success title="Success" onConfirm={loadUpdatedLocationSettings}>
                {t('location_setting_update_success_message')}
            </SweetAlert>
        );
    }

    const loadUpdatedLocationSettings = async () => {
        store.dispatch(toggleInformationModalStatus());
        const loactionSettings = await getLocationSetting(locationSetting.LocationId)
        store.dispatch(loadLoactionSettingDetails(loactionSettings.unwrap().LocationSetting))
        store.dispatch(toggleUpdate())
    }

    const validationSchema = yup.object().shape({
        LocationId: yup.number().positive(('validation_error_location_setting_locationid_required') ?? ''),
        LastAmcInvoiceNumber: yup.number().typeError(t('validation_error_location_setting_lastamcinvoicenum_required') ?? ''),
        LastPaidJobInvoiceNumber: yup.number().typeError(t('validation_error_location_setting_lastpaidjobinvoicenum_required') ?? ''),
        LastContractNumber: yup.number().typeError(t('validation_error_location_setting_lastcontractnum_required') ?? ''),
        LastReceiptNumber: yup.number().typeError(t('validation_error_location_setting_lastreceiptnum_required') ?? ''),
        LastSaleInvoiceNumber: yup.number().typeError(t('validation_error_location_setting_lastsaleinvoicenum_required') ?? ''),
        LastWorkOrderNumber: yup.number().typeError(t('validation_error_location_setting_lastworkordernum_required') ?? ''),
    });

    return (
        <>
            <div className="row " id="location-setting">
                <div className="col ">
                    <h5 className="px-0 pt-0 ">{t('location_setting_view_title')}</h5>
                </div>
                {/* help text */}
                <div className="small">
                    {t('location_setting_view_helper_text')}
                </div>
                {/* help text ends */}
            </div>

            {/* TODO: errors are not needed as long as edit option is there */}
            {errors?.length && (<ValidationErrorComp errors={errors} />)}

            {/* choose tenant office location */}
            <div className="row pt-2" >
                <div className="col ">
                    <Select
                        options={formattedOfficeList}
                        onChange={(selectedOption) => onSelectChange(selectedOption, "Id")}
                        isSearchable
                        name="LocationId"
                        isLoading={selectLoading}
                        placeholder={t('location_setting_view_select_office_placeholder')}
                    />
                    <div className="small text-danger"> {t(errors['LocationId'])}</div>
                </div>
            </div>
            {/* choose tenant office location ends */}

            { locationSetting.Id > 0 && (
            <>
                {/* row start */}
                <div className="row">
                    <div className='col-md-6'>
                        <label className="mt-2 text-muted small pt-2">{t('location_setting_view_input_lastcontractnumber')}</label>
                        <input name='LastContractNumber'
                            value={locationSetting.LastContractNumber}
                            disabled={isUpdateDisabled}
                            className={`form-control py-1 ${errors["LastContractNumber"] ? "is-invalid" : ""}`}
                            onChange={onUpdateField} type='text'
                        ></input>
                    </div>
                    <div className='col-md-6'>
                        <label className="mt-2 text-muted small pt-2">{t('location_setting_view_input_lastsaleinvoicenumber')}</label>
                        <input name='LastSaleInvoiceNumber'
                            value={locationSetting.LastSaleInvoiceNumber}
                            disabled={isUpdateDisabled}
                            className={`form-control py-1 ${errors["LastSaleInvoiceNumber"] ? "is-invalid" : ""}`}
                            onChange={onUpdateField} type='text'
                        ></input>
                    </div>
                </div>
                {/* row ends */}
                {/* row start */}
                <div className="row">
                    <div className='col-md-6'>
                        <label className="mt-2 text-muted small pt-2">{t('location_setting_view_input_lastamcinvoicenumber')}</label>
                        <input name='LastAmcInvoiceNumber'
                            value={locationSetting.LastAmcInvoiceNumber}
                            disabled={isUpdateDisabled}
                            className={`form-control py-1  ${errors["LastAmcInvoiceNumber"] ? "is-invalid" : ""}`}
                            onChange={onUpdateField} type='text'
                        ></input>
                    </div>
                    <div className='col-md-6'>
                        <label className="mt-2 text-muted small pt-2">{t('location_setting_view_input_lastpaidjobinvoicenumber')}</label>
                        <input name='LastPaidJobInvoiceNumber'
                            value={locationSetting.LastPaidJobInvoiceNumber}
                            disabled={isUpdateDisabled}
                            className={`form-control py-1  ${errors["LastPaidJobInvoiceNumber"] ? "is-invalid" : ""}`}
                            onChange={onUpdateField} type='text'
                        ></input>
                    </div>
                </div>
                {/* row ends */}
                {/* row start */}
                <div className="row">
                    <div className='col-md-6'>
                        <label className="mt-2 text-muted small pt-2">{t('location_setting_view_input_lastworkordernumber')}</label>
                        <input name='LastWorkOrderNumber'
                            value={locationSetting.LastWorkOrderNumber}
                            disabled={isUpdateDisabled}
                            className={`form-control py-1 ${errors["LastWorkOrderNumber"]
                             ? "is-invalid" : ""}`}
                            onChange={onUpdateField} type='text'
                        ></input>
                    </div>
                    <div className='col-md-6'>
                        <label className="mt-2 text-muted small pt-2">{t('location_setting_view_input_lastreceiptnumber')}</label>
                        <input name='LastReceiptNumber'
                            value={locationSetting.LastReceiptNumber}
                            disabled={isUpdateDisabled}
                            className={`form-control py-1 ${errors["LastReceiptNumber"] ? "is-invalid" : ""}`}
                            onChange={onUpdateField} type='text'
                        ></input>
                    </div>
                </div>
                {/* row ends */}
            </>
            )}

            {locationSetting.Id == 0 && (
            <div className="text-center mt-2">
                <img src={NoRecordFoundSvg} width="50" />
                <div className="small text-muted mt-1">No records found</div>
            </div>
            )}
        </>
    )
}
export default LocationSetting