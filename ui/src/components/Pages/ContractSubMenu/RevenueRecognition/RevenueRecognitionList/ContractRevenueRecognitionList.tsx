import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../../../state/storeHooks';
import { ContainerPage } from '../../../../ContainerPage/ContainerPage';
import { store } from '../../../../../state/store';
import { startPreloader, stopPreloader } from '../../../../Preloader/Preloader.slice';
import {
  formatCurrency,
} from '../../../../../helpers/formats';
import { useParams } from 'react-router-dom';

import { checkForPermission } from '../../../../../helpers/permissions';
import { ContractRevenueRecognitionListState, initializeRevenueRecognitionList, loadContractRevenueRecognition, updateError, updateField } from './ContractRevenueRecognitionList.slice';
import { getRevenueRecognitionListByContract } from '../../../../../services/revenueRecognition';

const ContractRevenueRecognitionList = () => {
  const { t } = useTranslation();
  const { ContractId } = useParams<{ ContractId: string }>();
  const {
    contractrevenuerecognitionlist: { revenueRecognitionList, filters, error },
  } = useStore(({ contractrevenuerecognitionlist }) => ({ contractrevenuerecognitionlist }));

  useEffect(() => {
    if(checkForPermission('REVENUERECOGNITION_LIST'))
    {
          onLoad();
    }
  }, []);

  const getFilteredRevenueRecognitionList = async () => {
    store.dispatch(updateError(null))
    if (filters.StartDate && filters.EndDate && (new Date(filters.StartDate) <= new Date(filters.EndDate))) {
      try {
        const ContractInvoiceSchedules = await getRevenueRecognitionListByContract(ContractId, filters);
        store.dispatch(loadContractRevenueRecognition(ContractInvoiceSchedules));
      } catch (error) {
        store.dispatch(loadContractRevenueRecognition({ RevenueRecognitionList: [] }))
      }
      store.dispatch(stopPreloader());
    }

    else {
      store.dispatch(loadContractRevenueRecognition({ RevenueRecognitionList: [] }))
      store.dispatch(updateError("contractrevenuerecognitionlist_error_enter_validperiod"))
    }
  }

  const onLoad = async () => {
       store.dispatch(startPreloader());
      store.dispatch(initializeRevenueRecognitionList());
      try {
        const ContractInvoiceSchedules = await getRevenueRecognitionListByContract(ContractId);
        store.dispatch(loadContractRevenueRecognition(ContractInvoiceSchedules));
      } catch (error) {
        store.dispatch(loadContractRevenueRecognition({ RevenueRecognitionList: [] }))
      }
      store.dispatch(stopPreloader());
  };

  const onUpdateField = async (ev: any) => {
    var name = ev.target.name;
    var value = ev.target.value;
    store.dispatch(updateField({ name: name as keyof ContractRevenueRecognitionListState['filters'], value }));
  }

  return (
    <ContainerPage>
      <>{checkForPermission('REVENUERECOGNITION_LIST') &&
        <div>
          {revenueRecognitionList.match({
            none: () => <>{t('contractrevenuerecognitionlist_loading')}</>,
            some: (RevenueRecognition) => (
              <div className='ps-3  mt-3'>
                <div className='row mt-1 mb-3 p-0 '>
                  {RevenueRecognition.length > 0 && (
                    <div className='col-md-9 app-primary-color '>
                      <h5 className='ms-0 ps-1'> {t('contractrevenuerecognitionlist_title')}</h5>
                    </div>
                  )}
                </div>
                <div className="row m-0">
                  <div className='col-md-5  ps-0'>
                    <input
                      name='StartDate'
                      type='date'
                      className='form-control '
                      value={filters.StartDate ?? ''}
                      onChange={onUpdateField}
                    />
                  </div>
                  <div className='col-md-5 pe-0'>
                    <input
                      name='EndDate'
                      type='date'
                      className='form-control '
                      value={filters.EndDate ?? ''}
                      onChange={onUpdateField}
                    />
                  </div>
                  <div className="col-md-2 pe-0">
                    <button className="btn app-primary-bg-color text-white float-end w-100" type="button" onClick={getFilteredRevenueRecognitionList}>
                      {t('contractrevenuerecognitionlist_button_search')}
                    </button>
                  </div>
                  {error && <div className="col md-12 text-danger my-4 px-0">
                    {t(error)}
                  </div>}
                </div>
                <div className='row mt-3 '>
                  {RevenueRecognition.length > 0 ? (
                    <div className=' table-responsive '>
                      <table className='table table-hover text-nowrap table-bordered '>
                        <thead>
                          <tr>
                            <th scope='col'>{t('contractrevenuerecognitionlist_header_location')} </th>
                            <th scope='col' className="text-end">{t('contractrevenuerecognitionlist_header_amcvalue')}</th>
                            <th scope='col' className="text-end">{t('contractrevenuerecognitionlist_header_fmsvalue')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {RevenueRecognition.map((field, index) => (
                            <tr>
                              <td>{field.revenueRecognitionList.OfficeName}</td>
                              <td className="text-end">{formatCurrency(field.revenueRecognitionList.AmcValue)}</td>
                              <td className="text-end"> {formatCurrency(field.revenueRecognitionList.ManPowerValue)}</td>
                            </tr>
                          )
                          )}
                          <tr>
                            <td></td>
                            <td className="text-end">{formatCurrency(RevenueRecognition.reduce((total: number, item) => total + Number(item.revenueRecognitionList.AmcValue), 0))}</td>
                            <td className="text-end">{formatCurrency(RevenueRecognition.reduce((total: number, item) => total + Number(item.revenueRecognitionList.ManPowerValue), 0))}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <>
                    </>
                  )}
                </div>
              </div>
            ),
          })}
        </div>
      }
      </>
    </ContainerPage>
  );
};

export default ContractRevenueRecognitionList