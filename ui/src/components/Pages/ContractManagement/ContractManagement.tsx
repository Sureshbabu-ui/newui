import { useEffect, useState } from 'react';
import { store } from '../../../state/store';
import { useStore } from '../../../state/storeHooks';
import { ContainerPage } from '../../ContainerPage/ContainerPage';
import { Pagination } from '../../Pagination/Pagination';
import { contractDelete, getClickedContractDetails, getContractsList } from '../../../services/contracts';
import { initializeContractsList, loadContracts, changePage, setFilter, updateField, ContractsListState, loadMasterData, setAgreementTypeCode } from './ContractManagement.slice';
import { useTranslation } from 'react-i18next';
import { getValuesInMasterDataByTable } from '../../../services/masterData';
import { formatCurrency, formatDate, formatSelectInput, formatSelectInputWithCode } from '../../../helpers/formats';
import Select from 'react-select';
import { checkForPermission } from '../../../helpers/permissions';
import FeatherIcon from 'feather-icons-react';
import toast, { Toaster } from 'react-hot-toast';
import SweetAlert from 'react-bootstrap-sweetalert';
import BreadCrumb from '../../BreadCrumbs/BreadCrumb';
import ContractDashboard from './ContractDashboard/ContractDashboard';

export function ContractManagement() {
  const { t, i18n } = useTranslation();
  const {
    contractmanagement: { contracts, totalRows, perPage, currentPage, filters, searchWith, AgreementTypeCode, masterDataList, redirectedStatus },
  } = useStore(({ contractmanagement, app }) => ({ contractmanagement, app }));

  const [selectedStatus, setselectedStatus] = useState<string>(redirectedStatus)
  const [contractId, setContractId] = useState(0);

  useEffect(() => {
    if (checkForPermission("CONTRACT_VIEW")) {
      onLoad();
    }
  }, []);

  async function onLoad() {
    store.dispatch(initializeContractsList());
    try {
      var { MasterData } = await getValuesInMasterDataByTable("ContractStatus")
      const ContractStatus = await formatSelectInputWithCode(MasterData, "Name", "Id", "Code")
      ContractStatus.sort((status1, status2) => status1.value - status2.value);
      store.dispatch(loadMasterData({ name: "ContractStatus", value: { Select: ContractStatus } }));
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (checkForPermission("CONTRACT_VIEW") && selectedStatus !== "DASHBOARD") {
      onSelectChange();
    }
  }, [selectedStatus]);

  async function onSelectChange() {
    const contracts = await getContractsList(store.getState().contractmanagement.currentPage, searchWith, selectedStatus);
    store.dispatch(loadContracts(contracts));
  }

  async function onPageChange(index: number) {
    store.dispatch(changePage(index));
    const result = await getContractsList(index, searchWith, selectedStatus);
    store.dispatch(loadContracts(result));
  }

  async function filterContractsList() {
    const result = await getContractsList(store.getState().contractmanagement.currentPage, searchWith, selectedStatus, filters);
    store.dispatch(loadContracts(result));
  }

  const onUpdateField = async (ev: any) => {
    if (ev.target.value == "") {
      const result = await getContractsList(store.getState().contractmanagement.currentPage, searchWith, selectedStatus);
      store.dispatch(loadContracts(result));
    }
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof ContractsListState['filters'], value }));

  }

  const options = [
    { value: 'ContractNumber', label: 'Contract Number' },
    { value: 'CustomerName', label: 'Customer Name' },
    { value: 'ContractExpiredBetween', label: 'Contract Expired Between ' },
    { value: 'ContractBookedBetween', label: 'Contract Booked Between ' }
  ]

  const handleStatusChange = (statuscode) => {
    setselectedStatus(statuscode);
  };

  const searchFilter = async (selectedOption: any) => {
    var value = selectedOption.value
    if (value) {
      const result = await getContractsList(store.getState().contractmanagement.currentPage, searchWith, selectedStatus);
      store.dispatch(loadContracts(result));
    }
    store.dispatch(setFilter({ value }));
  }

  async function handleConfirm(ContractId: number) {
    setContractId(ContractId);
    const result = await getClickedContractDetails(ContractId);
    await store.dispatch(setAgreementTypeCode(result.ContractDetails.AgreementTypeCode))
  }

  async function handleCancel() {
    setContractId(0);
  }

  const contractDeleteMoadalDetails = [
    { text: "Customer Site", Icon: "map-pin" },
    { text: "Contract Documents", Icon: "file" },
    { text: "Bank Guarantee", Icon: "home" },
  ];

  const filteredDetails = [...contractDeleteMoadalDetails];

  if (['AGT_AMCO', 'AGT_NAMC'].includes(AgreementTypeCode)) {
    filteredDetails.push({ text: "Asset Details", Icon: "cpu" });
  } else if (['AGT_FMSO'].includes(AgreementTypeCode)) {
    filteredDetails.push({ text: "Contract Manpower", Icon: "users" });
  } else if (['AGT_AFMS', 'AGT_NFMS'].includes(AgreementTypeCode)) {
    filteredDetails.push({ text: "Contract Manpower", Icon: "users" }, { text: "Asset Details", Icon: "cpu" });
  }

  function ConfirmationModal() {
    return (
      <SweetAlert
        warning
        showCancel
        confirmBtnText='Yes, Delete!'
        cancelBtnText='Cancel'
        cancelBtnBsStyle='light'
        confirmBtnBsStyle='danger'
        title='Are you sure?'
        onConfirm={() => deleteContractDetails(contractId)}
        onCancel={handleCancel}
        focusCancelBtn
      >
        <div className='ps-2 mt-2'>
          <p className='fw-bold mt-1'>{t('contract_management_delete_confirmation_title')}</p>
          <ul className="list-unstyled">
            {filteredDetails.map((item, index) => (
              <li key={index} className='mb-1'>
                <div className="d-flex align-items-center">
                  <FeatherIcon
                    className={`border border-light bg-light pseudo-link shadow-sm text-danger`}
                    icon={`${item.Icon}`}
                    size="20"
                  />
                  <span className="ms-2 mt-1">{item.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </SweetAlert >
    );
  }

  const deleteContractDetails = async (Id: number) => {
    var result = await contractDelete(Id);
    result.match({
      ok: () => {
        setContractId(0)
        toast(i18n.t('contract_management_success_message'),
          {
            duration: 2100,
            style: {
              borderRadius: '0',
              background: '#00D26A',
              color: '#fff',
            }
          });
        onLoad()
        onSelectChange()
      },
      err: (err) => {
        toast(i18n.t('contract_management_failure_message'),
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
  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_contracts' }
  ];

  const customOrder = ['CTS_APRV', 'CTS_PNDG', 'CTS_PGRS', 'CTS_RJTD', 'CTS_EXPR', 'CTS_CLSD'];

  return <>
    <div className="my-2">
      <BreadCrumb items={breadcrumbItems} />
    </div>
    {checkForPermission("CONTRACT_VIEW") &&
      (contracts.match({
        none: () => (
          <div className='contracts m-2'>
            <ContainerPage>
              <div className='my-2'>{t('contract_management_title_loading_contracts')}</div>
            </ContainerPage>
          </div>
        ),
        some: (contracts) => (
          <div className='contracts'>
            <ContainerPage>
              <div className=' '>
                <div className='row mx-2'>
                  {/* Header */}
                  <div className='col-md-12 p-0 app-primary-color'>
                    <div className="d-flex  justify-content-end">
                      {checkForPermission("CONTRACT_CREATE") && (
                        <a href='/contracts/booking'>
                          <button className='btn app-primary-bg-color m-0 text-white my-1 float-end'>
                            {t('contract_management_button_new_contract')}
                          </button>
                        </a>
                      )}
                    </div>
                  </div>
                  {/* Header ends */}
                </div>
                {/* Section 1 ends */}
                {/* Section 2 */}
                <div className="">
                  <div className=''>
                    {checkForPermission("CONTRACT_VIEW") && (
                      <div className="nav nav-tabs border-0 ps-1 " id="nav-tab" role="tablist">
                        <button
                          role="tab"
                          className={`nav-link ${selectedStatus === 'DASHBOARD' ? 'active' : ''}`}
                          onClick={() => handleStatusChange('DASHBOARD')}
                          aria-controls="dashboard-tab"
                          id="nav-dashboard-tab"
                          type="button"
                          aria-selected={selectedStatus === 'DASHBOARD'}
                        >
                          {t('contract_management_tab_dashboard')}
                        </button>
                        {customOrder.map((code) => {
                          const option = masterDataList.ContractStatus.find((item) => item.code === code);
                          if (option) {
                            return (
                              <button
                                key={option.value}
                                className={`nav-link ${selectedStatus === option.code ? 'active' : ''}`}
                                onClick={() => handleStatusChange(option.code)}
                                role="tab"
                                aria-controls={`status-tab-${option.value}`}
                                id={`nav-${option.label}-tab`}
                                data-bs-toggle="tab"
                                data-bs-target={`#${option.label}`}
                                type="button"
                                aria-selected="true"
                              >
                                {option.label}
                              </button>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}
                  </div>
                  {selectedStatus === "DASHBOARD" ?
                    <ContractDashboard></ContractDashboard>
                    :
                    <div>
                      {/* filters */}
                      <div className="row m-2">
                        {/* column selector */}
                        <div className="col-md-4 p-0 " >
                          <Select
                            options={options}
                            onChange={searchFilter}
                            placeholder="Select Filter"
                            defaultValue={options ? options[0] : null}
                            isSearchable
                            classNamePrefix="react-select"
                          />
                        </div>
                        {/* column selector end */}
                        {/* search */}
                        <div className='col-md-7'>
                          {searchWith == "ContractExpiredBetween" || searchWith == "ContractBookedBetween" ? (
                            <div className="row m-0">
                              <div className='col-md-6'>
                                <input
                                  name='StartDate'
                                  type='date'
                                  className='form-control'
                                  value={filters.StartDate}
                                  onChange={onUpdateField}
                                />
                              </div>
                              <div className='col-md-6'>
                                <input
                                  name='EndDate'
                                  type='date'
                                  className='form-control'
                                  value={filters.EndDate}
                                  onChange={onUpdateField}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className=" ">
                              <input type='search' className="form-control col-md-6 " name="SearchText" placeholder={t('contract_management_search_placeholder') ?? ''} onChange={onUpdateField}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    filterContractsList();
                                  }
                                }} />
                            </div>
                          )}
                        </div>
                        {/* search ends */}
                        {/* search button */}
                        <div className='col-md-1 float-end  px-1 ' >
                          <button className="btn app-primary-bg-color h-100 float-end text-white" type="button" onClick={filterContractsList}>
                            Search
                          </button>
                        </div>
                        {/* search button ends */}

                      </div>
                      {/* filters end */}
                      {/* Section 2 ends */}
                      {contracts.map((field, index) => (
                        <div className="row d-flex mx-2 mb-1 py-2 bg-light">
                          <div className="col-md-2 ">
                            <div className="text-size-11 text-muted">{t('contract_management_title_contract_number')}</div>
                            <div>{field.contract.ContractNumber ? field.contract.ContractNumber : t('contract_management_contractnumber_not_generated_yet')}</div>
                          </div>
                          <div className="col-md-3 ">
                            <div className="text-size-11 text-muted">{t('contract_management_title_customer_name')}</div>
                            <div> {field.contract.CustomerName}</div>
                          </div>
                          <div className="col-md-4  ">
                            <div className='d-flex justify-content-between '>
                              <div className="  ">
                                <div className="text-size-11 text-muted">{t('contract_management_title_start_date')}</div>
                                {formatDate(field.contract.StartDate)}
                              </div>
                              <div className="  ">
                                <div className="text-size-11 text-muted">{t('contract_management_title_end_date')}</div>
                                {formatDate(field.contract.EndDate)}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2  ">
                            <div className="text-size-11 d-flex  justify-content-end text-muted">{t('contract_management_title_contract_value')}</div>
                            <div className='d-flex  justify-content-end'>{field.contract.ContractValue}</div>
                          </div>
                          <div className="col-md-1 d-flex  justify-content-end">
                            {checkForPermission("CONTRACT_VIEW") && <>
                              {selectedStatus === 'CTS_APRV' ?
                                <a className="pseudo-href app-primary-color" data-toggle="tooltip" data-placement="left" title={'View'} href={`/contracts/view/${field.contract.Id}?Tab=DETAILS`}>
                                  <FeatherIcon icon={"eye"} size="16" />
                                </a>
                                :
                                <a className="pseudo-href app-primary-color ps-2" data-toggle="tooltip" data-placement="left" title={'View'} href={`/contracts/view/${field.contract.Id}?Tab=DETAILS`}>
                                  <FeatherIcon icon={"eye"} size="16" />
                                </a>
                              }
                            </>}
                            {
                              checkForPermission("CONTRACT_CREATE") && process.env.REACT_APP_CONTRACT_EDIT_STATUSES?.includes(selectedStatus.toString()) &&
                              (
                                <a className="pseudo-href app-primary-color ps-2" data-toggle="tooltip" data-placement="left" title="Edit" href={`/contracts/edit/${field.contract.Id}`}>
                                  <FeatherIcon icon="edit" size="16" />
                                </a>
                              )
                            }
                            {field.contract.CreatedBy == store.getState().app.user.unwrap().user[0].Id && selectedStatus === 'CTS_PGRS' && (
                              <a className="pseudo-href app-primary-color ps-2 pe-0" data-toggle="tooltip"
                                data-placement="left" title={'Delete'}
                                onClick={() => handleConfirm(field.contract.Id)}>
                                <FeatherIcon icon={"trash-2"} size="16" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                      {/* Pagination */}
                      <div className='row m-0'>
                        <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                      </div>
                      {/* Pagination ends */}
                    </div>
                  }

                </div>
              </div>
            </ContainerPage >
          </div >
        )
      }))
    }
    {contractId ? <ConfirmationModal /> : ""}
    <Toaster />
  </>
}