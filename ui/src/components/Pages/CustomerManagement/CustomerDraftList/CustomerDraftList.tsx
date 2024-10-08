import { useState } from "react";
import { store } from "../../../../state/store";
import { useStoreWithInitializer } from "../../../../state/storeHooks";
import { ContainerPage } from "../../../ContainerPage/ContainerPage";
import { Pagination } from "../../../Pagination/Pagination";
import { disableApprovalRequest } from "../../../../services/bank";
import { initializeDraftList, loadDraftCustomers, changePage } from "./CustomerDraftList.slice";
import SweetAlert from "react-bootstrap-sweetalert";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../../../helpers/formats";
import { CustomerRequestView } from "../../PendingApproval/PendingApprovalView/CustomerRequestView/CustomerRequestView";
import FeatherIcon from 'feather-icons-react';
import { DeleteDraftCustomer, getCustomerDraftList } from "../../../../services/customer";
import { checkForPermission } from "../../../../helpers/permissions";
import toast, { Toaster } from 'react-hot-toast';
import i18n from '../../../../i18n';
export const CustomerDraftList = () => {
  const { t } = useTranslation();
  const {
    customersdraft: { customerdraft, totalRows, perPage, currentPage } } = useStoreWithInitializer(({ customersdraft }) => ({ customersdraft }), onLoad);
  const [Id, setId] = useState(0);

  const handleConfirm = (Id: number) => {
    setId(Id);
  };

  const handleCancel = () => {
    setId(0);
  };

  function ConfirmationModal() {
    return (
      <SweetAlert
        warning
        showCancel
        confirmBtnText={t('customer_pending_delete_confirm_btn')}
        confirmBtnBsStyle="warning"
        title={t('customer_delete_conformation_text1')}
        onConfirm={() => deleteDraft(Id)}
        onCancel={handleCancel}
        focusCancelBtn
      >
        {t('customer_delete_conformation_text')}
      </SweetAlert>
    );
  }

  async function onLoad() {
    store.dispatch(initializeDraftList());
    try {
      const { currentPage } = store.getState().customerspending;
      const result = await getCustomerDraftList(currentPage);
      store.dispatch(loadDraftCustomers(result));
    } catch (error) {
      console.error(error);
    }
  }

  async function onPageChange(index: number) {
    store.dispatch(changePage(index));
    const { currentPage } = store.getState().customerspending;
    const result = await getCustomerDraftList(currentPage);
    store.dispatch(loadDraftCustomers(result));
  }

  async function deleteDraft(Id: number) {
    var result = await DeleteDraftCustomer(Id);
    result.match({
      ok: () => {
        setId(0)
        toast(i18n.t('customer_draft_management_success_delete'),
          {

            duration: 2100,
            style: {
              borderRadius: '0',
              background: '#00D26A',
              color: '#fff',
            }
          });
        onLoad()
      },
      err: (err) => {
        toast(i18n.t('customer_draft_management_failure_delete'),
          {
            duration: 2100,
            style: {
              borderRadius: '0',
              background: '#F92F60',
              color: '#fff'
            }
          });
        console.log(err);
      },
    });
  }

  return customerdraft.match({
    none: () => (
      <div className="customer">
        <ContainerPage>
          <div className="my-2">{t('customer_pending_message_loading_pending_lists')}</div>
        </ContainerPage>
      </div>
    ),
    some: (customerdraft) => (
      <ContainerPage>
        <>
          {/* Table */}
          <div className="px-3 mt-3">
            {customerdraft.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr className="tableRow">
                    <th className="text-center" scope="col ">
                      {t('customer_pending_label_slno')}
                    </th>
                    <th scope="col">{t('customer_pending_label_customer_name')}</th>
                    <th scope="col">{t('customer_pending_label_created_by')}</th>
                    <th scope="col">{t('customer_pending_label_created_on')}</th>
                    <th scope="col">{t('customer_pending_label_action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {customerdraft.map(({ customer }, index) => (
                    <tr key={index}>
                      <th className="text-center" scope="row">
                        {(currentPage - 1) * 10 + (index + 1)}
                      </th>
                      <td>{JSON.parse(customer.Content).Name}</td>
                      <td>{customer.CreatedUserName}</td>
                      <td>{formatDateTime(customer.CreatedOn)}</td>
                      <td>
                        {checkForPermission("CUSTOMER_CREATE") && (
                          <>
                            {store.getState().app.user.unwrap().user[0].Id == customer.CreatedBy && (
                              <a className="pseudo-href app-primary-color" onClick={() => handleConfirm(customer.ApprovalRequestId)}>
                                <FeatherIcon icon={"trash-2"} size="16" />
                              </a>
                            )}
                          </>
                        )}
                        &nbsp;&nbsp;
                        {store.getState().app.user.unwrap().user[0].Id == customer.CreatedBy && customer.ReviewStatus == 'ARS_DRFT' && (
                          <a
                            className="pseudo-href app-primary-color"
                            href={`/config/customers/pendingupdate/${customer.ApprovalRequestId}`}
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
          <Toaster />
        </>
        <CustomerRequestView />
        {/* <CustomerEdit/> */}
      </ContainerPage>
    ),
  });
}