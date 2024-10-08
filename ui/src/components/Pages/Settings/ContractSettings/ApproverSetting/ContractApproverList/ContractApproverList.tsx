import { useTranslation } from 'react-i18next';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { store } from '../../../../../../state/store';
import { changePage, initializeApproverList, loadApproverDetails, setSearch } from './ContractApproverList.slice';
import { Pagination } from '../../../../../Pagination/Pagination';
import { startPreloader, stopPreloader } from '../../../../../Preloader/Preloader.slice';
import {
  getContractApproverList,
  getContractApproverUpdateDetails,
} from '../../../../../../services/contractApproverSetting';
import { ContractApproverEdit } from '../ContractApproverEdit/ContractApproverEdit';
import { ContractApproverCreate } from '../ContractApproverCreate/ContractApproverCreate';
import NoRecordFoundSvg from '../../../../../../svgs/NoRecordFound.svg';
import { loadApproverEditDetails } from '../ContractApproverEdit/ContractApproverEdit.slice';
import FeatherIcon from 'feather-icons-react';
import { updateField } from '../ContractApproverCreate/ContractApproverCreate.slice';

const ContractApproverList = () => {
  const { t } = useTranslation();

  const onLoad = async () => {
    store.dispatch(startPreloader());
    store.dispatch(initializeApproverList());
    try {
      const ApproverList = await getContractApproverList(search, currentPage);
      store.dispatch(loadApproverDetails(ApproverList));
    } catch (error) {
      console.error(error);
    }
    store.dispatch(stopPreloader());
  };

  const { approverDetails, totalRows, perPage, currentPage, search } = useStoreWithInitializer(
    ({ contractapproverlist }) => contractapproverlist,
    onLoad
  );

  const onPageChange = async (index: number) => {
    store.dispatch(changePage(index));
    try {
      const ApproverList = await getContractApproverList(store.getState().contractapproverlist.search, index);
      store.dispatch(loadApproverDetails(ApproverList));
    } catch (error) {
      console.log(error);
    }
  };

  async function filterApproverList() {
    store.dispatch(changePage(1));
    try {
      const approverList = await getContractApproverList(store.getState().contractapproverlist.search, 1);
      store.dispatch(loadApproverDetails(approverList));
    } catch (error) {
      console.log(error);
    }
  }

  const addData = async (event: any) => {
    store.dispatch(setSearch(event.target.value));
    if (event.target.value == '') {
      try {
        const approverList = await getContractApproverList(
          store.getState().contractapproverlist.search,
          store.getState().contractapproverlist.currentPage
        );
        store.dispatch(loadApproverDetails(approverList));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const loadClickedEditDetails = async (ApprovalFlowId: number | null) => {
    try {
      const { ApproverUpdateDetails } = await getContractApproverUpdateDetails(ApprovalFlowId);
      store.dispatch(loadApproverEditDetails(ApproverUpdateDetails));
    } catch (error) {
      console.log(error);
    }
  };
  const loadClickedCreateDetails = async (ApprovalFlowId: number) => {
    store.dispatch(updateField({ name: 'TenantOfficeId', value: ApprovalFlowId }));
  };

  return (
    <>
      {approverDetails.match({
        none: () => <>{t('contractapprover_list_loading')}</>,
        some: (approverDetails) => (
          <div className=''>
            <div className='mb-3 ps-1'>
              <div className='input-group'>
                <input
                  type='search'
                  className='form-control custom-input'
                  value={search}
                  placeholder={t('contractapprover_list_placeholder_search') ?? ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      filterApproverList();
                    }
                  }}
                  onChange={addData}
                />
                <button
                  className='btn app-primary-bg-color text-white float-end '
                  type='button'
                  onClick={filterApproverList}
                >
                  {t('contractapprover_list_button_search')}
                </button>
              </div>
            </div>
            <div className='row mt-3 ps-1'>
              {approverDetails.length > 0 ? (
                <div className=' table-responsive '>
                  <table className='table table-hover table-bordered '>
                    <thead>
                      <tr>
                        <th scope='col'>{t('contractapprover_list_th_sl_no')}</th>
                        <th scope='col'>{t('contractapprover_list_th_accel_location')}</th>
                        <th scope='col'>{t('contractapprover_list_th_firstapprover')}</th>
                        <th scope='col'>{t('contractapprover_list_th_secondapprover')}</th>
                        <th scope='col'>{t('contractapprover_list_th_renewalfirstapprover')}</th>
                        <th scope='col'>{t('contractapprover_list_th_renewalsecondapprover')}</th>
                        <th scope='col'>{t('contractapprover_list_th_action')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approverDetails.map((field, index) => (
                        <tr className='mt-2'>
                          <th scope='row'>{(currentPage - 1) * 10 + (index + 1)}</th>
                          <td>{field.AccelLocation} </td>
                          <td>{field.FirstApprover}</td>
                          <td>{field.SecondApprover}</td>
                          <td>{field.RenewalFirstApprover}</td>
                          <td>{field.RenewalSecondApprover}</td>
                          <td>
                            <>
                              {!field.FirstApprover &&
                                !field.SecondApprover &&
                                !field.RenewalFirstApprover &&
                                !field.RenewalSecondApprover && (
                                  <a
                                    className='pseudo-href app-primary-color'
                                    onClick={() => loadClickedCreateDetails(field.Id)}
                                    data-toggle='tooltip'
                                    data-placement='left'
                                    title={'Add'}
                                    data-bs-toggle='modal'
                                    data-bs-target='#CreateApprover'
                                  >
                                    <FeatherIcon icon={'plus-square'} size='16' />
                                  </a>
                                )}
                            </>
                            <>
                              {((field.FirstApprover) ||
                                (!field.FirstApprover)) &&
                                (field.SecondApprover && field.RenewalFirstApprover && field.RenewalSecondApprover) && (
                                  <a
                                    className='pseudo-href app-primary-color'
                                    data-toggle='tooltip'
                                    data-placement='left'
                                    title={'Edit'}
                                    onClick={() => loadClickedEditDetails(field.ApprovalFlowId)}
                                    data-bs-toggle='modal'
                                    data-bs-target='#EditApprover'
                                  >
                                    <FeatherIcon icon={'edit'} size='16' />
                                  </a>
                                )}
                            </>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Pagination
                    currentPage={currentPage}
                    count={totalRows}
                    itemsPerPage={perPage}
                    onPageChange={onPageChange}
                  />
                </div>
              ) : (
                <div className='text-center mt-2'>
                  <img src={NoRecordFoundSvg} width='50' />
                  <div className='small text-muted mt-1'>{t('contractapproverlist_no_data')}</div>
                </div>
              )}
            </div>
            <ContractApproverEdit />
            <ContractApproverCreate />
          </div>
        ),
      })}
    </>
  );
};
export default ContractApproverList;
