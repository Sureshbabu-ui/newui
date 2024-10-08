import { t } from 'i18next';
import { useState } from 'react';
import { setAssetDetails, updateErrors } from './SmeHomeAssets.slice';
import { store } from '../../../../../state/store';
import { getAssetDetailsForSme } from '../../../../../services/assets';
import { useStore } from '../../../../../state/storeHooks';
import { Modal, Button } from 'react-bootstrap';
import * as yup from 'yup';

const SmeHomeAssets = () => {
    const {
        assetdetailsforsme: { AssetDetailsForSme, errors },
    } = useStore(({ assetdetailsforsme }) => ({ assetdetailsforsme }));

    const [serialNumber, setSerialNumber] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

    const handleInputChange = (event) => {
        setSerialNumber(event.target.value);
        setDataFetched(false);
    };

    const validationSchema = yup.object().shape({
        serialNumber: yup.string().required('sme_home_serial_no_required'),
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
            await validationSchema.validate({ serialNumber }, { abortEarly: false });
        } catch (error: any) {
            const errors = error.inner.reduce((allErrors: any, currentError: any) => {
                return { ...allErrors, [currentError.path as string]: currentError.message };
            }, {});
            store.dispatch(updateErrors(errors))
            if (errors)
                return;
        }
        try {
            const { AssetDetail } = await getAssetDetailsForSme(serialNumber);
            store.dispatch(setAssetDetails(AssetDetail));
        } catch (error) {
            return
        }
    };

    const handleViewMoreClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className='p-2'>
            <div className="row mt-2">
                <div className="input-group">
                    <input
                        type='search'
                        className={`form-control custom-input ${errors["serialNumber"] ? "is-invalid" : ""}`}
                        name='serialNumber'
                        placeholder={t("sme_home_asset_search_placeholder") as string}
                        value={serialNumber}
                        onKeyPress={handleKeyPress}
                        onChange={handleInputChange}
                    />
                    <div className="small text-danger"> {t(errors['search'])}</div>
                    <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={onSubmit}>
                        {t('sme_home_asset_search_button')}
                    </button>
                </div>
                <div className="text-danger">{t(errors['serialNumber'])}</div>
                {dataFetched == true && AssetDetailsForSme.ProductSerialNumber != "" && (
                    <>
                        <div className='mt-2'><strong>{t("sme_home_asset_label_asset_details")}</strong></div>
                        <div className="container mt-2">
                            <div className="table-container">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th scope="col">{t("sme_home_asset_table_header_asset_product_category")}</th>
                                            <th scope="col">{t("sme_home_asset_table_header_product_make")}</th>
                                            <th scope="col">{t("sme_home_asset_table_header_product_model")}</th>
                                            <th scope="col">{t("sme_home_asset_table_header_product_serial_number")}</th>
                                            <th scope="col">{t("sme_home_asset_table_header_customer_site")}</th>
                                            <th scope="col">{t("sme_home_asset_table_header_amc_value")}</th>
                                            <th scope="col">{t("sme_home_asset_table_header_actions")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>{AssetDetailsForSme.AssetProductCategory}</td>
                                            <td>{AssetDetailsForSme.Make}</td>
                                            <td>{AssetDetailsForSme.ModelName}</td>
                                            <td>{AssetDetailsForSme.ProductSerialNumber}</td>
                                            <td>{AssetDetailsForSme.CustomerSite}</td>
                                            <td>{AssetDetailsForSme.AmcValue}</td>
                                            <td>
                                                <button className="btn btn-link" onClick={handleViewMoreClick}>
                                                    <span className="material-symbols-outlined" data-toggle="tooltip" data-placement="top" title="View" >visibility</span>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("sme_home_asset_modal_label_asset_details")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>{t("sme_home_asset_modal_label_msp_asset_id")}</strong> {AssetDetailsForSme.MspAssetId}</p>
                    <p><strong>{t("sme_home_asset_modal_label_customer_asset_id")}</strong> {AssetDetailsForSme.CustomerAssetId}</p>
                    <p><strong>{t("sme_home_asset_modal_label_warranty_end_date")}</strong> {AssetDetailsForSme.WarrantyEndDate}</p>
                    <p><strong>{t("sme_home_asset_modal_label_contract_number")}</strong> {AssetDetailsForSme.ContractNumber}</p>
                    <p><strong>{t("sme_home_asset_modal_label_customer_site")}</strong> {AssetDetailsForSme.CustomerSite}</p>
                    <p><strong>{t("sme_home_asset_modal_label_resolution_time_in_hours")}</strong> {AssetDetailsForSme.ResolutionTimeInHours}</p>
                    <p><strong>{t("sme_home_asset_modal_label_response_time_in_hours")}</strong> {AssetDetailsForSme.ResponseTimeInHours}</p>
                    <p><strong>{t("sme_home_asset_modal_label_standbytime_in_hours")}</strong> {AssetDetailsForSme.StandByTimeInHours}</p>
                    <p><strong>{t("sme_home_asset_modal_label_out_sourcing_needed")}</strong> {AssetDetailsForSme.IsOutSourcingNeeded ? "Yes" : "No"}</p>
                    <p><strong>{t("sme_home_asset_modal_label_preamc_completed")}</strong> {AssetDetailsForSme.IsPreAmcCompleted ? "Yes" : "No"}</p>
                    <p><strong>{t("sme_home_asset_modal_label_amc_start_date")}</strong> {AssetDetailsForSme.AmcStartDate}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        {t("sme_home_asset_modal_close_button")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SmeHomeAssets;
