import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FeatherIcon from 'feather-icons-react';
import SweetAlert from 'react-bootstrap-sweetalert';
import toast, { Toaster } from 'react-hot-toast';
import { useStore } from "../../../../../state/storeHooks";
import { checkForPermission } from "../../../../../helpers/permissions";
import { deleteVendorBankAccount, getVendorBankAccountEditDetails, getVendorBankAccountList } from "../../../../../services/vendorBankAccount";
import { store } from "../../../../../state/store";
import {  changePage, initializeVendorBankAccountList, loadVendorBankAccounts } from "./BankAccounts.slice";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { Pagination } from "../../../../Pagination/Pagination";
import { useParams } from "react-router-dom";
import { VendorBankAccountEdit } from "./BankAccountEdit/BankAccountEdit";
import { loadVendorBankAccountDetails } from "./BankAccountEdit/BankAccountEdit.slice";
import { VendorBankAccountCreate } from "./BankAccountCreate/BankAccountCreate";

const BankAccounts = () => {
  const { t, i18n } = useTranslation();
  const { VendorId } = useParams<{ VendorId: string }>();
  const [vendorBankAccountId, setVendorBankAccountId] = useState(0);
  const { vendorBankAccounts, totalRows, perPage, currentPage } = useStore(({ vendorbankaccountlist }) => (vendorbankaccountlist));

  useEffect(() => {
    if (checkForPermission("VENDORBANKACCOUNT_LIST")) {
      onLoad();
    }
  }, []);

  const handleConfirm = (vendorBankAccountId: number) => {
    setVendorBankAccountId(vendorBankAccountId);
  };

  async function handleCancel() {
    setVendorBankAccountId(0);
  }

  function ConfirmationModal() {
    return (
      <SweetAlert
        warning
        showCancel
        confirmBtnText='Yes, Delete!'
        cancelBtnText='Cancel'
        cancelBtnBsStyle='light'
        confirmBtnBsStyle='warning'
        title={t('vendorbankaccount_deleted_conformation_quest')}
        onConfirm={() => deleteProduct(vendorBankAccountId)}
        onCancel={handleCancel}
        focusCancelBtn
      >
        {t('vendorbankaccount_deleted_conformation')}
      </SweetAlert>
    );
  }

  async function deleteProduct(Id: number) {
    var result = await deleteVendorBankAccount(Id);
    result.match({
      ok: () => {
        setVendorBankAccountId(0)
        toast(i18n.t('vendorbankaccount_deleted_success_message'),
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
        toast(i18n.t('vendorbankaccount_deleted_failure_message'),
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

  const onLoad = async () => {
    store.dispatch(startPreloader())
    store.dispatch(initializeVendorBankAccountList());
    try {
      if (checkForPermission("VENDORBANKACCOUNT_LIST")) {
        const Vendors = await getVendorBankAccountList(store.getState().vendorbankaccountlist.currentPage, VendorId);
        store.dispatch(loadVendorBankAccounts(Vendors));
      }
    } catch (error) {
      console.error(error);
    }
    store.dispatch(stopPreloader())
  }

  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
    const searchKey = store.getState().tenantlist.search;
    if (checkForPermission("VENDORBANKACCOUNT_LIST")) {
      const result = await getVendorBankAccountList(index, VendorId);
      store.dispatch(loadVendorBankAccounts(result));
    }
  }

  const getSelectedDetails = async (Id: number) => {
    try {
      const result = await getVendorBankAccountEditDetails(Id)
      store.dispatch(loadVendorBankAccountDetails(result))
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="ps-3 pe-4">
        <div className="row mb-3 p-0 mt-1">
          {checkForPermission("VENDORBANKACCOUNT_LIST") &&
            <div className="col-md-9 app-primary-color ">
              <h5 className="ms-0">{t('vendorbankaccount_list_main_heading')}</h5>
            </div>
          }
          {checkForPermission("VENDORBANKACCOUNT_CREATE") &&
            <div className="col-md-3 ">
              <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateVendorBankAccount'>
                {t('vendorbankaccount_create_button')}
              </button>
            </div>
          }
        </div>
      </div>
      <>
        {checkForPermission("VENDORBANKACCOUNT_LIST") && vendorBankAccounts.match({
          none: () => <div className="row m-2">{t('vendorbankaccount_list_loading')}</div>,
          some: (vendorBankAccount) =>
            <div className="ps-3 pe-4">
              <div className="row mt-3">
                {vendorBankAccount.length > 0 ? (
                  <div className=" table-responsive ">
                    <table className="table table-hover  table-bordered ">
                      <thead>
                        <tr>
                          <th className="text-center"></th>
                          <th scope="col">{t('vendorbankaccount_list_table_th_slno')}</th>
                          <th scope="col">{t('vendorbankaccount_list_table_th_vendorbarnchname')}</th>
                          <th scope="col">{t('vendorbankaccount_list_table_th_bankbranchname')}</th>
                          <th scope="col">{t('vendorbankaccount_list_table_th_acctype')}</th>
                          <th scope="col">{t('vendorbankaccount_list_table_th_accnumber')}</th>
                          <th scope="col">{t('vendorbankaccount_list_table_th_ifsc')}</th>
                          <th scope="col">{t('vendorbankaccount_list_table_th_status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendorBankAccount.map(({ vendorBankAccount }, index) => (
                          <tr className="mt-2">
                            <td className='pe-0'>
                              {
                                checkForPermission("VENDORBANKACCOUNT_CREATE") &&
                                (
                                  <a className="pseudo-href app-primary-color ps-2" data-bs-toggle='modal' data-bs-target='#EditVendorBankAccount' onClick={() => getSelectedDetails(vendorBankAccount.Id)} data-toggle="tooltip" data-placement="left" title="Edit">
                                    <FeatherIcon icon="edit" size="16" />
                                  </a>
                                )
                              }
                              <a
                                className='pseudo-href app-primary-color ps-2'
                                data-toggle="tooltip" data-placement="left" title={'Delete Vendor Bank Account'}
                                onClick={() => handleConfirm(vendorBankAccount.Id)}
                              >
                                <FeatherIcon icon={"trash-2"} size="20" />
                              </a>
                            </td>
                            <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                            <td>  {vendorBankAccount.VendorBranchName} </td>
                            <td>  {vendorBankAccount.BankBranchName} </td>
                            <td>  {vendorBankAccount.AccountType} </td>
                            <td>  {vendorBankAccount.AccountNumber} </td>
                            <td>  {vendorBankAccount.Ifsc} </td>
                            <td> <span className={`badge text-bg-${vendorBankAccount.IsActive ? "success" : "warning"}`}> {vendorBankAccount.IsActive ? "Active" : "InActive"}</span> </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="row m-0">
                      <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                    </div>
                  </div>
                ) : (
                  <div className="text-muted ps-3">{t('vendorbankaccount_list_no_data')}</div>
                )}
              </div>
              <VendorBankAccountEdit />
              <VendorBankAccountCreate />
              {vendorBankAccountId ? <ConfirmationModal /> : ""}
              {/* toast */}
              <Toaster />
              {/* toast ends */}
            </div>
        })}
      </>
    </>
  )
}
export default BankAccounts