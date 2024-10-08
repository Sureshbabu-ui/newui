import { useTranslation } from "react-i18next";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb"
import { useStore } from "../../../../state/storeHooks";
import { store } from "../../../../state/store";
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { gstTaxRateList, loadGstTaxRate, setSearch } from "./GstList.slice";
import { getGstTaxRateList } from "../../../../services/GstTaxRate";
import { useEffect } from "react";
import { checkForPermission } from "../../../../helpers/permissions";
import { Link } from "react-router-dom";
import GstTaxView from "./GST Tax View/GstTaxView";
import { loadGstDetails } from "./GST Tax View/GstTaxView.slice";
import { GstTaxRateEdit } from "../../../../types/GstTaxRate";
import { loadGstEditDetails } from "./GST Tax Edit/GstTaxEdit.slice";
import GstTaxEdit from "./GST Tax Edit/GstTaxEdit";

const GstList = () => {
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_gst_tax_rate', }
    ];
    const { t, i18n } = useTranslation();

    const {
        gsttaxratelist: { gsttaxrate, search },
    } = useStore(({ gsttaxratelist, app }) => ({ gsttaxratelist, app }));

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(gstTaxRateList());
        try {
            const result = await getGstTaxRateList(search);
            store.dispatch(loadGstTaxRate(result));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }
    useEffect(() => {
        onLoad();
    }, []);

    async function filterGstTaxRateList(e) {
        const result = await getGstTaxRateList(store.getState().gsttaxratelist.search)
        store.dispatch(loadGstTaxRate(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            const result = await getGstTaxRateList(store.getState().gsttaxratelist.search);
            store.dispatch(loadGstTaxRate(result));
        }
    }
    const redirectToViewDetails = async (details) => {
        try {
            store.dispatch(loadGstDetails(details));
        } catch (error) {
            console.error(error);
        }
    }

    const loadClickedGstDetails = (gstEditDetails: GstTaxRateEdit) => {        
        store.dispatch(loadGstEditDetails(gstEditDetails))
    }

    return (
        <>
            <BreadCrumb items={breadcrumbItems} />
            {checkForPermission("GSTRATE_VIEW") && gsttaxrate.match({
                none: () => <>{t('gst_tax_rate_loading')}</>,
                some: (GstTaxRate) => (
                    <div className="ps-3 pe-4">
                        <div className="mb-3 ps-1 mt-5">
                            <div className="input-group">
                                <input
                                    type="search"
                                    className="form-control custom-input"
                                    value={search}
                                    placeholder={t('gst_tax_rate_search_placeholder') ?? ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterGstTaxRateList(e);
                                        }
                                    }}
                                    onChange={addData}
                                />
                                <button
                                    className="btn app-primary-bg-color text-white float-end"
                                    type="button"
                                    onClick={filterGstTaxRateList}>
                                    {t('gst_tax_rate_search_text')}
                                </button>
                            </div>
                        </div>

                        <div className="row mt-3 ps-2">
                            {GstTaxRate.length > 0 ? (
                                <div className="ps-2 pe-1 table-responsive">
                                    <table className="table table-hover table-bordered text-nowrap">
                                        <thead>
                                            <tr>
                                                <th scope="col">{t('gst_tax_rate_table_id')}</th>
                                                <th scope="col">{t('gst_tax_rate_table_service_code')}</th>
                                                <th scope="col">{t('gst_tax_rate_table_service_name')}</th>
                                                <th scope="col">{t('gst_tax_rate_table_service_account_code')}</th>
                                                <th scope="col">{t('gst_tax_rate_table_service_account_description')}</th>
                                                <th scope="col">{t('gst_tax_rate_table_cgst')}</th>
                                                <th scope="col">{t('gst_tax_rate_table_sgst')}</th>
                                                <th scope="col">{t('gst_tax_rate_table_igst')}</th>
                                                <th scope="col">{t('gst_tax_rate_table_isactive')}</th>
                                                <td></td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {GstTaxRate.map((field, index) => {
                                                const truncateDescription = (description) => {
                                                    const words = description.split(' ');
                                                    return words.length > 4 ? words.slice(0, 4).join(' ') + '...' : description;
                                                };

                                                return (
                                                    <tr key={index} className="mt-2">
                                                        <td>{field.gsttaxrate.Id}</td>
                                                        <td>{field.gsttaxrate.TenantServiceCode}</td>
                                                        <td>{field.gsttaxrate.TenantServiceName}</td>
                                                        <td>{field.gsttaxrate.ServiceAccountCode}</td>
                                                        <td>{truncateDescription(field.gsttaxrate.ServiceAccountDescription)}</td>
                                                        <td>{field.gsttaxrate.Cgst}</td>
                                                        <td>{field.gsttaxrate.Sgst}</td>
                                                        <td>{field.gsttaxrate.Igst}</td>
                                                        <td>
                                                            <span className={`badge text-bg-${field.gsttaxrate.IsActive ? "success" : "warning"}`}>
                                                                {field.gsttaxrate.IsActive ? "Active" : "Inactive"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <Link
                                                                className='pseudo-href app-primary-color me-2'
                                                                to={''}
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModal"
                                                                onClick={() => redirectToViewDetails(field.gsttaxrate)}
                                                            >
                                                                <span className="material-symbols-outlined text-size-20">visibility</span>
                                                            </Link>
                                                            <a
                                                                className="pseudo-href app-primary-color"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#EditGst"
                                                                title="Edit"
                                                                onClick={() => loadClickedGstDetails({ IsActive: field.gsttaxrate.IsActive, TenantServiceName: field.gsttaxrate.TenantServiceName, ServiceAccountDescription: field.gsttaxrate.ServiceAccountDescription,Cgst:field.gsttaxrate.Cgst,Sgst:field.gsttaxrate.Sgst,Igst:field.gsttaxrate.Igst,Id:field.gsttaxrate.Id })}
                                                            >
                                                                <span className="material-symbols-outlined">
                                                                    edit_note
                                                                </span>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('gst_tax_rate_no_data')}</div>
                            )}
                        </div>
                    </div>
                ),
            })}
<GstTaxEdit></GstTaxEdit>
            <GstTaxView />
        </>

    )
}
export default GstList