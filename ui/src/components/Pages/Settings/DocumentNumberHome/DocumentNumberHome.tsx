import { useTranslation } from 'react-i18next';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { setActiveTab } from './DocumentNumberHome.slice';
import { lazy, Suspense, useEffect, useMemo } from 'react';
import { checkForMenuPermission, checkForPermission } from '../../../../helpers/permissions';
import { SuspensePreloader } from '../../../SuspensePreloader/SuspensePreloader';

const DocumentNumberHome = () => {
    const { t, i18n } = useTranslation();
    const { documentnumberformathome: { activeTab } } = useStore(({ documentnumberformathome }) => ({ documentnumberformathome }));

    type MenuItem = {
        id: number;
        permission: string;
        name: string;
        component: string;
    };

    const filteredTabs = (): MenuItem[] => {
        const filteredTabs: MenuItem[] = [];
        let index = 1;
        if (checkForMenuPermission('DOCUMENTNUMBERSERIES_VIEW')) {
            filteredTabs.push({ id: index++, permission: "DOCUMENTNUMBERSERIES_VIEW", name: t('documentnumberhome_view_first_tab'), component: 'DocumentNumberSeries/DocumentNumberSeries' });
        }
        if (checkForMenuPermission('DOCUMENTNUMBERFORMAT_VIEW')) {
            filteredTabs.push({ id: index++, permission: "DOCUMENTNUMBERFORMAT_VIEW", name: t('documentnumberhome_view_second_tab'), component: 'DocumentNumberFormat/DocumentNumberFormat' });
        }
        return filteredTabs;
    };

    const onSelect = (ev: any) => {
        store.dispatch(setActiveTab(ev.target.value));
    };

    const memoizedLazyComponents = useMemo(() => {
        return filteredTabs().reduce((memo, tab) => {
            if (tab.id == activeTab) {
                memo[tab.id] = lazy(() => import(`../${tab.component}`));
            }
            return memo;
        }, {});
    }, [activeTab]);

    return (
        <div className="m-0">
            <h5 className="px-0 ps-2 pt-2 bold-text">{t('documentnumberhome_view_main_heading')}</h5>
            {checkForMenuPermission("DOCUMENTNUMBERSERIES_VIEW", "DOCUMENTNUMBERFORMAT_VIEW") &&
                <>
                    <div className="mt-2 pt-1">
                        <nav className="mx-2">
                            <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                {filteredTabs().map((tab, index) => (
                                    <button
                                        key={index}
                                        className={`nav-link p-0 me-3 ${tab.id == activeTab ? "active" : ""}`}
                                        id={`nav-tab-${tab.id}`}
                                        onClick={onSelect}
                                        type="button"
                                        role="tab"
                                        value={tab.id}
                                        aria-controls={`tab-${tab.id}`}
                                        aria-selected={tab.id == activeTab ? "true" : "false"}
                                    >
                                        {tab.name}
                                    </button>
                                ))}
                            </div>
                        </nav>
                        <div className="tab-content mt-0 mx-2" id="nav-tabContent">
                            {filteredTabs().map((tab) => {
                                const LazyComponent = memoizedLazyComponents[tab.id];
                                return (
                                    tab.id == activeTab && (
                                        <Suspense key={tab.id} fallback={<div><SuspensePreloader /></div>}>
                                            <div>
                                                <LazyComponent />
                                            </div>
                                        </Suspense>
                                    )
                                );
                            })}
                        </div>
                    </div>
                </>}
        </div>
    );
}

export default DocumentNumberHome