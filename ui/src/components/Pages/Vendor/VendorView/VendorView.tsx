import { vendorViewTabs } from '../../../../tabs.json'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { SuspensePreloader } from "../../../SuspensePreloader/SuspensePreloader";
import FeatherIcon from 'feather-icons-react';
import { useHistory, useLocation } from "react-router-dom";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";
import { store } from '../../../../state/store';

export const VendorView = () => {
    const [activeTab, setActiveTab] = useState('');
    const location = useLocation();
    const history = useHistory();
    const [Tab, setTab] = useState('')

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams) {
            const Tab = searchParams.get("Tab");
            setTab(Tab ? Tab : '')
        }
    }, [location.search]);

    useEffect(() => {
        if (Tab !== undefined && Tab !== '' && vendorViewTabs.length > 0) {
            setActiveTab(Tab);
        } else {
            // If Tab is not defined or is an empty string, set it to the first element in the array
            const initialTab = vendorViewTabs[0];
            if (initialTab && initialTab.name) {
                const searchParams = new URLSearchParams(location.search);
                searchParams.set("Tab", initialTab.name);
                history.push({ search: searchParams.toString() });
            }
        }
    }, [Tab, vendorViewTabs]);

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
        // Add the tab information to the URL
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("Tab", tabName);
        history.push({ search: searchParams.toString() });
    }

    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_vendor', Link: '/config/vendors' }
    ];
    const memoizedLazyComponents = useMemo(() => {
        return vendorViewTabs.reduce((memo, tab) => {
            if (tab.name === activeTab) {
                memo[tab.id] = lazy(() => import(`../Submenu/${tab.component}`));
            }
            return memo;
        }, {});
    }, [vendorViewTabs, activeTab]);

    return (<>
        <BreadCrumb items={breadcrumbItems} />
        < div className="d-flex align-items-start ps-0 pe-3">
            <div className="col-md-2">
                <div className="sidebar">
                    <div className="nav position-fixed nav-pills me-0 d-grid mx-auto" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <div className="mt-4">
                            {vendorViewTabs.map((settingsTab, index) => (
                                <>
                                    <div onClick={() => handleTabClick(settingsTab.name)}
                                        className={activeTab == settingsTab.name ? "nav-link active button-sidebar app-primary-color " : "nav-link button-sidebar"}
                                        id={`${settingsTab.icon}-tab`} data-bs-toggle="pill" key={settingsTab.id}
                                        data-bs-target={`#${settingsTab.icon}`} role="tab"
                                        aria-controls={`${settingsTab.icon}`}
                                        aria-selected={settingsTab.id == 1 ? true : false}
                                    >
                                        <div className="d-flex justify-content-start">
                                            {/* menu icon */}
                                            <div className="m-0 ">
                                                <FeatherIcon icon={settingsTab.icon ?? ""} size="16" />
                                            </div>
                                            {/* menu icon ends */}
                                            {/* menu name */}
                                            <div className="ms-1 d-flex justify-content-center">
                                                <span className="pseudo-link">
                                                    {settingsTab.displaytext}
                                                </span>
                                            </div>
                                            {/* menu name ends */}
                                        </div>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-10 mt-3">
                <div
                    data-bs-spy="scroll"
                    data-bs-target="#vendor-menu-wrapper"
                    data-bs-smooth-scroll="true"
                    tabIndex={0}>
                    {vendorViewTabs.map((tab) => {
                        const LazyComponent = memoizedLazyComponents[tab.id];
                        return (
                            tab.name === activeTab && (
                                <Suspense key={tab.id} fallback={<div><SuspensePreloader /></div>}>
                                    <div className="pb-4">
                                        <LazyComponent />
                                    </div>
                                </Suspense>
                            )
                        );
                    })}
                </div>
            </div>
        </div></>
    );
};