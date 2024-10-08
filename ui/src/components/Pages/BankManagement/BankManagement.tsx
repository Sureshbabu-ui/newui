import { ContainerPage } from "../../ContainerPage/ContainerPage";
import { CreateBankApprovalRequest } from "./BankApprovalRequestCreate/BankApprovalRequestCreate";
import { BanksPending } from "../BankManagement/BanksPendingList/BanksPendingList";
import { BanksApproved } from "../BankManagement/BanksApprovedList/BanksApprovedList";
import { useTranslation } from "react-i18next";
import { store } from "../../../state/store";
import { useStore } from "../../../state/storeHooks";
import { setActiveTab } from "./BankManagement.slice";
import { checkForPermission } from "../../../helpers/permissions";
import BreadCrumb from "../../BreadCrumbs/BreadCrumb";

export function BankManagement() {
  const { activeTab } = useStore(({ bankmanagement }) => bankmanagement);

  const { t } = useTranslation();

  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_masters', Link: '/config/masters' },
    { Text: 'breadcrumbs_masters_bankmanagement' }  
  ];

  return (
    <div className="banks">
      <ContainerPage>
       <BreadCrumb items={breadcrumbItems} />
        <div className="my-2">
          {/* Section 1 */}
          <div className="row m-2">
            {/* Header */}
            <div className="col-md-10 p-0 app-primary-color">
              {checkForPermission("BANK_VIEW") && <h5>{t("bank_management_title_manage_banks")}</h5>}
            </div>
            {/* Header ends */}
            {/* New Bank button */}
            <div className="col-md-2 p-0">
              {checkForPermission("BANK_MANAGE") && (
                <button
                  className="btn text-white float-end app-primary-bg-color"
                  data-bs-toggle="modal"
                  data-bs-target="#createNewBank"
                >
                  {t('bank_management_title_new_bank')}
                </button>
              )}
            </div>
            {/* New Bank button ends */}
          </div>
          {/* Section 1 ends */}
          <nav className="m-2 mt-3">
            {checkForPermission("BANK_VIEW") && (
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className={`nav-link ${activeTab === "nav-home" ? "active" : ""}`}
                  onClick={() => store.dispatch(setActiveTab("nav-home"))}
                  id="nav-home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-home"
                  type="button"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  {t('bank_management_title_approved_banks_list')}
                </button>
                <button
                  className={`nav-link ${activeTab === "nav-pending" ? "active" : ""}`}
                  onClick={() => store.dispatch(setActiveTab('nav-pending'))}
                  id="nav-pending-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-pending"
                  type="button"
                  role="tab"
                  aria-controls="nav-pending"
                  aria-selected="false"
                >
                  {t('bank_management_title_pending_requests')}
                </button>
              </div>
            )}
          </nav>
          {checkForPermission('BANK_VIEW') && (
            <div className="tab-content m-2 mt-3" id="nav-tabContent">
              <div
                className={`tab-pane ${activeTab === "nav-home" ? "active" : ""}`}
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <div className="mt-2">
                  <small className=" text-muted">{t('bank_management_alert_approved_message')}</small>
                  <BanksApproved />
                </div>
              </div>
              <div
                className={`tab-pane ${activeTab === "nav-pending" ? "active" : ""}`}
                id="nav-pending"
                role="tabpanel"
                aria-labelledby="nav-pending-tab"
              >
                <div className="mt-2">
                  <small className=" text-muted">{t('bank_management_alert_approval_message')}</small>
                  <BanksPending />
                </div>
              </div>
            </div>
          )}
          {/* Modals */}
          <CreateBankApprovalRequest />
          {/* Modals ends */}
        </div>
      </ContainerPage>
    </div>
  );
}
