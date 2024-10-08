import { useState } from "react";
import { store } from "../../../../state/store";
import { useStoreWithInitializer } from "../../../../state/storeHooks";
import { ContainerPage } from "../../../ContainerPage/ContainerPage";
import { Pagination } from "../../../Pagination/Pagination";
import { disableApprovalRequest, getBankApprovalRequests } from "../../../../services/bank";
import { initializePendingList, loadPendingBanks, changePage } from "./BanksPendingList.slice";
import SweetAlert from "react-bootstrap-sweetalert";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../../../helpers/formats";
import { loadSelectedApproval } from "../../PendingApproval/PendingApprovalView/PendingApprovalView.slice";
import { getClickedPendingDetails } from "../../../../services/approval";
import { EditBankRequestDetails } from "../BankApprovalRequestEdit/BankApprovalRequestEdit";
import { SelectedPendingApprovalDetail } from "../../../../types/pendingApproval";
import FeatherIcon from 'feather-icons-react';
import i18n from '../../../../i18n';
import toast, { Toaster } from 'react-hot-toast';
import { BankPendingView } from "../BankPendingView/BankPendingView";
import { updateBankPendingViewApprovalRequestId } from "../BankPendingView/BankPendingView.slice";
import { BankPendingListDetail } from "../../../../types/bankApproval";
import { updateBankPendingEditApprovalRequestId } from "../BankApprovalRequestEdit/BankApprovalRequestEdit.slice";
export const BanksPending = () => {
  const { t } = useTranslation();
  const {
    bankspending: { banks, totalRows, currentPage, perPage },
    app: { user },
  } = useStoreWithInitializer(({ bankspending, app }) => ({ bankspending, app }), onLoad);

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
        confirmBtnText="Yes, Delete!"
        confirmBtnBsStyle="warning"
        title="Are you sure?"
        onConfirm={() => deleteApprovalRequest(Id)}
        onCancel={handleCancel}
        focusCancelBtn
      >
        {t('banks_pending_delete_question')}
      </SweetAlert>
    );
  }

  const redirectToViewDetail = async (Id: number, tableName: string) => {
     store.dispatch(updateBankPendingViewApprovalRequestId(Id))

  }
  const redirectToEditApproval = async (Id:number|null) => {
    store.dispatch(updateBankPendingEditApprovalRequestId(Id))
    //store.dispatch(loadSelectedApproval({ ApprovalRequestDetail: editItem }))
    // <EditBankRequestDetails requestItem={editItem} Id={Id} />
  }

  async function onLoad() {
    store.dispatch(initializePendingList());
    try {
      const currentPage = store.getState().bankspending.currentPage;
      const result = await getBankApprovalRequests(currentPage);
      store.dispatch(loadPendingBanks(result));
    } catch (error) {
      console.error(error);
    }
  }

  async function onPageChange(index: number) {
    store.dispatch(changePage(index));
    const result = await getBankApprovalRequests(index);
    store.dispatch(loadPendingBanks(result));
  }

  async function deleteApprovalRequest(Id: number) {
    var result = await disableApprovalRequest(Id);
    result.match({
      ok: () => {
        setId(0);
        toast(i18n.t('banks_pending_message_success_delete'), {
          duration: 2100,
          style: {
            borderRadius: '0',
            background: '#00D26A',
            color: '#fff',
          },
        });
        onLoad();
      },
      err: (err) => {
        console.log(err);
        toast(i18n.t('banks_pending_message_fail_delete'), {
          duration: 2100,
          style: {
            borderRadius: '0',
            background: '#F92F60',
            color: '#fff',
          },
        });
      },
    });
  }

  return banks.match({
    none: () => (
      <div className="banks">
        <ContainerPage>
          <div className="my-2">{t('banks_pending_message_loading_pending_lists')}</div>
        </ContainerPage>
      </div>
    ),
    some: (banks) => (
      <ContainerPage>
        <div className="">
          {/* Table */}
          <div className="row mt-3">
            {banks.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr className="tableRow">
                    <th className="text-center" scope="col ">
                      {t('banks_pending_label_slno')}
                    </th>
                    <th scope="col text-center">{t("banks_pending_label_bank_name")}</th>
                    <th scope="col">{t('banks_pending_label_bank_code')}</th>
                    <th scope="col">{t('banks_pending_label_created_by')}</th>
                    <th scope="col">{t('banks_pending_label_created_on')}</th>
                    <th scope="col">{t('pending_approvals_title_review_status')}</th>
                    <th scope="col">{t('banks_pending_label_action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map((field, index) => (
                    <tr key={index}>
                      <th className="text-center" scope="row">
                        {(currentPage - 1) * 10 + (index + 1)}
                      </th>
                      <td>{JSON.parse(field.bank.Content).BankName}</td>
                      <td>{JSON.parse(field.bank.Content).BankCode}</td>
                      <td>{field.bank.CreatedUserName}</td>
                      <td>{formatDateTime(field.bank.CreatedOn)}</td>
                      <td>{field.bank.ReviewStatusName}  </td>
                      <td>
                          <a
                            className="pseudo-href app-primary-color"
                            onClick={() => redirectToViewDetail(field.bank.ApprovalRequestId, field.bank.EventCode)}
                            data-bs-toggle="modal"
                            data-bs-target="#BankPendingView"
                          >
                            <FeatherIcon icon={"eye"} size="16" />
                          </a>
                      
                        &nbsp;&nbsp;
                        {store.getState().app.user.unwrap().user[0].Id == field.bank.CreatedBy && (
                          <a className="pseudo-href app-primary-color" onClick={() => handleConfirm(field.bank.ApprovalRequestId)}>
                            <FeatherIcon icon={"trash-2"} size="16" />
                          </a>
                        )}
                        &nbsp;&nbsp;
                        {store.getState().app.user.unwrap().user[0].Id == field.bank.CreatedBy && field.bank.ReviewStatus == 'ARS_CAND' && (
                          <a
                            className="pseudo-href app-primary-color"
                           onClick={() => redirectToEditApproval(field.bank.ApprovalRequestId)}
                            data-bs-toggle="modal"
                            data-bs-target="#EditBankRequest"
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
              <div className="text-muted p-0">{t('banks_pending_message_no_records_found')}</div>
            )}
          </div>
          {/* Table ends */}

          {/* Pagination */}
          <div className="row banks-pending-pagination">
            <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
          </div>
          {/* Pagination ends */}
          {/* Confirmation Modal */}
          {Id ? <ConfirmationModal /> : ""}
          {/* Confirmation Modal End*/}
          <Toaster />
        </div>
        <BankPendingView />
        <EditBankRequestDetails />
      </ContainerPage>
    ),
  });
}