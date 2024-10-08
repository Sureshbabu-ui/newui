import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FeatherIcon from 'feather-icons-react';
import SweetAlert from 'react-bootstrap-sweetalert';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';
import { useStore } from "../../../../../state/storeHooks";
import { checkForPermission } from "../../../../../helpers/permissions";
import { deleteVendorBranch, getVendorBranchEditDetails, getVendorBranchList } from "../../../../../services/vendorBranch";
import { store } from "../../../../../state/store";
import { VendorBranchListState, changePage, initializeVendorBranchList, loadVendorBranches, setSearch } from "./VendorBranches.slice";
import { startPreloader, stopPreloader } from "../../../../Preloader/Preloader.slice";
import { loadVendorBranchDetails } from "./BranchEdit/VendorBranchEdit.slice";
import { ContainerPage } from "../../../../ContainerPage/ContainerPage";
import { Pagination } from "../../../../Pagination/Pagination";
import { VendorBranchEdit } from "./BranchEdit/VendorBranchEdit";
import { VendorBranchCreate } from "./BranchCreate/VendorBranchCreate";
import { useParams } from "react-router-dom";

const VendorBranches = () => {
  const { t, i18n } = useTranslation();
  const { VendorId } = useParams<{ VendorId: string }>();
  const [vendorBranchId, setVendorBranchId] = useState(0);
  const { vendorBranches, totalRows, perPage, currentPage, search } = useStore(({ vendorbranchlist }) => (vendorbranchlist));

  useEffect(() => {
    if (checkForPermission("VENDORBRANCH_LIST")) {
      onLoad();
    }
  }, []);

  const handleConfirm = (vendorBranchId: number) => {
    setVendorBranchId(vendorBranchId);
  };

  async function handleCancel() {
    setVendorBranchId(0);
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
        title='Are you sure?'
        onConfirm={() => deleteProduct(vendorBranchId)}
        onCancel={handleCancel}
        focusCancelBtn
      >
        {t('vendorbranch_deleted_conformation')}
      </SweetAlert>
    );
  }

  async function deleteProduct(Id: number) {
    var result = await deleteVendorBranch(Id);
    result.match({
      ok: () => {
        setVendorBranchId(0)
        toast(i18n.t('vendorbranch_deleted_success_message'),
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
        toast(i18n.t('vendorbranch_deleted_failure_message'),
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
    store.dispatch(initializeVendorBranchList());
    try {
      if (checkForPermission("VENDORBRANCH_LIST")) {
        const Vendors = await getVendorBranchList(store.getState().vendorbranchlist.currentPage, store.getState().vendorbranchlist.search, VendorId);
        store.dispatch(loadVendorBranches(Vendors));
      }
    } catch (error) {
      console.error(error);
    }
    store.dispatch(stopPreloader())
  }

  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
    const searchKey = store.getState().tenantlist.search;
    if (checkForPermission("VENDORBRANCH_LIST")) {
      const result = await getVendorBranchList(index, searchKey, VendorId);
      store.dispatch(loadVendorBranches(result));
    }
  }

  const filterVendorInfoList = async () => {
    if (checkForPermission("VENDORBRANCH_LIST")) {
      const result = await getVendorBranchList(store.getState().vendorbranchlist.currentPage, store.getState().vendorbranchlist.search, VendorId);
      store.dispatch(loadVendorBranches(result));
    }
  }

  const addData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == "") {
      store.dispatch(changePage(1))
      const result = await getVendorBranchList(store.getState().vendorbranchlist.currentPage, store.getState().vendorbranchlist.search, VendorId);
      store.dispatch(loadVendorBranches(result));
    }
  }

  const getSelectedDetails = async (Id: number) => {
    try {
      const result = await getVendorBranchEditDetails(Id)
      store.dispatch(loadVendorBranchDetails(result))
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="ps-3 pe-4">
        <div className="row mb-3 p-0 mt-1">
          {checkForPermission("VENDORBRANCH_LIST") &&
            <div className="col-md-9 app-primary-color ">
              <h5 className="ms-0">{t('vendorbranch_list_main_heading')}</h5>
            </div>
          }
          {checkForPermission("VENDORBRANCH_CREATE") &&
            <div className="col-md-3 ">
              <button className="btn app-primary-bg-color text-white float-end " data-bs-toggle='modal' data-bs-target='#CreateVendorBranch'>
                {t('vendorbranch_create_button')}
              </button>
            </div>
          }
        </div>
      </div>
      <>
        {checkForPermission("VENDORBRANCH_LIST") && vendorBranches.match({
          none: () => <div className="row m-2">{t('vendorbranch_list_loading')}</div>,
          some: (vendorBranch) =>
            <div className="ps-3 pe-4">
              <div className="row">
                <div className="input-group">
                  <input type='search' className="form-control custom-input" value={search} placeholder={t('vendor_list_placeholder_search') ?? ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        filterVendorInfoList();
                      }
                    }} onChange={addData} />
                  <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterVendorInfoList}>
                    Search
                  </button>
                </div>
              </div>
              <div className="row mt-3">
                {vendorBranch.length > 0 ? (
                  <div className=" table-responsive ">
                    <table className="table table-hover  table-bordered ">
                      <thead>
                        <tr>
                          <th className="text-center"></th>
                          <th scope="col">{t('vendorbranch_list_table_th_slno')}</th>
                          <th scope="col">{t('vendorbranch_list_table_th_vc')}</th>
                          <th scope="col">{t('vendorbranch_list_table_th_name')}</th>
                          <th scope="col">{t('vendorbranch_list_table_th_location')}</th>
                          <th scope="col">{t('vendorbranch_list_table_th_city')}</th>
                          <th scope="col">{t('vendorbranch_list_table_th_contactname')}</th>
                          <th scope="col">{t('vendorbranch_list_table_th_contactnumber')}</th>
                          <th scope="col">{t('vendorbranch_list_table_th_status')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendorBranch.map(({ vendorBranch }, index) => (
                          <tr className="mt-2">
                            <td className='pe-0'>
                              {
                                checkForPermission("VENDORBRANCH_CREATE") &&
                                (
                                  <a className="pseudo-href app-primary-color ps-2" data-bs-toggle='modal' data-bs-target='#EditVendorBranch' onClick={() => getSelectedDetails(vendorBranch.Id)} data-toggle="tooltip" data-placement="left" title="Edit">
                                    <FeatherIcon icon="edit" size="16" />
                                  </a>
                                )
                              }
                              <a
                                className='pseudo-href app-primary-color ps-2'
                                data-toggle="tooltip" data-placement="left" title={'Delete Vendor Branch'}
                                onClick={() => handleConfirm(vendorBranch.Id)}
                              >
                                <FeatherIcon icon={"trash-2"} size="20" />
                              </a>
                            </td>
                            <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                            <td>  {vendorBranch.Code} </td>
                            <td>  {vendorBranch.Name} </td>
                            <td>  {vendorBranch.TenantLocation} </td>
                            <td>  {vendorBranch.City} </td>
                            <td>  {vendorBranch.ContactName} </td>
                            <td>  {vendorBranch.ContactNumberOneCountryCode} {vendorBranch.ContactNumberOne}</td>
                            <td> <span className={`badge text-bg-${vendorBranch.IsActive ? "success" : "warning"}`}> {vendorBranch.IsActive ? "Active" : "InActive"}</span> </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="row m-0">
                      <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                    </div>
                  </div>
                ) : (
                  <div className="text-muted ps-3">{t('vendorbranch_list_no_data')}</div>
                )}
              </div>
              <VendorBranchEdit />
              <VendorBranchCreate />
              {vendorBranchId ? <ConfirmationModal /> : ""}
              {/* toast */}
              <Toaster />
              {/* toast ends */}
            </div>
        })}
      </>
    </>
  )
}
export default VendorBranches