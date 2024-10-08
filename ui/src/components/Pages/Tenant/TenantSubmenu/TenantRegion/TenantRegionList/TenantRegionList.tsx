import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../../../../state/storeHooks';
import { changePage, loadTeantRegions, initializeTenantRegionList, setSearch, setVisibleModal } from './TenantRegionList.slice';
import { Pagination } from '../../../../../Pagination/Pagination';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import { store } from '../../../../../../state/store';
import { deleteTenantRegion, getClickedRegionDetails, getTenantRegionsList } from '../../../../../../services/tenantRegion';
import { TenantRegionCreate } from '../TenantRegionCreate/TenantRegionCreate';
import { loadTenantRegionDetails } from '../TenantRegionEdit/TenantRegionEdit.slice';
import { TenantRegionEdit } from '../TenantRegionEdit/TenantRegionEdit';
import { setSelectedTabName } from '../../../TenantView/TenantView.slice';
import { setFilter } from '../../TenantOffice/TenantOfficeList/TenantOfficeList.slice';
import { checkForPermission } from '../../../../../../helpers/permissions';
import toast, { Toaster } from 'react-hot-toast';
import SweetAlert from 'react-bootstrap-sweetalert';

const TenantRegionList = () => {
  const { t, i18n } = useTranslation();
  const {
    tenantregionlist: { tenantregions, totalRows, perPage, currentPage, search },
  } = useStore(({ tenantregionlist, app }) => ({ tenantregionlist, app }));
  const [tenantRegionId, setTenantRegionId] = useState(0);

  useEffect(() => {
    if (checkForPermission("ACCEL_MANAGE")) {
      onLoad();
    }
  }, []);

  const onLoad = async () => {
    store.dispatch(startPreloader());
    store.dispatch(initializeTenantRegionList());
    try {
      const TenantRegions = await getTenantRegionsList(search, currentPage);
      store.dispatch(loadTeantRegions(TenantRegions));
    } catch (error) {
      console.error(error);
    }
    store.dispatch(stopPreloader());
  };

  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
    const result = await getTenantRegionsList(search, index);
    store.dispatch(loadTeantRegions(result));
  };

  const filterTenantRegionList = async (event: any) => {
    store.dispatch(changePage(1))
    const result = await getTenantRegionsList(
      store.getState().tenantregionlist.search,
      1
    );
    store.dispatch(loadTeantRegions(result));
  };

  const addData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == '') {
      store.dispatch(changePage(1))
      const result = await getTenantRegionsList(
        store.getState().tenantregionlist.search,
        store.getState().tenantregionlist.currentPage
      );
      store.dispatch(loadTeantRegions(result));
    }
  };

  async function loadClickedRegionDetails(RegionId: string) {
    store.dispatch(setVisibleModal("EditTenantRegion"))
    const RegionInfo = await getClickedRegionDetails(RegionId);
    store.dispatch(loadTenantRegionDetails(RegionInfo));
  }

  async function handleClick(RegionId: string) {
    store.dispatch(setFilter({ value: RegionId.toString() }));
    store.dispatch(setSelectedTabName('AREAOFFICES'));
  }

  const handleConfirm = (TenantRegionId: number) => {
    setTenantRegionId(TenantRegionId);
  };

  async function handleCancel() {
    setTenantRegionId(0);
  }

  function ConfirmationModal() {
    return (
      <SweetAlert
        danger
        showCancel
        confirmBtnText={t('tenantregion_delete_confirm_btn')}
        confirmBtnBsStyle="danger"
        title={t('tenantregion_delete_title')}
        onConfirm={() => deleteTenantRegionDetails(tenantRegionId)}
        onCancel={handleCancel}
        focusCancelBtn
      >
        {t('tenantregion_delete_question')}
      </SweetAlert>
    );
  }

  async function deleteTenantRegionDetails(Id: number) {
    var result = await deleteTenantRegion(Id);
    result.match({
      ok: () => {
        setTenantRegionId(0)
        toast(i18n.t('tenantregion_deleted_success_message'),
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
        toast(i18n.t(err.Message),
          {
            duration: 2100,
            style: {
              borderRadius: '0',
              background: '#F92F60',
              color: '#fff'
            }
          });
        setTenantRegionId(0);
      },
    });
  }

  return (
    <>
      {checkForPermission('ACCEL_MANAGE') && (
        <div>
          <div>
            <div className='row mt-1 mb-3 p-0 '>
              <div className='col-md-8 app-primary-color '>
                <h5 className='ms-1  ps-1 mt-1'> {t('tenantregion_list_title')}</h5>
              </div>
              {checkForPermission('ACCEL_MANAGE') && (
                <div className='col-md-4'>
                  <button
                    className='btn app-primary-bg-color text-white float-end '
                    data-bs-toggle='modal'
                    data-bs-target='#CreateTenantRegion'
                    onClick={() => store.dispatch(setVisibleModal("CreateTenantRegion"))}
                  >
                    {t('tenantregion_list_button_create')}
                  </button>
                </div>
              )}
            </div>
            {checkForPermission('ACCEL_MANAGE') && (
              <div className='mb-3 ps-2 pe-0'>
                <div className='input-group'>
                  <input
                    type='search'
                    className='form-control custom-input'
                    value={search}
                    placeholder={t('tenantregion_list_placeholder_search') ?? ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        filterTenantRegionList(e);
                      }
                    }}
                    onChange={addData}
                  />
                  <button
                    className='btn app-primary-bg-color text-white float-end '
                    type='button'
                    onClick={filterTenantRegionList}
                  >
                    {t('tenantregion_list_search')}
                  </button>
                </div>
              </div>
            )}
          </div>
          <>
            {checkForPermission('ACCEL_MANAGE') &&
              tenantregions.match({
                none: () => <div className='ms-1'>{t('tenantregion_list_loading')}</div>,
                some: (TenantRegions) => (
                  <div className='ps-1 mt-0'>
                    <div className='row ps-1'>
                      {TenantRegions.length > 0 ? (
                        <div className='col'>
                          <div className='table-responsive '>
                            <table className='table table-hover text-nowrap table-bordered '>
                              <thead>
                                <tr>
                                  <th scope='col' className='text-center'>
                                    {t('tenantregion_list_th_slno')}
                                  </th>
                                  <th scope='col'>{t('tenantregion_list_th_actions')}</th>
                                  <th scope='col'>{t('tenantregion_list_th_code')}</th>
                                  <th scope='col'>{t('tenantregion_list_th_region_name')}</th>
                                  <th scope='col'>{t('tenantregion_list_th_tenantoffice')}</th>
                                  <th scope='col'>{t('tenantregion_list_th_state')}</th>
                                  <th scope='col'>{t('tenantregion_list_th_city')}</th>
                                  <th scope='col'>{t('tenantregion_list_th_pincode')}</th>
                                  <th scope='col'>{t('tenantregion_list_th_status')}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {TenantRegions.map((field, index) => (
                                  <tr className='mt-2' key={index}>
                                    <td className='text-center'>{(currentPage - 1) * 10 + index + 1}</td>
                                    <td>
                                      {checkForPermission('ACCEL_MANAGE') && (
                                        <>
                                          <a
                                            className='pseudo-href app-primary-color'
                                            data-toggle="tooltip" data-placement="left" title={'Edit'}
                                            onClick={() => {
                                              loadClickedRegionDetails(field.tenantregion.Id.toString());
                                            }}
                                            data-bs-toggle='modal'
                                            data-bs-target='#EditTenantRegion'
                                            data-testid={`edit_tenant_region${field.tenantregion.Id}`}
                                          >
                                            <span className="material-symbols-outlined ">
                                              edit_note
                                            </span>
                                          </a>
                                          <span className=" ms-1 mb-2 custom-pointer-cursor material-symbols-outlined text-size-20 app-primary-color" onClick={() => handleConfirm(field.tenantregion.Id)}>
                                            Delete
                                          </span>
                                        </>
                                      )}
                                    </td>
                                    <td>{field.tenantregion.Code} </td>
                                    <td>
                                      <a
                                        className='pseudo-href app-primary-color'
                                        onClick={() => handleClick(field.tenantregion.Id.toString())}
                                      >
                                        {field.tenantregion.RegionName}
                                      </a>
                                    </td>
                                    <td>
                                      {field.tenantregion.TenantLocation},{field.tenantregion.RegionAddress}
                                    </td>
                                    <td>{field.tenantregion.StateName}</td>
                                    <td>{field.tenantregion.CityName}</td>
                                    <td>{field.tenantregion.Pincode}</td>
                                    <td>
                                      {field.tenantregion.IsActive == false ? (
                                        <span className='badge text-bg-warning'>InActive</span>
                                      ) : (
                                        <span className='badge text-bg-success'>Active</span>
                                      )}{' '}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div>
                            <Pagination
                              currentPage={currentPage}
                              count={totalRows}
                              itemsPerPage={perPage}
                              onPageChange={onPageChange}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className='text-muted ps-3'>{t('tenantregion_list_no_data')}</div>
                      )}
                    </div>
                    <Toaster />
                    <TenantRegionCreate />
                    <TenantRegionEdit />
                    {tenantRegionId ? <ConfirmationModal /> : ""}
                    {/* toast */}
                  </div>
                ),
              })}
          </>
        </div>
      )}
    </>
  );
};
export default TenantRegionList