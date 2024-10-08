import { useTranslation } from "react-i18next";
import { ValidationErrorComp } from "../../../../ValidationErrors/ValidationError";
import { AssetFilterState, loadTenantRegions, loadTenantlocations, loadUserDetail, loadProductCategoryName, toggleInformationModalStatus, updateErrors, updateField, initializeFilter } from "./AssetFilter.slice";
import { store } from "../../../../../state/store";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { useStore } from '../../../../../state/storeHooks';
import { useEffect, useRef } from "react";
import { formatSelectInput } from "../../../../../helpers/formats";
import Select from 'react-select';
import { getRegionAndCategoryWiseWiseTenantOfficeList } from "../../../../../services/tenantOfficeInfo";
import { getUserLocationInfo } from "../../../../../services/users";
import { getCategoryWiseTenantRegionNames } from "../../../../../services/tenantRegion";
import { getAssetList } from "../../../../../services/assets";
import { loadAssets } from "../AssetsList.slice";
import { useParams } from "react-router-dom";
import { getAssetProductCategoryNames } from "../../../../../services/assetProductCategory";

export const AssetListFilter = () => {
    const { t } = useTranslation();
    const MODAL_NAME = "AssetFilters"
    const modalRef = useRef<HTMLButtonElement>(null);
    const { assetfilters: { TenantOfficeInfo, AssetFilters, loggeduserinfo, TenantRegion, errors, AssetProductCategory }, assetslist: { visibleModal } } = useStore(({ assetfilters, assetslist }) => ({ assetfilters, assetslist }));
    const { ContractId } = useParams<{ ContractId: string }>();

    useEffect(() => {
        const fetchData = async () => {
            if (AssetFilters.TenantRegionId && visibleModal == MODAL_NAME) {
                const TenantLocations = await getRegionAndCategoryWiseWiseTenantOfficeList(AssetFilters.TenantRegionId.toString());
                const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
                const filterLocations = [{ label: "All", value: "" }, ...TenantLocation];
                store.dispatch(loadTenantlocations({ Select: filterLocations }));
            }
        };
        fetchData();
    }, [AssetFilters.TenantRegionId && visibleModal == MODAL_NAME]);

    useEffect(() => {
        const fetchUserData = async () => {
            const info = await getUserLocationInfo()
            store.dispatch(loadUserDetail(info.userLocationInfo));
        };
        visibleModal == MODAL_NAME && fetchUserData();
    }, []);

    useEffect(() => {
        const fetchRegions = async () => {
            const TenantRegion = await getCategoryWiseTenantRegionNames();
            const regions = await formatSelectInput(TenantRegion.RegionNames, "RegionName", "Id");
            const filteredRegions = [{ label: "All", value: null }, ...regions];
            store.dispatch(loadTenantRegions({ Select: filteredRegions }));
        };
        visibleModal == MODAL_NAME && fetchRegions();
    }, [loggeduserinfo && visibleModal == MODAL_NAME]);

    const PreAmcStatus = [{ label: "All", value: null }, { label: "PreAmc Done", value: true }, { label: "Pre AMC Pending", value: false }]

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        const value = selectedOption.value;
        store.dispatch(updateField({ name: name as keyof AssetFilterState['AssetFilters'], value }));
    }

    const onSubmit = async () => {
        store.dispatch(updateErrors({}))
        store.dispatch(startPreloader());
        try {
            GetMasterDataItems()
            var result = await getAssetList("", 1, ContractId, store.getState().assetfilters.AssetFilters);
            store.dispatch(loadAssets(result));
            document.getElementById('closeAssetFiltersModal')?.click();
        } catch (error) {
            console.log(error);
        }
        store.dispatch(stopPreloader());
    }

    const onModalClose = () => {
        store.dispatch(initializeFilter())
        document.getElementById('closeAssetFiltersModal')?.click();
    }

    async function GetMasterDataItems() {
        try {
            if (visibleModal == MODAL_NAME) {
                var { AssetProductCategoryNames } = await getAssetProductCategoryNames()
                const ProductCategoryName = await formatSelectInput(AssetProductCategoryNames, "CategoryName", "Id")
                store.dispatch(loadProductCategoryName({ Select: ProductCategoryName }));
            }
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        GetMasterDataItems()
    }, [visibleModal == MODAL_NAME])

    const AssetProductCategoryFn = async () => {
        var result = await getAssetList("", 1, ContractId, store.getState().assetfilters.AssetFilters);
        store.dispatch(loadAssets(result));
    }

    useEffect(() => {
        visibleModal == MODAL_NAME && AssetProductCategoryFn()
    }, [AssetFilters.AssetProductCategoryId])

    return (
        <>
            <div
                className="modal fade"
                id='AssetFilters'
                data-bs-backdrop='static'
                data-bs-keyboard='false'
                aria-hidden='true'
            >
                <div className="modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header mx-2">
                            <h5 className="modal-title">{t('contract_assetfilter_title')}</h5>
                            <button
                                type='button'
                                className="btn-close"
                                data-bs-dismiss='modal'
                                id='closeAssetFiltersModal'
                                aria-label='Close'
                                onClick={onModalClose}
                                ref={modalRef}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className='container-fluid'>
                                <ValidationErrorComp errors={errors} />
                                <div className=''>
                                    <div className='row mb-1'>
                                        <div className="col-md-12">
                                            <label className='text-size-13'>{t('contract_assetfilter_preamcstatus_label')}</label>
                                            <div className="">
                                                <Select
                                                    options={PreAmcStatus}
                                                    value={PreAmcStatus && PreAmcStatus.find(option => option.value == AssetFilters.PreAmcStatus) || null}
                                                    isSearchable
                                                    onChange={onFieldChangeSelect}
                                                    name='PreAmcStatus'
                                                    placeholder={t('contract_assetfilter_preamcstatus_placeholder')}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label className='text-size-13'>{t('contract_assetfilter_tenant_region_label')}</label>
                                            <div className="">
                                                <Select
                                                    options={TenantRegion}
                                                    value={TenantRegion && TenantRegion.find(option => option.value == AssetFilters.TenantRegionId) || null}
                                                    isSearchable
                                                    onChange={onFieldChangeSelect}
                                                    name='TenantRegionId'
                                                    placeholder={t('contract_assetfilter_placeholder_tenant_region')}
                                                />
                                            </div>
                                        </div>
                                        <div className=" mt-2">
                                            <label className='text-size-13'>{t('contract_assetfilter_placeholder_tenant_location')}</label>
                                            <div className="">
                                                <Select
                                                    options={TenantOfficeInfo}
                                                    value={TenantOfficeInfo && TenantOfficeInfo.find(option => option.value == AssetFilters.TenantOfficeId) || null}
                                                    isSearchable
                                                    onChange={onFieldChangeSelect}
                                                    name='TenantOfficeId'
                                                    placeholder={t('contract_assetfilter_placeholder_tenant_location')}
                                                />
                                            </div>
                                        </div>

                                        <div className=" mt-2">
                                            <label className='text-size-13'>{t('contract_assetfilter_placeholder_product_category_name')}</label>
                                            <div className="">
                                                <Select
                                                    options={AssetProductCategory}
                                                    value={AssetProductCategory && AssetProductCategory.find(option => option.value == AssetFilters.AssetProductCategoryId) || null}
                                                    isSearchable
                                                    onChange={onFieldChangeSelect}
                                                    name='AssetProductCategoryId'
                                                    placeholder={t('contract_assetfilter_placeholder_product_category_id')}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <button type='button' className='btn app-primary-bg-color text-white mt-2' onClick={onSubmit}>
                                                {t('contract_assetfilter_button')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}