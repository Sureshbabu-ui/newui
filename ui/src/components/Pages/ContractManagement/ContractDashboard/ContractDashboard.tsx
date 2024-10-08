import { useEffect } from "react"
import { useStore } from "../../../../state/storeHooks"
import CollectionsMade from "../../../ContractDashboard/CollectionsMade/CollectionsMade"
import CollectionsOutstanding from "../../../ContractDashboard/CollectionsOutstanding/CollectionsOutstanding"
import ContractsBooked from "../../../ContractDashboard/ContractsBooked/ContractsBooked"
import InvoicesPending from "../../../ContractDashboard/InvoicesPending/InvoicesPending"
import InvoicesRaised from "../../../ContractDashboard/InvoicesRaised/InvoicesRaised"
import RevenueRecognition from "../../../ContractDashboard/RevenueRecognition/RevenueRecognition"
import { store } from "../../../../state/store"
import { getUserLocationInfo } from "../../../../services/users"
import { loadMasterData, loadUserDetail, updateField, ContractDashboardFilterState } from "./ContractDashboard.slice"
import { getCategoryWiseTenantRegionNames } from "../../../../services/tenantRegion"
import { formatSelectInput } from "../../../../helpers/formats"
import Select from 'react-select';
import { getRegionAndCategoryWiseWiseTenantOfficeList } from '../../../../services/tenantOfficeInfo';
import { checkForPermission } from "../../../../helpers/permissions"

const ContractDashboard = () => {
    const {
        contractdashboardfilter: { ChangeDashboardFilter, MasterData, loggeduserinfo },
    } = useStore(({ contractdashboardfilter }) => ({ contractdashboardfilter }));

    useEffect(() => {
        const fetchUserData = async () => {
            const info = await getUserLocationInfo()
            store.dispatch(loadUserDetail(info.userLocationInfo));
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchRegions = async () => {
            const TenantRegion = await getCategoryWiseTenantRegionNames();
            const regions = await formatSelectInput(TenantRegion.RegionNames, "RegionName", "Id");            
            if (loggeduserinfo.UserCategoryCode === "UCT_FRHO") {
                store.dispatch(loadMasterData({ name: "TenantRegions", value: regions }));

            } else {
                store.dispatch(loadMasterData({ name: "TenantRegions", value: regions }));
                store.dispatch(updateField({ name: 'TenantRegionId', value: loggeduserinfo.RegionId }));
            }
        };
        fetchRegions();
    }, [loggeduserinfo.RegionId]);

    useEffect(() => {
        const fetchData = async () => {
            const TenantLocations = await getRegionAndCategoryWiseWiseTenantOfficeList(String(ChangeDashboardFilter.TenantRegionId));
            const TenantLocation = await formatSelectInput(TenantLocations.TenantOfficeName, 'OfficeName', 'Id');
            store.dispatch(loadMasterData({ name: "TenantOffices", value: TenantLocation }));
        };
        fetchData();
    }, [ChangeDashboardFilter.TenantRegionId]);

    function onFieldChangeSelect(selectedOption: any, actionMeta: any) {
        const name = actionMeta.name;
        store.dispatch(updateField({ name: name as keyof ContractDashboardFilterState['ChangeDashboardFilter'], value: selectedOption ? selectedOption.value : null }));
    }

    return (
        <div>
            {/* filter  */}
            <div className="row ps-1 pt-3">
                <div className="col-md-3">
                    <div>
                        <label>Select Region</label>
                        <Select
                            options={MasterData.TenantRegions}
                            value={MasterData.TenantRegions && MasterData.TenantRegions.find(option => option.value == ChangeDashboardFilter.TenantRegionId) || ''}
                            isSearchable
                            isClearable
                            onChange={onFieldChangeSelect}
                            name='TenantRegionId'
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <div>
                        <label>Select Location</label>
                        <Select
                            options={MasterData.TenantOffices}
                            value={MasterData.TenantOffices && MasterData.TenantOffices.find(option => option.value == ChangeDashboardFilter.TenantOfficeId) || ''}
                            isSearchable
                            isClearable
                            onChange={onFieldChangeSelect}
                            name='TenantOfficeId'
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <label>From Date</label>
                    <input type="date" name="fromdate" className="form-control"></input>
                </div>
                <div className="col-md-3">
                    <label>To Date</label>
                    <input type="date" name="fromdate" className="form-control"></input>
                </div>
            </div>

            {/* dashboard  */}
            <div className=" mt-0 mb-4 ps-1 pt-5">
                <div className="row">
                    {checkForPermission("CONTRACT_DASHBOARD_BOOKINGDETAIL_VIEW") && (
                    <div className="col-md-4">
                        <ContractsBooked TenantRegionId={ChangeDashboardFilter.TenantRegionId} TenantOfficeId={ChangeDashboardFilter.TenantOfficeId} ></ContractsBooked>
                    </div>
                    )}
                    {checkForPermission("CONTRACT_DASHBOARD_INVOICECOLLECTION_PENDING_VIEW") && (   
                    <div className="col-md-4">
                        <InvoicesPending TenantRegionId={ChangeDashboardFilter.TenantRegionId} TenantOfficeId={ChangeDashboardFilter.TenantOfficeId}></InvoicesPending>
                    </div>
                    )}
                    {checkForPermission("CONTRACT_DASHBOARD_INVOICES_RAISED_VIEW") && (   
                    <div className="col-md-4">
                        <InvoicesRaised TenantRegionId={ChangeDashboardFilter.TenantRegionId} TenantOfficeId={ChangeDashboardFilter.TenantOfficeId}></InvoicesRaised>
                    </div>
                    )}
                </div>

                <div className="row pt-4">
                    {checkForPermission("CONTRACT_DASHBOARD_INVOICECOLLECTION_MADE_VIEW") && (   
                    <div className="col-md-4">
                        <CollectionsMade TenantRegionId={ChangeDashboardFilter.TenantRegionId} TenantOfficeId={ChangeDashboardFilter.TenantOfficeId}></CollectionsMade>
                    </div>
                    )}
                    {checkForPermission("CONTRACT_DASHBOARD_REVENUERECOGNITION_VIEW") && (    
                    <div className="col-md-4">
                        <RevenueRecognition TenantRegionId={ChangeDashboardFilter.TenantRegionId} TenantOfficeId={ChangeDashboardFilter.TenantOfficeId}></RevenueRecognition>
                    </div>
                    )}
                    {checkForPermission("CONTRACT_DASHBOARD_INVOICECOLLECTION_OUTSTANDING_VIEW") && (    
                    <div className="col-md-4">
                        <CollectionsOutstanding TenantRegionId={ChangeDashboardFilter.TenantRegionId} TenantOfficeId={ChangeDashboardFilter.TenantOfficeId}></CollectionsOutstanding>
                    </div>
                    )}
                </div>
            </div>

        </div>
    )
}

export default ContractDashboard