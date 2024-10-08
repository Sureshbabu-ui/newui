import { store } from '../../../../../state/store';
import { useStore, useStoreWithInitializer } from '../../../../../state/storeHooks';
import SweetAlert from 'react-bootstrap-sweetalert';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import React, { useEffect, useState, useRef } from 'react';
import {
  initializeManPowerAlloctaionUpdate,
  EditManPowerAllocationState,
  startSubmitting,
  stopSubmitting,
  toggleInformationModalStatus,
  updateField,
  loadServiceEngineers,
} from './EditManPowerAllocation.slice';
import { useTranslation } from 'react-i18next';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import { formatSelectInput } from '../../../../../helpers/formats';
import { loadCustomerSite, loadMasterData } from './EditManPowerAllocation.slice';
import { getContractCustomerSites } from '../../../../../services/customer';
import { getValuesInMasterDataByTable } from '../../../../../services/masterData';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { getEngineersNames } from '../../../../../services/assignEngineer';
import { ManpowerAllocationDetails } from '../../../../../types/contractmanpowerallocation';
import { editManpowerAllocation, getManPowerAllocationList } from '../../../../../services/contractmanowerallocation';
import { loadManPowerAllocations } from './ManPowerAllocationList.slice';

export function EditManPowerAllocation() {
  const { t, i18n } = useTranslation();
  const modalRef = useRef<HTMLButtonElement>(null);
  const { editmanpowerallocation: { manpowerallocation, displayInformationModal, CustomerSites, EngineersList, masterDataList, errors }, manpowerallocation: { visibleModal } } = useStore(
    ({ editmanpowerallocation, manpowerallocation }) => ({ editmanpowerallocation, manpowerallocation })
  );
  const [selectEngineersList, setEngineersList] = useState<any>(null)
  const MODAL_NAME = "editManpowerAllocation"
  useEffect(() => {
    setEngineersList(formatSelectInput(EngineersList, "FullName", "Id",));
  }, [EngineersList])

  const [selectCustomerSiteIdList, setSelectCustomerSiteIdList] = useState<any>(null)

  useEffect(() => {
    setSelectCustomerSiteIdList(formatSelectInput(CustomerSites, "SiteName", "Id"))
  }, [CustomerSites])

  const { ContractId } = useParams<{ ContractId: string }>();
  useEffect(() => {
    GetMasterDataItems()
  }, [ContractId && visibleModal == MODAL_NAME]);

  function onSelectChange(selectedOption: any, actionMeta: any) {
    const name = actionMeta.name;
    const value = selectedOption.value;
    store.dispatch(updateField({ name: name as keyof EditManPowerAllocationState['manpowerallocation'], value }));
  }

  const onModalClose = () => {
    store.dispatch(initializeManPowerAlloctaionUpdate())
  }

  return (
    <div
      className="modal fade px-0"
      id="editManpowerAllocation"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header mx-3">
            <h5 className="modal-title app-primary-color">{t('manpowerallocation_edit_modal_title')}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              id="closeeditManpowerAllocation"
              onClick={onModalClose}
              ref={modalRef}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="manpower">
              <ContainerPage>
                <div className="col-md-12" >
                  <div className="mb-1">
                    <label className='red-asterisk'>{t('manpowerallocation_edit_label_customer_site')}</label>
                    <Select
                      options={selectCustomerSiteIdList}
                      onChange={onSelectChange}
                      value={selectCustomerSiteIdList && selectCustomerSiteIdList.find(option => option.value === manpowerallocation.CustomerSiteId)}
                      isSearchable
                      name="CustomerSiteId"
                      placeholder="Select option"
                    />
                  </div>
                  <div className="mb-1 mt-2">
                    <label className='red-asterisk'>{t('manpowerallocation_edit_label_employee_name')}</label>
                    <Select
                      options={selectEngineersList}
                      onChange={onSelectChange}
                      value={selectEngineersList && selectEngineersList.find(option => option.value === manpowerallocation.EmployeeId)}
                      isSearchable
                      name="EmployeeId"
                      placeholder="Select option"
                    />
                  </div>
                  <div className="mb-1 mt-2">
                    <label className='red-asterisk'>{t('manpowerallocation_edit_label_allocation_status')}</label>
                    <Select
                      options={masterDataList.ManpowerAllocationStatus}
                      onChange={onSelectChange}
                      value={masterDataList.ManpowerAllocationStatus && masterDataList.ManpowerAllocationStatus.find(option => option.value === manpowerallocation.AllocationStatusId)}
                      isSearchable
                      name="AllocationStatusId"
                      placeholder="Select option"
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-2">
                      <label className='red-asterisk'>{t('manpowerallocation_edit_label_customer_agreed_amount')}</label>
                      <input name="CustomerAgreedAmount" value={manpowerallocation.CustomerAgreedAmount} onChange={onUpdateField} type="text" className="form-control" ></input>
                    </div>
                  </div>
                  <div className="mb-1">
                    <label>{t('manpowerallocation_edit_label_startdate')}</label>
                    <input type="date" name="StartDate" value={manpowerallocation.StartDate ? manpowerallocation.StartDate.split('T')[0] : ""} onChange={onUpdateField} className="form-control"></input>
                  </div>
                  <div className="mb-1">
                    <label>{t('manpowerallocation_edit_label_enddate')}</label>
                    <input type="date" name="EndDate" value={manpowerallocation.EndDate ? manpowerallocation.EndDate.split('T')[0] : ""} onChange={onUpdateField} className="form-control"></input>
                  </div>
                  <div className="row">
                    <div className="col-md-12 mt-2">
                      <label className='red-asterisk'>{t('manpowerallocation_edit_label_budgeted_amount')}</label>
                      <input name="BudgetedAmount" value={manpowerallocation.BudgetedAmount} onChange={onUpdateField} type="number" className="form-control" ></input>
                    </div>
                    <div className="col-md-12 mt-2">
                      <label>{t('manpowerallocation_edit_label_remarks')}</label>
                      <textarea name="Remarks" value={manpowerallocation.Remarks == null ? "" : manpowerallocation.Remarks} onChange={onUpdateField} className="form-control" ></textarea>
                    </div>
                  </div>
                  <button type="button" onClick={onSubmit(manpowerallocation)} className="btn app-primary-bg-color text-white mt-2">{t('manpowerallocation_edit_button')}</button><div>    <br></br></div>
                  {/* Create manpower form ends here */}
                  {displayInformationModal ? <InformationModal /> : ""}
                </div>
              </ContainerPage>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function onUpdateField(ev: any) {
    var name = ev.target.name
    var value = ev.target.value
    store.dispatch(updateField({ name: name as keyof EditManPowerAllocationState["manpowerallocation"], value }));

  }
  async function GetMasterDataItems() {
    store.dispatch(initializeManPowerAlloctaionUpdate());
    store.dispatch(updateField({ name: "ContractId", value: ContractId }));
    if (visibleModal == MODAL_NAME) {
      try {
        const Customers = await getContractCustomerSites(store.getState().manpoweredit.manpowersummary.ContractId.toString());
        store.dispatch(loadCustomerSite(Customers));

        const ServiceEngineers = await getEngineersNames();
        store.dispatch(loadServiceEngineers(ServiceEngineers));

        var { MasterData } = await getValuesInMasterDataByTable("ManpowerAllocationStatus")
        const ManpowerAllocationStatus = await formatSelectInput(MasterData, "Name", "Id")
        store.dispatch(loadMasterData({ name: "ManpowerAllocationStatus", value: { Select: ManpowerAllocationStatus } }));

      } catch (error) {
        console.error(error);
      }
    }
  }

  function onSubmit(manpower: ManpowerAllocationDetails) {

    return async (ev: React.FormEvent) => {
      ev.preventDefault();
      store.dispatch(startPreloader())
      store.dispatch(startSubmitting());
      const result = await editManpowerAllocation(store.getState().editmanpowerallocation.manpowerallocation);
      // call API
      store.dispatch(stopSubmitting());
      result.match({
        ok: () => {
          store.dispatch(toggleInformationModalStatus());
        },
        err: (e) => {
        },
      });
      store.dispatch(stopPreloader())
    };
  }

  function InformationModal() {
    const { t, i18n } = useTranslation();
    return (
      <SweetAlert success title="Success" onConfirm={reDirectRoute}>
        {t('manpowerallocation_edit_alert_success_message')}
      </SweetAlert>
    );
  }

  async function reDirectRoute() {
    store.dispatch(toggleInformationModalStatus());
    document.getElementById("closeeditManpowerAllocation")?.click();
    const result = await getManPowerAllocationList("", 1, ContractId);
    store.dispatch(loadManPowerAllocations(result));
    modalRef.current?.click()
  }
} 