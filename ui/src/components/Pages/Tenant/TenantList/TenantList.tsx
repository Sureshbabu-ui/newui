import { ContainerPage } from "../../../ContainerPage/ContainerPage"
import { useTranslation } from 'react-i18next';
import { Tenant } from "../TenantCreate/TenantCreate";
import { useStore } from '../../../../state/storeHooks';
import { store } from '../../../../state/store';
import { useEffect } from "react";
import { changePage, initializeTenantsList, loadTenants, setSearch } from "./TenantList.slice";
import { Pagination } from "../../../Pagination/Pagination";
import { getTenantList } from "../../../../services/tenant";
import { formatDateTime } from "../../../../helpers/formats";

export const TenantManagement = () => {
  const { t, i18n } = useTranslation();
  const {
    tenantlist: { tenants, totalRows, perPage, currentPage, search },
  } = useStore(({ tenantlist }) => ({ tenantlist }));

  useEffect(() => {
    onLoad();
  }, [null]);

  return (
    <ContainerPage>
      <div className="row m-0">
        <div className="d-flex justify-content-between ps-0 pe-0  ms-0 mt-4 ">
          <div className="col-md-7 ps-2">
            <h5 className=" pt-1 ms-0 app-primary-color">{t('tenantmanagement_title_tenant_management')}</h5>
          </div>
          <div className="col-md-4 pe-2">
            {/* TODOS commented for the time being */}
            {/* <button className="btn app-primary-bg-color text-white float-end" data-bs-toggle="modal" data-bs-target="#createNewTenent">
              {t('tenant_create_button_create_tenant')}
            </button> */}
          </div>
        </div>
        <div className="mb-1 mt-3 ps-2 pe-2">
          <div className="input-group">
            <input type='search' className="form-control custom-input" value={search} placeholder={t('tenant_management_search_placeholder') ?? ''} onChange={addData}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  filterTenantList(e);
                }
              }} />
            <button className="btn app-primary-bg-color text-white float-end " type="button" onClick={filterTenantList}>
              Search
            </button>
          </div>
        </div>
        <CreateNewTenant />
      </div>
      {tenants.match({
        none: () =>
          <div className="row m-2 ps-3 mt-2 text-muted">{t('tenant_management_loading_tenants')}</div>,
        some: (tenants) =>
          <div className="row m-0">
            <div className="row m-0 pe-2 ps-2 ms-0 mt-3">
              {tenants.length > 0 ? (
                <table className="table table-bordered ">
                  <thead>
                    <tr>
                      <th scope="col">{t('tenant_management_header_th_sl_no')}</th>
                      <th scope="col">{t('tenant_management_header_name_table')}</th>
                      <th scope="col">{t('tenant_management_header_name_on_print_table')}</th>
                      <th scope="col">{t('tenant_management_header_isVerified_table')}</th>
                      <th scope="col">{t('tenant_management_header_CreatedOn_table')}</th>
                      <th scope="col">{t('manpowermanagement_header_actions_table')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map((field, index) => (
                      <tr>
                        <th scope="row">{(currentPage - 1) * 10 + (index + 1)}</th>
                        <td>{field.tenant.Name}</td>
                        <td>{field.tenant.NameOnPrint}</td>
                        <td>{field.tenant.IsVerified == "true" ? "Verified":"Not Verified"}</td>
                        <td>{formatDateTime(field.tenant.CreatedOn)}</td> 
                        <td>
                        <a className="pseudo-href app-primary-color" href={`/config/companyinfo/${field.tenant.Id}`}>
                        {t('tenant_management_hyperlink_view')}
                          </a>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-muted p-0">{t('tenantmanagement_no_tenant_data_found')}</div>
              )}
            </div>
            <div className="row m-0 pe-0 ps-0 ms-0 mt-4">
              <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
            </div>
          </div>
      })}
    </ContainerPage>
  );
}

function CreateNewTenant() {
  const { t, i18n } = useTranslation();
  return (
    <div
      className="modal fade"
      id="createNewTenent"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title app-primary-color mx-2"> {t('tenant_create__title_add_tenant')}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="closeCreateUserModal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <Tenant />
          </div>
        </div>
      </div>
    </div>
  );
}

 const onLoad =async() =>{
  store.dispatch(initializeTenantsList());
  try {
    const currentPage = store.getState().tenantlist.currentPage;
    const searchKey = store.getState().tenantlist.search;
    const tenants = await getTenantList(currentPage, searchKey);
    store.dispatch(loadTenants(tenants));
  } catch (error) {
    console.error(error);
  }
}

 const onPageChange=async(index: number) =>{
  store.dispatch(changePage(index));
  const searchKey = store.getState().tenantlist.search;
  const tenants = await getTenantList(index, searchKey);
  store.dispatch(loadTenants(tenants));
}

async function filterTenantList(event: any) {
  const tenants = await getTenantList(store.getState().tenantlist.currentPage, store.getState().tenantlist.search);
  store.dispatch(loadTenants(tenants));
}
const addData = async (event: any) => {
  store.dispatch(setSearch(event.target.value));
  if (event.target.value == "") {
    const result = await getTenantList(store.getState().tenantlist.currentPage, store.getState().tenantlist.search);
    store.dispatch(loadTenants(result));
  }
}
