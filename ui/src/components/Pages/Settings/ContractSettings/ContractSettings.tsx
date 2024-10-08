import { t } from "i18next";
import ContractApproverList from "./ApproverSetting/ContractApproverList/ContractApproverList";

const ContractSettings = () => {
  return (
    <div className="notifications">
      {/* <ContainerPage> */}
      {/* Section 1 */}
      <div className="row" id="contract-setting">
        {/* Header */}
        <div className="">
          <h5>{t('approver_title_contract_settings')}</h5>
        </div>
        {/* Header ends */}
      </div>
      {/* Section 1 ends */}
      <nav className=" mt-2">
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            className="nav-link active"
            id="nav-profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#nav-profile"
            type="button"
            role="tab"
            aria-controls="nav-profile"
            aria-selected="true"
          >
            {t('contractapprover_list_title')}
          </button>
        </div>
      </nav>
      <div className="tab-content mt-1" id="nav-tabContent">
        <div className="tab-pane fade show active" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
          <div className="mt-3">
            <ContractApproverList />
          </div>
        </div>
      </div>
    </div>
  )
}
export default ContractSettings;