import React from 'react'
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../../../state/storeHooks';

const CallCordinatorHome = () => {
  const { t } = useTranslation();
  const { serviceRequestCounts, selectedStatus,totalRows } = useStore(({ callcordinatormanagement }) => (callcordinatormanagement));
  return (
    <div className='row'>
      <div className='col-md-4'>
        <div className="row d-flex justify-content-center bg-light text-center rounded h-100 mt-2 p-4">
          <div className="col-4 p-0 my-auto ">
            <div className="fw-bold">{t('callcordinator_management_home_tab_total')}</div>
            <div className="fw-bold fs-1">{totalRows}</div>
          </div>
        </div>
      </div>
      <div className='col-md-8 py-2 pe-1'>
        <div className='row d-flex justify-content-center'>
          <div className='col-md-5 rounded bg-warning-subtle m-1 py-5 text-center'>
            <div className="fw-700">{selectedStatus == "UNASSIGNED" ? t('callcordinator_management_home_tab_newcall') : selectedStatus == "ASSIGNED" ? t('callcordinator_management_home_tab_engnotaccepted') : t('callcordinator_management_home_tab_remotelyclosed')}</div>
            <div className="fw-bold fs-3">{selectedStatus == "UNASSIGNED" ? serviceRequestCounts.NewCalls : selectedStatus == "ASSIGNED" ? serviceRequestCounts.EngNotAccepted : serviceRequestCounts.RemotelyClosed}</div>
          </div>
          <div className='col-md-5 rounded bg-info-subtle m-1 py-5 text-center'>
            <div className="fw-700">{selectedStatus == "UNASSIGNED" ? t('callcordinator_management_home_tab_visitclosed') : selectedStatus == "ASSIGNED" ? t('callcordinator_management_home_tab_engaccepted') : t('callcordinator_management_home_tab_onsiteclosed')}</div>
            <div className="fw-bold fs-3">{selectedStatus == "UNASSIGNED" ? serviceRequestCounts.VisitClosed : selectedStatus == "ASSIGNED" ? serviceRequestCounts.EngAccepted : serviceRequestCounts.OnsiteClosed}</div>
          </div>
          {["UNASSIGNED", "ASSIGNED"].includes(selectedStatus) && (
            <div className='col-md-5 rounded bg-success-subtle m-1 py-5 text-center'>
              <div className="fw-700">{selectedStatus == "UNASSIGNED" ? t('callcordinator_management_home_tab_resolvedcall') : selectedStatus == "ASSIGNED" && t('callcordinator_management_home_tab_visitstarted')}</div>
              <div className="fw-bold fs-3">{selectedStatus == "UNASSIGNED" ? serviceRequestCounts.CallResolved : selectedStatus == "ASSIGNED" && serviceRequestCounts.VisitStarted}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CallCordinatorHome