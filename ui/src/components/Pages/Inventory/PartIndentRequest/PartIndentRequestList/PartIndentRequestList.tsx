import { store } from '../../../../../state/store';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { useStore } from '../../../../../state/storeHooks';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { approvalPartIndentList } from '../../../../../services/partIndent';
import { changePage, initializePartIndent, loadPartIndent, setAssetProductCategoryId, setSearch } from './PartIndentRequestList.slice';
import { formatDateTime, formatSelectInput } from '../../../../../helpers/formats';
import BreadCrumb from '../../../../BreadCrumbs/BreadCrumb';
import { Pagination } from '../../../../Pagination/Pagination';
import { checkForPermission } from '../../../../../helpers/permissions';
import { useEffect, useState } from 'react';
import { PartIndentReview } from '../PartIndentReview/PartIndentReview';
import FeatherIcon from 'feather-icons-react';
import { Link } from 'react-router-dom';
import { getAssetProductCategoryNames } from '../../../../../services/assetProductCategory';
import Select from 'react-select';

const PartIndentRequestList = () => {
    const { t } = useTranslation();

    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_manage_partindent_requests' }
        ];
    }
    const { partindent, currentPage, search, totalRows, perPage, AssetProductCategoryId } = useStore(
        ({ partindentrequestlist }) => partindentrequestlist
    );
    const [productCategoryList, setProductCategoryList] = useState<any>(null)

    const onLoad = async () => {
        store.dispatch(startPreloader())
        store.dispatch(initializePartIndent());
        try {
            const currentPage = store.getState().customerlist.currentPage;
            const searchKey = store.getState().customerlist.search;
            const result = await approvalPartIndentList(currentPage, searchKey, store.getState().partindentrequestlist.AssetProductCategoryId);
            store.dispatch(loadPartIndent(result));

            const { AssetProductCategoryNames } = await getAssetProductCategoryNames()
            const ProductCategoryList = formatSelectInput(AssetProductCategoryNames, "CategoryName", "Id")
            const filteredData = [{ label: "All", value: '' }, ...ProductCategoryList];
            setProductCategoryList(filteredData)
        } catch (error) {
            console.error(error);
        }
        store.dispatch(stopPreloader())
    }

    useEffect(() => {
        onLoad();
    }, []);

    useEffect(() => {
        const getAssetProductCategory = async () => {
            const result = await approvalPartIndentList(store.getState().partindentrequestlist.currentPage, store.getState().partindentrequestlist.search, store.getState().partindentrequestlist.AssetProductCategoryId);
            store.dispatch(loadPartIndent(result));
        }
        getAssetProductCategory()
    }, [AssetProductCategoryId]);

    async function onPageChange(index: number) {
        store.dispatch(changePage(index));
        const result = await approvalPartIndentList(index, search, AssetProductCategoryId);
        store.dispatch(loadPartIndent(result));
    }

    const addData = async (event: any) => {
        store.dispatch(setSearch(event.target.value));
        if (event.target.value == "") {
            store.dispatch(changePage(1))
            const result = await approvalPartIndentList(store.getState().partindentrequestlist.currentPage, store.getState().partindentrequestlist.search, store.getState().partindentrequestlist.AssetProductCategoryId);
            store.dispatch(loadPartIndent(result));
        }
    }
    async function filterPartIndentRequests(event: any) {
        store.dispatch(changePage(1))
        const requests = await approvalPartIndentList(1, search, AssetProductCategoryId);
        store.dispatch(loadPartIndent(requests));
    }

    async function onSelectChange(selectedOption: any, Name: any) {
        var value = selectedOption.value
        var name = Name
        store.dispatch(setAssetProductCategoryId(value));
    }

    return (
        <ContainerPage>
            <BreadCrumb items={breadcrumbItems()} />
            {checkForPermission('PARTINDENT_APPROVAL') ?
                <div className='my-2'>
                    {partindent.match({
                        none: () => <>{t('partindent_list_th_loading')}</>,
                        some: (partindent) => (
                            <div className="row mt-1 m-0 ps-0">
                                <div className="row pe-0">
                                    {/* Product category */}
                                    <label className="red-asterisk">{t('partindentlist_label_filerby')}</label>
                                    <div className='col-md-4'>
                                        <Select
                                            value={productCategoryList && productCategoryList.find(option => option.value == AssetProductCategoryId) || null}
                                            options={productCategoryList}
                                            onChange={(selectedOption) => onSelectChange(selectedOption, "AssetProductCategoryId")}
                                            isSearchable
                                            name="ProductCategoryId"
                                            placeholder={t('partindentlist_placeholder_select_option')}
                                        />
                                    </div>
                                    <div className="col-md-8 pe-0 ">
                                        <div className="input-group">
                                            <input type='search' className="form-control custom-input" value={search} placeholder={t('smeapproval_partindent_list_search_placeholder') ?? ''} onChange={addData}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        filterPartIndentRequests(e);
                                                    }
                                                }} />
                                            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterPartIndentRequests}>
                                                {t('partindentrequestlist_btn_search')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {partindent.length > 0 ? (
                                    <div className="">
                                        <table className="table table-bordered text-nowrap mt-2">
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th scope="col">{t('partindent_label_indentnum')}</th>
                                                    <th scope="col">{t('partindent_label_requestdate')}</th>
                                                    <th scope="col">{t('partindent_label_engname')}</th>
                                                    <th scope="col">{t('partindent_label_location')}</th>
                                                    <th scope="col">{t('partindent_label_assetproductcategory')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {partindent.map(({ partindent }, index) => (
                                                    <tr key={index}>
                                                        <td className='text-center'>
                                                            <Link
                                                                to={`/logistics/partindentrequests/view/${partindent.Id}`}
                                                                className='pseudo-href app-primary-color'
                                                                data-toggle="tooltip" data-placement="left" title={'View'}
                                                            >
                                                                <FeatherIcon icon={"eye"} size="16" />
                                                            </Link>
                                                        </td>
                                                        <td>{partindent.IndentRequestNumber}</td>
                                                        <td>{formatDateTime(partindent.CreatedOn)}</td>
                                                        <td>{partindent.RequestedBy}</td>
                                                        <td>{partindent.Location}</td>
                                                        <td>{partindent.CategoryName}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-muted ps-0 mt-2 ms-2">{t('partindentlist_th_norecords')}</div>
                                )}
                            </div>
                        ),
                    })}
                    {/* Pagination */}
                    <div className='row m-0'>
                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                    </div>
                    {/* Pagination ends */}
                    <PartIndentReview />
                </div>
                :
                <></>
            }
        </ContainerPage>
    );
}

export default PartIndentRequestList
