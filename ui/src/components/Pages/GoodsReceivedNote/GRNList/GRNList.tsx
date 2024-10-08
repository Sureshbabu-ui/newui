import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from "../../../ContainerPage/ContainerPage";
import { store } from '../../../../state/store';
import { Pagination } from "../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { checkForPermission } from "../../../../helpers/permissions";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";
import { changePage, initializeGRNList, loadGRNList, setSearch } from "./GRNList.slice";
import { getGRNList } from "../../../../services/goodsreceivednote";
import { formatDate, formatDateTime } from "../../../../helpers/formats";
import { Link } from "react-router-dom";

export const GoodsReceivedNoteList = () => {
    const { t } = useTranslation();
    const {
        goodsreceivednotelist: { grnlist, totalRows, perPage, currentPage, search },
    } = useStore(({ goodsreceivednotelist, app }) => ({ goodsreceivednotelist, app }));

    useEffect(() => {
        if (checkForPermission("GOODSRECEIVEDNOTE_VIEW")) {
            onLoad();
        }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeGRNList());
        try {
            const grn = await getGRNList(search, currentPage);
            store.dispatch(loadGRNList(grn));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getGRNList(search, index);
        store.dispatch(loadGRNList(result));
    }

    const filterList = async () => {
        store.dispatch(changePage(1))
        const result = await getGRNList(store.getState().goodsreceivednotelist.search, 1);
        store.dispatch(loadGRNList(result));
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getGRNList(store.getState().goodsreceivednotelist.search, store.getState().goodsreceivednotelist.currentPage);
            store.dispatch(loadGRNList(result));
        }
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_grn_list' }
    ];

    return (<ContainerPage>
        <>
            <BreadCrumb items={breadcrumbItems} />
            {checkForPermission("GOODSRECEIVEDNOTE_VIEW") &&
                grnlist.match({
                    none: () => <div className="mx-2">{t('grn_list_loading')}</div>,
                    some: (grndata) => <div className="ps-3 pe-4   ">
                        {checkForPermission("GOODSRECEIVEDNOTE_CREATE") &&
                            <div className="row mt-1 mb-3 p-0 ">
                                <div className="float-end ">
                                    <a className='pseudo-href app-primary-color' href={"/logistics/goodsreceivednote/create"}>
                                        <button className='btn app-primary-bg-color text-white float-end'>{t('grn_list_button')} </button>
                                    </a>
                                </div>
                            </div>
                        }
                        <div className="mb-3 ps-1">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input " value={search} placeholder={t('grn_list_placeholder_search') ?? ''} onChange={addData}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterList();
                                        }
                                    }} />
                                <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={filterList}>
                                    {t('grn_list_search')}
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 ps-1">
                            {grndata.length > 0 ? (
                                <div className=" table-responsive overflow-auto">
                                    <table className="table table-bordered text-nowrap">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th scope="col">{t('grn_list_th_sl_no')}</th>
                                                <th scope='col'>{t('grn_list_th_isprocessed')}</th>
                                                <th scope="col">{t('grn_list_th_grnno')}</th>
                                                <th scope="col">{t('grn_list_th_grndate')}</th>
                                                <th scope="col">{t('grn_list_th_refno')}</th>
                                                <th scope="col">{t('grn_list_th_refdate')}</th>
                                                <th scope="col">{t('grn_list_th_tansactiontype')}</th>
                                                <th scope="col">{t('grn_list_th_transactionid')}</th>
                                                <th scope='col'>{t('grn_list_th_source')}</th>
                                                <th scope='col'>{t('grn_list_th_receivedby')}</th>
                                                <th scope='col border'>{t('grn_list_th_receivedlocation')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {grndata.map((field, index) => (
                                                <tr className="mt-2">
                                                    <td>
                                                        {field.grnlist.IsProcessed == true ? (
                                                            <Link className="pseudo-href app-primary-color" to={`/logistics/goodsreceivednote/detail/${field.grnlist.Id}`}>
                                                                <span className="material-symbols-outlined">
                                                                    visibility
                                                                </span>
                                                            </Link>
                                                        ) : (
                                                            <Link className="pseudo-href app-primary-color" to={`/logistics/goodsreceivednotedetail/create/${field.grnlist.Id}`}>
                                                                <span className="material-symbols-outlined">
                                                                    visibility
                                                                </span>
                                                            </Link>
                                                        )}
                                                    </td>
                                                    <th scope='row'>{(currentPage - 1) * 10 + (index + 1)}</th>
                                                    <td>{field.grnlist.IsProcessed == true ? <span className="badge bg-success me-2">{t('grn_list_processed')}</span> : <span className="badge bg-secondary me-2">{t('grn_list_unprocessed')}</span>}</td>
                                                    <td>{field.grnlist.GrnNumber} </td>
                                                    <td>{formatDateTime(field.grnlist.GrnDate)} </td>
                                                    <td>{field.grnlist.ReferenceNumber}</td>
                                                    <td>{formatDate(field.grnlist.ReferenceDate)}</td>
                                                    <td>{field.grnlist.TransactionType}</td>
                                                    {
                                                        field.grnlist.TransactionTypeCode == "GTT_DCHN" ? (
                                                            <td>{field.grnlist.DCNumber}</td>
                                                        ) : field.grnlist.TransactionTypeCode == "GTT_PORD" ? (
                                                            <td>{field.grnlist.PoNumber}</td>
                                                        ) : field.grnlist.TransactionTypeCode == "GTT_EPRT" && (
                                                            <td></td>
                                                        )
                                                    }
                                                    {
                                                        field.grnlist.TransactionTypeCode == "GTT_DCHN" ? (
                                                            <td>{field.grnlist.SourceLocation}</td>
                                                        ) : field.grnlist.TransactionTypeCode == "GTT_PORD" ? (
                                                            <td>{field.grnlist.SourceVendor}</td>
                                                        ) : field.grnlist.TransactionTypeCode == "GTT_EPRT" &&
                                                        <td>{field.grnlist.SourceEngineer}</td>
                                                    }
                                                    <td> {field.grnlist.ReceivedBy}</td>
                                                    <td>{field.grnlist.ReceivedLocation}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row m-0">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted ps-3">{t('grn_list_no_data')}</div>
                            )}
                        </div>

                    </div>
                })
            }
        </>
    </ContainerPage >)
}