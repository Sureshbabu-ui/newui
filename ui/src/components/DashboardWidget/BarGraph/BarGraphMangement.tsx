import { useEffect, useState } from 'react'
import { ContractBarGraph } from './ContractBarGraph/ContractBarGraph'
import InvoicePendingBarGraph from './InvoicePendingBarGraph/InvoicePendingBarGraph'
import CollectionMadeGraph from './CollectionMadeGraph/CollectionMadeGraph'
import CollectionPendingBarGraph from './CollectionPendingBarGraph/CollectionPendingBarGraph'
import { BarGraphManagementState, barGraphUpdateField } from './BarGraphManagement.slice'
import { store } from '../../../state/store'
import { getTenantRegionNames } from '../../../services/tenantRegion'
import { useTranslation } from 'react-i18next'
import { formatSelectInputWithThreeArgParenthesis } from '../../../helpers/formats'
import { useStore } from '../../../state/storeHooks'
import Select from 'react-select';

const BarGraphManagement = () => {
    const [activeTab, setActiveTab] = useState("CONTRACT_APPROVED")
    const { t } = useTranslation();
    const [selectRegionNames, setRegionNames] = useState<{ value: any, label: any }[]>([])
    const { barGraphDetails } = useStore(({ bargraphmanagement }) => bargraphmanagement);

    useEffect(() => {
        onLoad()
    }, [])

    const onLoad = async () => {
        try {
            const { RegionNames } = await getTenantRegionNames()
            setRegionNames(formatSelectInputWithThreeArgParenthesis(RegionNames, "RegionName", "Code", "Id"))
            setRegionNames((prevRegionNames) => [{ label: "All Region", value: null }, ...prevRegionNames]);
        } catch (error) {
            console.error(error);
        }
    }

    const onUpdateField = (ev: any) => {
        var name = ev.target.name;
        var value = ev.target.value;
        store.dispatch(barGraphUpdateField({ name: name as keyof BarGraphManagementState['barGraphDetails'], value }));
    }
    const onSelectChange = async (selectedOption: any, actionMeta: any) => {
        var value = selectedOption.value
        var name = actionMeta.name
        store.dispatch(barGraphUpdateField({ name: name as keyof BarGraphManagementState['barGraphDetails'], value }));
    }

    const tabButtton = [
        { tabText: "Contracts Approved", tabName: "CONTRACT_APPROVED" },
        // { tabText: "Invoices Raised", tabName: "INVOICE_RAISED" },
        { tabText: "Invoices Pending", tabName: "INVOICE_PENDING" },
        { tabText: "Collections Made", tabName: "COLLECTION_MADE" },
        { tabText: "Collections Pending", tabName: "COLLECTION_PENDING" },
    ];
    const tabComponent = [
        { component: ContractBarGraph, tabName: "CONTRACT_APPROVED" },
        // { component: InvoiceRaisedBarGraph, tabName: "INVOICE_RAISED" },
        { component: InvoicePendingBarGraph, tabName: "INVOICE_PENDING" },
        { component: CollectionMadeGraph, tabName: "COLLECTION_MADE" },
        { component: CollectionPendingBarGraph, tabName: "COLLECTION_PENDING" },
    ];

    return (
        <div className='ms-2'>
            <nav className="mt-1">
                <div className="nav nav-tabs pe-0" id="nav-tab" role="tablist">
                    {tabButtton.map(({ tabName, tabText }) => (
                            <button
                                className={`nav-link ${activeTab === tabName ? 'active' : ''}`}
                                onClick={() => setActiveTab(tabName)}
                                id="nav-home-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-home"
                                type="button"
                                role="tab"
                                value={0}
                                key={tabName}
                                aria-controls="nav-home"
                                aria-selected="true"
                            >
                                {tabText}
                            </button>
                    ))}
                </div>
            </nav>
            <div className='row mt-3'>
                <div className='col-md-4'>
                    <input
                        name='StartDate'
                        type='date'
                        className='form-control'
                        value={barGraphDetails.StartDate}
                        onChange={onUpdateField}
                    />
                </div>
                <div className='col-md-4'>
                    <input
                        name='EndDate'
                        type='date'
                        className='form-control'
                        value={barGraphDetails.EndDate}
                        min={barGraphDetails.StartDate}
                        onChange={onUpdateField}
                    />
                </div>
                <div className='col-md-4'>
                    <Select
                        options={selectRegionNames}
                        value={selectRegionNames && selectRegionNames.find(option => option.value == barGraphDetails.RegionId) || null}
                        onChange={onSelectChange}
                        isSearchable
                        placeholder={t('tenant_officeinfo_list_placeholder_search_select_filter')}
                        classNamePrefix="react-select"
                        name="RegionId"
                    />
                </div>
            </div>
            <div className="tab-content mt-2" id="nav-tabContent">
                {tabComponent.map(({ component: Component, tabName }) => (
                        <div className={`tab-pane ${activeTab === tabName ? 'active' : ''}`} id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" key={tabName}>
                            <div className="mt-2">
                                {activeTab === tabName && (
                                    <Component />
                                )}
                            </div>
                        </div>
                ))}
            </div>
        </div>
    )
}

export default BarGraphManagement