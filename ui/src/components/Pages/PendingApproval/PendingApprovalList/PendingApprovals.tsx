import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { changePage, initializeApprovalsList, loadApprovals, loadApprovalEventNames, setApprovalRequestDetailId, setApprovalEvent, setFilteredEventCode } from './PendingApprovals.slice';
import { getAllApprovalRequests } from '../../../../services/approval';
import { Pagination } from '../../../Pagination/Pagination';
import { disableApprovalRequest } from '../../../../services/bank';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDateTime, formatSelectInput } from '../../../../helpers/formats';
import Select from 'react-select';
import { checkForPermission } from '../../../../helpers/permissions';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import i18n from '../../../../i18n';
import toast, { Toaster } from 'react-hot-toast';
import PendingApprovalView from '../PendingApprovalView/PendingApprovalView';
import { getApprovalEventNamesByUser } from '../../../../services/ApprovalWorkflow/approvalEvent';

export const PendingApprovals = () => {
  const { t } = useTranslation();
  const {
    approvalsmanagement: { approvals, totalRows, currentPage,filteredEventCode, approvalEvents, perPage, selectedApprovalEventCode },
  } = useStore(({ approvalsmanagement }) => ({ approvalsmanagement }));

  useEffect(() => {
    if (checkForPermission('APPROVAL_VIEW')) {
      onLoad();
    }
  }, []);

  useEffect(() => {
    fetchPendingList()
  }, [filteredEventCode, currentPage])

  async function onLoad() {
    store.dispatch(initializeApprovalsList());
    try {
      const events = await getApprovalEventNamesByUser();
      const FilteredEvents = await formatSelectInput(events.ApprovalEvents, "EventName", "EventCode")
      store.dispatch(loadApprovalEventNames({ MasterData: FilteredEvents }));
      const currentPage = store.getState().approvalsmanagement.currentPage;
      const pendingApprovalDeatails = await getAllApprovalRequests(currentPage, selectedApprovalEventCode);
      store.dispatch(loadApprovals(pendingApprovalDeatails));
    } catch (error) {
      console.error(error);
    }
  }

  const redirectToViewDetails = async (Id: number | null, eventName: string, eventCode: string) => {
    try {
      store.dispatch(setApprovalEvent({ approvalEvent: eventName, approvalEventCode: eventCode }));
      store.dispatch(setApprovalRequestDetailId(Id ?? 0))
    } catch (error) {
      console.error(error);
    }
  };

  async function onPageChange(index: number) {
    store.dispatch(changePage(index));
  }

  const fetchPendingList = async () => {
    const result = await getAllApprovalRequests(currentPage, filteredEventCode);
    store.dispatch(loadApprovals(result));
  }

  const breadcrumbItems = [{ Text: 'breadcrumbs_home', Link: '/' }, { Text: 'breadcrumbs_approvals' }];
  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      {checkForPermission('APPROVAL_VIEW') &&
        approvals.match({
          none: () => (
            <div className='users'>
              <ContainerPage>
                <div className='my-2'>{t('pending_approvals_message_loading_approvals')}</div>
              </ContainerPage>
            </div>
          ),
          some: (approvals) => (
            <div className='users'>
              {checkForPermission('APPROVAL_VIEW') && (
                <>
                  <ContainerPage>
                    <div className=''>
                      {/* Section 1 */}
                      <div className='row m-2'>
                        {/* Header */}
                        <div className='col-md-10  p-0 app-primary-color'>
                          <h5>{t('pending_approvals_title_manage_approvals')}</h5>
                        </div>
                        {/* Header ends */}
                      </div>
                      {/* Section 1 ends */}
                      {approvalEvents.length > 0 && (
                        <div className='row m-2'>
                          <div className='col-md-4 p-0'>
                            <Select
                              options={approvalEvents}
                              value={approvalEvents && approvalEvents.find(option => option.value == filteredEventCode) || null}
                              onChange={(selectedOption) => store.dispatch(setFilteredEventCode(selectedOption?.value))}
                              isSearchable
                              isClearable
                            />
                          </div>
                        </div>
                      )}
                      {/* Table */}
                      <div className='row m-2 mt-3 p-0'>
                        {approvals.length > 0 ? (
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th scope='col'>{t('pending_approvals_title_slno')}</th>
                                <th scope='col'>{t('pending_approvals_title_event_name')}</th>
                                <th scope='col'>{t('pending_approvals_title_createdby')}</th>
                                <th scope='col'>{t('pending_approvals_title_createdon')}</th>
                                <th scope='col'>{t('pending_approvals_title_review_status')}</th>
                                <th scope='col'>{t('pending_approvals_title_action')}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {approvals.map(({ approval }, index) => (
                                <tr className="" key={index}>
                                  <th scope='row'>{(currentPage - 1) * 10 + (index + 1)}</th>
                                  <td>{approval.EventName}</td>
                                  <td>{approval.CreatedUserName}</td>
                                  <td>{formatDateTime(approval.CreatedOn)}</td>
                                  <td>{approval.ReviewStatusName}</td>
                                  <td>
                                    <a
                                      className='pseudo-href app-primary-color'
                                      onClick={() => redirectToViewDetails(approval.ApprovalRequestDetailId, approval.EventName, approval.EventCode)}
                                      data-bs-toggle='modal'
                                      data-bs-target='#ViewPendingRequest'
                                    >
                                      <span className="material-symbols-outlined text-size-20">visibility</span>
                                    </a>
                                    &nbsp;&nbsp;
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className='text-muted p-0'>{t('pending_approvals_message_no_records_found')}</div>
                        )}
                      </div>
                      {/* Table ends */}
                      {/* Pagination */}
                      <div className='row px-2 mt-0'>
                        <Pagination
                          currentPage={currentPage}
                          count={totalRows}
                          itemsPerPage={perPage}
                          onPageChange={onPageChange}
                        />
                      </div>
                    </div>
                    <PendingApprovalView />
                  </ContainerPage>
                </>
              )}
            </div>
          ),
        })}
    </>
  );
};
