import { useState } from "react";
import { store } from "../../../../state/store";
import { useStoreWithInitializer } from "../../../../state/storeHooks";
import { ContainerPage } from "../../../ContainerPage/ContainerPage";
import { Pagination } from "../../../Pagination/Pagination";
import { disableApprovalRequest } from "../../../../services/bank";
import { initializePendingList, loadPendingCustomers, changePage } from "./CustomerPendingList.slice";
import SweetAlert from "react-bootstrap-sweetalert";
import { useTranslation } from "react-i18next";
import FeatherIcon from 'feather-icons-react';
import { getCustomerPendingRequests } from "../../../../services/customer";
import { setApprovalEvent, setApprovalRequestDetailId } from "../../PendingApproval/PendingApprovalList/PendingApprovals.slice";
import { initializeCustomerPendingDetails, setSelectedIdForPendingView } from "./CustomerPendingView/CustomerPendingView.slice";
import { isApprovalNeededStatus } from "../../PendingApproval/PendingApprovalView/UserRequestView/UserRequestView.slice";
import { CustomerPendingRequestView } from "./CustomerPendingView/CustomerPendingView";
export const CustomerPending = () => {
  const { t } = useTranslation();
  const {
    customerspending: { customers, totalRows, perPage, currentPage } } = useStoreWithInitializer(({ customerspending }) => ({ customerspending }), onLoad);
  const [Id, setId] = useState(0);

  const handleConfirm = (Id: number) => {
    setId(Id);
  };

  const handleCancel = () => {
    setId(0);
  };

  const [profile, setSelectedProfile] = useState<number>();

  const redirectToViewDetail = async (Id: number, tableName: string) => {
    store.dispatch(initializeCustomerPendingDetails())
    store.dispatch(isApprovalNeededStatus());
    store.dispatch(setApprovalRequestDetailId(Id));
    store.dispatch(setSelectedIdForPendingView(Id));
    setSelectedProfile(Id)
  }

  function ConfirmationModal() {
    return (
      <SweetAlert
        warning
        showCancel
        confirmBtnText={t('customer_pending_delete_confirm_btn')}
        confirmBtnBsStyle="warning"
        title={t('customer_delete_conformation_text1')}
        onConfirm={() => deleteApprovalRequest(Id)}
        onCancel={handleCancel}
        focusCancelBtn
      >
        {t('customer_pending_delete_question')}
      </SweetAlert>
    );
  }

  async function onLoad() {
    store.dispatch(initializePendingList());
    try {
      const { currentPage } = store.getState().customerspending;
      const result = await getCustomerPendingRequests(currentPage);
      store.dispatch(loadPendingCustomers(result));
    } catch (error) {
      console.error(error);
    }
  }

  async function onPageChange(index: number) {
    store.dispatch(changePage(index));
    const { currentPage } = store.getState().customerspending;
    const result = await getCustomerPendingRequests(currentPage);
    store.dispatch(loadPendingCustomers(result));
  }

  async function deleteApprovalRequest(Id: number) {
    var result = await disableApprovalRequest(Id);
    result.match({
      ok: () => {
        onLoad()
        setId(0)
      },
      err: (err) => {
        console.log(err);
      },
    });
  }

  return customers.match({
    none: () => (
      <div className="customer">
        <ContainerPage>
          <div className="my-2">{t('customer_pending_message_loading_pending_lists')}</div>
        </ContainerPage>
      </div>
    ),
    some: (customers) => (
      <ContainerPage>
        <>
          {/* Table */}
          <div className="px-3 mt-3">
            {customers.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr className="tableRow">
                    <th className="text-center" scope="col ">
                      {t('customer_pending_label_slno')}
                    </th>
                    <th scope="col">{t('customer_pending_label_customer_name')}</th>
                    <th scope="col">{t('customer_pending_label_review_status')}</th>
                    <th scope="col">{t('customer_pending_label_action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(({ customer }, index) => (
                    <tr key={index}>
                      <th className="text-center" scope="row">
                        {(currentPage - 1) * 10 + (index + 1)}
                      </th>
                      <td>{JSON.parse(customer.Content).Name}</td>
                      <td>
                        {customer.ReviewStatus == 'ARS_SMTD' ? (
                          <> {t('customer_pending_review_status_submitted')}</>
                        ) : customer.ReviewStatus == 'ARS_RJTD' ? (
                          <>{t('customer_pending_review_status_reject')}</>
                        ) : customer.ReviewStatus == 'ARS_CAND' &&
                        (
                          <>{t('customer_pending_review_status_creator_attention_needed')}</>
                        )}
                      </td>
                      <td>
                        <a
                          className="pseudo-href app-primary-color"
                          onClick={() => redirectToViewDetail(customer.ApprovalRequestId, customer.EventCode)}
                          data-bs-toggle="modal"
                          data-bs-target="#ViewCustomerPendingRequest"
                        >
                          <FeatherIcon icon={"eye"} size="16" />
                        </a>
                        &nbsp;&nbsp;
                        {store.getState().app.user.unwrap().user[0].Id == customer.CreatedBy && customer.ReviewStatus == 'ARS_RJTD' && (
                          <a className="pseudo-href app-primary-color" onClick={() => handleConfirm(customer.ApprovalRequestDetailId)}>
                            <FeatherIcon icon={"trash-2"} size="16" />
                          </a>
                        )}&nbsp;&nbsp;
                        {store.getState().app.user.unwrap().user[0].Id == customer.CreatedBy && customer.ReviewStatus == 'ARS_CAND' && (
                          <a
                            className="pseudo-href app-primary-color"
                            href={`/config/customers/pendingupdate/${customer.ApprovalRequestDetailId}`}
                          >
                            <FeatherIcon icon={"edit"} size="16" />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-muted p-0">{t('customer_pending_message_no_records_found')}</div>
            )}
          </div>
          {/* Table ends */}

          {/* Pagination */}
          <div className="row px-3">
            <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
          </div>
          {/* Pagination ends */}

          {/* Confirmation Modal */}
          {Id ? <ConfirmationModal /> : ""}
          {/* Confirmation Modal End*/}
        </>
        <CustomerPendingRequestView />
        {/* <CustomerEdit/> */}
      </ContainerPage>
    ),
  });
}