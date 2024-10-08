import { t } from "i18next";
import { getPartDetailsForSme } from "../../../../../services/partStock";
import { useStore } from "../../../../../state/storeHooks";
import { useState } from "react";
import { store } from "../../../../../state/store";
import { setPartDetails, updateErrors } from "./SmeHomeParts.slice";
import * as yup from 'yup';

const SmeHomeParts = () => {
    const {
        partdetailsforsme: { PartDetailsForSme, errors },
    } = useStore(({ partdetailsforsme }) => ({ partdetailsforsme }));

    const [barcode, setBarcode] = useState('');
    const [dataFetched, setDataFetched] = useState(false);

    const handleInputChange = (event) => {
        setBarcode(event.target.value);
        setDataFetched(false);
    };

    const validationSchema = yup.object().shape({
        barcode: yup.string().required('validation_error_barcode_required'),
    });

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSubmit();
        }
    };

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        setDataFetched(true);
        try {
            await validationSchema.validate({ barcode }, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        try {
            const { PartDetail } = await getPartDetailsForSme(barcode);
            store.dispatch(setPartDetails(PartDetail));
        } catch (error) {
            return;
        }
    };

    return (
        <div className='p-2'>
            <div className="row mt-2 ">
                <div className="input-group">
                    <input
                        type='search'
                        className={`form-control custom-input ${errors["barcode"] ? "is-invalid" : ""}`}
                        name='barcode'
                        placeholder={t("sme_home_parts_search_placeholder") as string}
                        value={barcode}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={onSubmit}>
                        {t('sme_home_asset_search_button')}
                    </button>
                </div>
                <div className="text-danger">{t(errors['barcode'])}</div>
            </div>
            {dataFetched == true && PartDetailsForSme.Barcode == '' && (
                <div className="mt-2 px-1">
                    {t('sme_home_part_search_no_records_available')}
                </div>
            )}

            {dataFetched==true && PartDetailsForSme.Barcode != "" && (
                <div className="row mt-3 bg-light mx-1">
                    <div className="bold fs-5 pb-2" ><strong>Part Details</strong></div>
                    <div className="col-12 ">
                        <div className="row">
                            <div className="col-6">
                                <p><strong>{t('Tenant Office')}:</strong> {PartDetailsForSme.TenantOffice}</p>
                                <p><strong>{t('Barcode')}:</strong> {PartDetailsForSme.Barcode}</p>
                                <p><strong>{t('Part Code')}:</strong> {PartDetailsForSme.PartCode}</p>
                                <p><strong>{t('Part Type')}:</strong> {PartDetailsForSme.PartType}</p>
                                <p><strong>{t('Description')}:</strong> {PartDetailsForSme.Description}</p>
                                <p><strong>{t('Part Value')}:</strong> {PartDetailsForSme.PartValue}</p>
                                <p><strong>{t('Warranty Period')}:</strong> {PartDetailsForSme.WarrantyPeriod}</p>
                                <p><strong>{t('Part Warranty Expiry Date')}:</strong> {PartDetailsForSme.PartWarrantyExpiryDate}</p>
                            </div>
                            <div className="col-6">
                                <p><strong>{t('Vendor')}:</strong> {PartDetailsForSme.Vendor}</p>
                                <p><strong>{t('GRN Number')}:</strong> {PartDetailsForSme.GrnNumber}</p>
                                <p><strong>{t('Demand Number')}:</strong> {PartDetailsForSme.DemandNumber}</p>
                                <p><strong>{t('PO Number')}:</strong> {PartDetailsForSme.PoNumber}</p>
                                <p><strong>{t('PO Date')}:</strong> {PartDetailsForSme.PoDate}</p>
                                <p><strong>{t('Work Order Number')}:</strong> {PartDetailsForSme.WorkOrderNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SmeHomeParts;
