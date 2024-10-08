import { useState, Suspense, lazy, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BreadCrumb from '../../BreadCrumbs/BreadCrumb';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { t } from 'i18next';
import { getAllPartIndentRequestDetailsStatusCount } from '../../../services/partIndent';
import { setReqStatus } from './SmeIndentDetails/SmeIndentDetail/SmeIndentDetails.slice';
import { store } from '../../../state/store';

const SmeHome = lazy(() => import('./SmeHome/SmeHome'));
const SmeIndents = lazy(() => import('./SmeIndents/SmeIndents'));
const SmeIndentDetails = lazy(() => import('./SmeIndentDetails/SmeIndentDetail/SmeIndentDetails'));

export const SmeView = () => {
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_sme_view', Link: '/sme' },
    ];

    const [selectedTab, setSelectedTab] = useState('sme/home');
    const [selectedStatus, setSelectedStatus] = useState('');
    const handleTabClick = async (tab: string, status: string) => {
        setSelectedStatus(status);
        setSelectedTab(tab);
        store.dispatch(setReqStatus(status))
    };

    const [statusCount, setStatusCount] = useState({
        New: '0',
        Hold: '0',
        Approved: '0',
        Rejected: '0'
    });

    let SelectedComponent;
    switch (selectedTab) {
        case 'sme/home':
            SelectedComponent = SmeHome;
            break;
        case 'sme/indents':
            SelectedComponent = SmeIndents;
            break;
        case 'sme/indentdetails':
            SelectedComponent = SmeIndentDetails;
            break;
        default:
            SelectedComponent = SmeHome;
            break;
    }

    const onLoad = async () => {
        try {
            const result = await getAllPartIndentRequestDetailsStatusCount();
            if (result && result.PartIndentStatusCount && result.PartIndentStatusCount.length > 0) {
                setStatusCount(result.PartIndentStatusCount[0]);
            }
        } catch (error) {
            return
        }
    };

    useEffect(() => {
        onLoad();
    }, []);

    return (
        <div>
            <BreadCrumb items={breadcrumbItems} />
            <ContainerPage>
                <div className="row pt-2">
                    <div className="col-md-2">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link
                                    className="text-decoration-none text-reset"
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleTabClick('sme/home', '');
                                    }}
                                >
                                    <i className="icon-list"></i>
                                    <div className={`${selectedTab == "sme/home" ? "app-primary-color fw-bold nav-item p-2" : "text-muted nav-item p-2"}`}>{t("sme_view_tabs_home")}</div>
                                </Link>
                            </li>
                            <li className="nav-item ">
                                <Link
                                    className="text-decoration-none text-reset"
                                    to="#"
                                    onClick={(e) => {
                                        handleTabClick('sme/indents', '');
                                    }}
                                >
                                    <i className="icon-share-2"></i>
                                    <div className={`${selectedTab == "sme/indents" ? "app-primary-color fw-bold nav-item p-2" : "text-muted nav-item p-2"}`}>{t("sme_view_tabs_indents")}</div>
                                </Link>
                            </li>
                            <li className="nav-item  ">
                                <Link
                                    className="text-decoration-none text-reset"
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleTabClick('sme/indentdetails', '');
                                    }}
                                >
                                    <div className={`${selectedTab == "sme/indentdetails" ? "app-primary-color fw-bold nav-item p-2" : "text-muted nav-item p-2"}`}>{t("sme_view_tabs_indent_details")}</div>
                                </Link>
                            </li>
                            <li className="nav-item  ps-3">
                                <Link
                                    className="text-decoration-none text-reset"
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleTabClick('sme/indentdetails', 'PRT_CRTD');
                                    }}
                                >
                                    <div className={`${selectedStatus == "PRT_CRTD" ? "app-primary-color fw-bold nav-item p-2 d-flex justify-content-between": "text-muted d-flex justify-content-between nav-item p-2"}`}>
                                        <span className="me-1">{t("sme_view_tabs_new")} </span>
                                        <span className="badge bg-primary">{statusCount.New}</span>
                                    </div>
                                </Link>
                            </li>
                            <li className="nav-item ps-3">
                                <Link
                                    className="text-decoration-none text-reset"
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleTabClick('sme/indentdetails', 'PRT_HOLD');
                                    }}
                                >
                                    <div className={`${selectedStatus == "PRT_HOLD" ? "app-primary-color fw-bold nav-item p-2 d-flex justify-content-between" : "text-muted nav-item p-2 d-flex justify-content-between"}`}>
                                        <span className="me-1">{t("sme_view_tabs_hold")}</span>
                                        <span className="badge bg-secondary ">{statusCount.Hold}</span>
                                    </div>
                                </Link>
                            </li>
                            <li className="nav-item ps-3">
                                <Link
                                    className="text-decoration-none text-reset"
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleTabClick('sme/indentdetails', 'PRT_APRV');
                                    }}
                                >
                                    <div className={`${selectedStatus == "PRT_APRV" ? "app-primary-color fw-bold nav-item p-2 d-flex justify-content-between" : "text-muted nav-item p-2 d-flex justify-content-between"}`}>
                                        <span className="me-1">{t("sme_view_tabs_approved")}</span>
                                        <span className="badge bg-success">{statusCount.Approved}</span>
                                    </div>
                                </Link>
                            </li>
                            <li className="nav-item ps-3">
                                <Link
                                    className="text-decoration-none text-reset"
                                    to="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleTabClick('sme/indentdetails', 'PRT_RJTD');
                                    }}
                                >
                                    <div className={`${selectedStatus == "PRT_RJTD" ? "app-primary-color fw-bold nav-item p-2 d-flex justify-content-between" : "text-muted nav-item p-2 d-flex justify-content-between"}`}>
                                        <span className="me-1">{t("sme_view_tabs_rejected")}</span>
                                        <span className="badge bg-danger">{statusCount.Rejected}</span>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-10">
                        <Suspense fallback={<div>{t("sme_view_loading")}</div>}>
                            <SelectedComponent />
                        </Suspense>
                    </div>
                </div>
            </ContainerPage>
        </div>
    );
};