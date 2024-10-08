import { store } from '../../../../state/store';
import { useStoreWithInitializer } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { Pagination } from '../../../Pagination/Pagination';
import { deleteBank, getApprovedBankList } from '../../../../services/bank';
import { initializeApprovedList, changePage, loadApprovedBanks, setSearch } from './BanksApprovedList.slice';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '../../../../helpers/formats';
import { checkForPermission } from '../../../../helpers/permissions';
import { loadBankDetails } from '../BankEdit/BankEdit.slice';
import { BankEdit } from '../BankEdit/BankEdit';
import SweetAlert from "react-bootstrap-sweetalert";
import toast, { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function BanksApproved() {
  const { t, i18n } = useTranslation();
  const { approvedBanks, totalRows, perPage, currentPage, search } = useStoreWithInitializer(
    ({ banksapproved }) => banksapproved,
    onLoad
  );

  const [Id, setId] = useState(0);

  const handleConfirm = (Id: number) => {
    setId(Id);
  };

  const handleCancel = () => {
    setId(0);
  };

  function DeleteConfirmationModal() {
    return (
      <SweetAlert
        danger
        showCancel
        confirmBtnText={t('bank_delete_confirm_btn')}
        confirmBtnBsStyle="danger"
        title={t('bank_delete_title')}
        onConfirm={() => handleDelete(Id)}
        onCancel={handleCancel}
        focusCancelBtn
      >
        {t('bank_delete_question')}
      </SweetAlert>
    );
  }

  async function handleDelete(Id: number) {
    var result = await deleteBank(Id);
    result.match({
      ok: () => {
        setId(0);
        toast(i18n.t('bank_message_success_delete'), {
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
        toast(i18n.t(err.Message), {
          duration: 2100,
          style: {
            borderRadius: '0',
            background: '#F92F60',
            color: '#fff',
          },
        });
        setId(0);
      },
    });
  }

  return (<ContainerPage>{
    approvedBanks.match({
      none: () => (
        <div className='banks'>
          <>
            <div className='my-2'>{t('banks_approved_message_loading_bank_list')}</div>
          </>
        </div>
      ),
      some: (banks: any) => (
        <>
          {/*search section */}
          <div className="input-group p-0 ">
            <input type='search' className="form-control custom-input" value={search??''} placeholder={t('bank_list_placeholder_search') ?? ''} onChange={addData}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  filterBanksList(e);
                }
              }} />
            <button className="btn w-10 app-primary-bg-color text-white float-end " type="button" onClick={filterBanksList}>
              {t('banks_approved_list_search')}
            </button>
          </div>
          {/*search section ends */}

          {/* Table */}
          <div className='row mt-3 m-0 p-0'>
            {banks.length > 0 ? (
              <table className='table table-bordered'>
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th className='text-center' scope='col '>
                      {t('banks_approved_label_slno')}
                    </th>
                    <th scope='col '>{t('banks_approved_label_bank_name')}</th>
                    <th scope='col'>{t('banks_approved_label_bank_code')}</th>
                    <th scope='col'>{t('banks_approved_label_created_by')}</th>
                    <th scope='col'>{t('banks_approved_label_created_on')}</th>
                  </tr>
                </thead>
                <tbody>
                  {banks.map((field: any, index: any) => (
                    <tr key={index}>
                      <td>
                        {checkForPermission("BANK_MANAGE") &&
                          <>
                            <a
                              className="pseudo-href app-primary-color"
                              onClick={() => {
                                store.dispatch(loadBankDetails({ Id: field.approvedBank.Id, BankName: field.approvedBank.BankName }))
                              }}
                              data-bs-toggle="modal"
                              data-toggle="tooltip" data-placement="left" title={'Edit'}
                              data-bs-target="#EditBank"
                            >
                              <span className="material-symbols-outlined">
                                edit_note
                              </span>
                            </a>
                            <span className="custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.approvedBank.Id)}>
                              Delete
                            </span>
                          </>
                        }
                      </td>
                      <th className='text-center' scope='row'>
                        {(currentPage - 1) * 10 + (index + 1)}
                      </th>
                      <td>{field.approvedBank.BankName}</td>
                      <td>{field.approvedBank.BankCode}</td>
                      <td>{field.approvedBank.CreatedBy}</td>
                      <td>{formatDateTime(field.approvedBank.ApprovedOn)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='text-muted p-0'>{t('banks_approved_message_no_records_found')}</div>
            )}
          </div>
          {/* Table ends */}

          {/* Pagination */}
          <div className='row banks-pending-pagination'>
            <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
          </div>
          {/* Pagination ends */}
          {Id ? <DeleteConfirmationModal /> : ""}
          <BankEdit />
          <Toaster />
        </>
      ),
    })}</ContainerPage>)
}

async function onLoad() {
  store.dispatch(initializeApprovedList());
  try {
    const currentPage = store.getState().banksapproved.currentPage;
    const searchKey = store.getState().banksapproved.search;
    const result = await getApprovedBankList(currentPage, searchKey);
    store.dispatch(loadApprovedBanks(result));
  } catch (error) {
    console.error(error);
  }
}

async function onPageChange(index: number) {
  store.dispatch(changePage(index));
  const searchKey = store.getState().banksapproved.search;
  const result = await getApprovedBankList(index, searchKey);
  store.dispatch(loadApprovedBanks(result));
}

async function filterBanksList(event: any) {
  store.dispatch(changePage(1));
  const currentPage = store.getState().banksapproved.currentPage;
  const searchKey = store.getState().banksapproved.search;
  const result = await getApprovedBankList(currentPage, searchKey);
  store.dispatch(loadApprovedBanks(result));
}
const addData = async (event: any) => {
  store.dispatch(setSearch(event.target.value));
  if (event.target.value == "") {
    store.dispatch(changePage(1))
    const result = await getApprovedBankList(store.getState().banksapproved.currentPage, store.getState().banksapproved.search);
    store.dispatch(loadApprovedBanks(result));
  }
}
