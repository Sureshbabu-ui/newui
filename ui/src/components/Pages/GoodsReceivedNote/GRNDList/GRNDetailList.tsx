import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from "../../../ContainerPage/ContainerPage";
import { store } from '../../../../state/store';
import { Pagination } from "../../../Pagination/Pagination";
import { startPreloader, stopPreloader } from '../../../Preloader/Preloader.slice';
import { checkForPermission } from "../../../../helpers/permissions";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";
import { changePage, initializeGRNDList, loadGRNDList, setSearch } from "./GRNDetailList.slice";
import { getGRNDList } from "../../../../services/goodsreceivednote";
import { useParams } from "react-router-dom";

export const GoodsReceivedNoteDetailList = () => {
    const { t } = useTranslation();
    const {
        goodsreceivednotedetaillist: { grndlist, totalRows, perPage, currentPage, search },
    } = useStore(({ goodsreceivednotedetaillist, app }) => ({ goodsreceivednotedetaillist, app }));
    const { GRNId } = useParams<{ GRNId: string }>();
    useEffect(() => {
        // if (checkForPermission("")) {
        onLoad();
        // }
    }, []);

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializeGRNDList());
        try {
            const grn = await getGRNDList(GRNId, search, currentPage);
            store.dispatch(loadGRNDList(grn));
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    const onPageChange = async (index: number) => {
        store.dispatch(changePage(index));
        const result = await getGRNDList(GRNId, search, index);
        store.dispatch(loadGRNDList(result));
    }

    const filterList = async () => {
        store.dispatch(changePage(1))
        const result = await getGRNDList(GRNId, store.getState().goodsreceivednotedetaillist.search, 1);
        store.dispatch(loadGRNDList(result));
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await getGRNDList(GRNId, store.getState().goodsreceivednotedetaillist.search, store.getState().goodsreceivednotedetaillist.currentPage);
            store.dispatch(loadGRNDList(result));
        }
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_grn_list', Link: '/logistics/goodsreceivednote' },
        { Text: 'breadcrumbs_create_grndetail' }
    ];

    return (<ContainerPage>
        <>
            <BreadCrumb items={breadcrumbItems} />
            {
                grndlist.match({
                    none: () => <>{t('grn_detail_list_loading')}</>,
                    some: (grndata) => <div className="ps-3 pe-4   ">
                        <div className="mb-3 ps-1">
                            <div className="input-group">
                                <input type='search' className="form-control custom-input " value={search} placeholder={t('grn_detail_list_placeholder_search') ?? ''} onChange={addData}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            filterList();
                                        }
                                    }} />
                                <button className="btn app-primary-bg-color text-white float-end" type="button" onClick={filterList}>
                                    {t('grn_detail_list_search')}
                                </button>
                            </div>
                        </div>
                        <div className="row mt-3 ps-1">
                            {grndata.length > 0 ? (
                                <div className=" table-responsive overflow-auto">
                                    <table className="table table-bordered text-nowrap">
                                        <thead>
                                            <tr>
                                                <th scope="col">{t('grn_detail_list_slno')}</th>
                                                <th scope="col">{t('grn_detail_list_partcode')}</th>
                                                <th scope="col">{t('grn_detail_list_partname')}</th>
                                                <th scope="col">{t('grn_detail_list_hsncode')}</th>
                                                <th scope='col'>{t('grn_detail_list_serialno')}</th>
                                                <th scope='col'>{t('grn_detail_list_rate')}</th>
                                                <th scope='col'>{t('grn_detail_list_oem')}</th>
                                                <th scope='col'>{t('grn_detail_list_transid')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {grndata.map((field, index) => (
                                                <tr className="mt-2">
                                                    <td scope='row'>{(currentPage - 1) * 10 + (index + 1)}</td>
                                                    <td>{field.grndlist.PartCode} </td>
                                                    <td>{field.grndlist.PartName}</td>
                                                    <td>{field.grndlist.HsnCode}</td>
                                                    <td>{field.grndlist.SerialNumber}</td>
                                                    <td>{field.grndlist.Rate}</td>
                                                    <td>{field.grndlist.OemPartNumber}</td>
                                                    <td>{field.grndlist.PoNumber}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="row m-0">
                                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                                    </div>
                                </div>
                            ) : (
                                    <div className="text-muted ps-3">{t('grn_detail_list_no_data')}</div>
                            )}
                        </div>
                        {/* </>
                        } */}
                    </div>
                })
            }
        </>
    </ContainerPage>)
}