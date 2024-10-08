
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { store } from '../../../../../state/store';
import { Pagination } from "../../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatDate } from "../../../../../helpers/formats";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { changePage, initializeDeliveryChallanList, loadDeliveryChallanList, setSearch } from "./DeliveryChallans.slice";
import { getAllDeliveryChallans } from "../../../../../services/deliverychallan";

export const DeliveryChallans = () => {
    const { t } = useTranslation();
    const {
        deliverychallans: { dclist, totalRows, perPage, currentPage, search },
    } = useStore(({ deliverychallans, app }) => ({ deliverychallans, app }));

    useEffect(() => {
        if (checkForPermission("DELIVERYCHALLAN_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeDeliveryChallanList());
        try {
            const DeliveryChallans = await getAllDeliveryChallans(search, currentPage);
            store.dispatch(loadDeliveryChallanList(DeliveryChallans));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getAllDeliveryChallans(search, index);
        store.dispatch(loadDeliveryChallanList(result));
    }

    const filterDC = async (event: any) => {
        store.dispatch(changePage(1))
        const result = await getAllDeliveryChallans(store.getState().deliverychallans.search, 1);
        store.dispatch(loadDeliveryChallanList(result));
    }
    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getAllDeliveryChallans(store.getState().deliverychallans.search, store.getState().deliverychallans.currentPage);
            store.dispatch(loadDeliveryChallanList(result));
        }
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_delivery_challans' }
    ];

    return (<ContainerPage>
        <>
            <BreadCrumb items={breadcrumbItems} />
            {checkForPermission("DELIVERYCHALLAN_VIEW") && dclist.match({
                none: () => <div className="row mt-4 ps-5">{t('deliverychallan_list_loadng_message')}</div>,
                some: (DC) => <div className="ps-3 pe-4    mt-3">
                    <div className="mb-3 ps-1">
                        <div className="input-group ">
                            <input type='search' className="form-control custom-input" value={search} placeholder={t('deliverychallan_list_search_placeholder') ?? ''} onChange={addData}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        filterDC(e);
                                    }
                                }} />
                            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterDC}>
                                {t('deliverychallan_list_search')}
                            </button>
                        </div>
                    </div>
                    <div className="row mt-3 ps-1">
                        {DC.length > 0 ? (
                            <div className=" table-responsive ">
                                <table className="table table-bordered ">
                                    <thead>
                                        <tr className="border mt-1 mb-1">
                                            <th className="col-auto"></th>
                                            <th scope="col">#</th>
                                            <th scope="col">{t('deliverychallan_list_dc_no')}</th>
                                            <th scope="col">{t('deliverychallan_list_dc_date')}</th>
                                            <th scope="col">{t('deliverychallan_list_dc_type')}</th>
                                            <th scope="col">{t('deliverychallan_list_issued_employee')}</th>
                                            <th scope="col">{t('deliverychallan_list_source_location')}</th>
                                            <th scope="col">{t('deliverychallan_list_destination')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {DC.map((field, index) => (
                                            <tr className="mt-2">
                                                <td className="col-auto"><a className="pseudo-href app-primary-color" href={`/logistics/deliverychallans/detail/${field.Id}`} data-toggle="tooltip" data-placement="left" title={'View'} >
                                                    <span className="material-symbols-outlined">
                                                        visibility
                                                    </span>
                                                </a></td>
                                                <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                                                <td>{field.DcNumber}</td>
                                                <td>{formatDate(field.DcDate)}</td>
                                                <td>{field.DcType}</td>
                                                <td>{field.IssuedEmployee}</td>
                                                <td>{field.SourceTenantOffice}</td>
                                                {field.DcTypeCode == "DCN_VNDR" ? (
                                                    <td>{field.DestinationVendor}</td>
                                                ) : field.DcTypeCode == "DCN_ITRN" ? (
                                                    <td>{field.DestinationTenantOffice}</td>
                                                ) : field.DcTypeCode == "DCN_ENGR" &&
                                                <td>{field.DestinationEmployee}</td>}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="row m-0">
                                    <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                </div>
                            </div>
                        ) : (
                            <div className="text-muted row m-0">{t('deliverychallan_list_no_records')}</div>
                        )}
                    </div>
                </div>
            })}
        </>
    </ContainerPage>)
}
