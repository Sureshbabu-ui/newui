import { useEffect } from 'react';
import { loadAssetDetails, initializeAssetDetailsForCallCordinator } from './AssetDetails.slice';
import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../../../../../helpers/permissions';
import { dispatchOnCall, store } from '../../../../../../../state/store';
import { useStoreWithInitializer } from '../../../../../../../state/storeHooks';
import { getAssetDetailsForCallCordiantor } from '../../../../../../../services/serviceRequest';
import { formatDate } from '../../../../../../../helpers/formats';
import { PartsExclusions } from '../../../../../../PartsExclusions/PartsExclusions';

const AssetDetails = () => {
  const { t } = useTranslation();
  const { assetDetails } = useStoreWithInitializer(
    ({ assetdetailsforcallcordinator }) => assetdetailsforcallcordinator,
    dispatchOnCall(initializeAssetDetailsForCallCordinator())
  );
  const ServiceRequestId = store.getState().callcordinatormanagement.serviceRequestId;

  useEffect(() => {
    if (ServiceRequestId) {
      onLoad(ServiceRequestId);
    }
  }, [ServiceRequestId]);

  const onLoad = async (ServiceRequestId: number) => {
    store.dispatch(initializeAssetDetailsForCallCordinator());
    try {
      const result = await getAssetDetailsForCallCordiantor(ServiceRequestId);
      store.dispatch(loadAssetDetails(result));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {/* Asset Details Start */}
      <h6 className='mt-4 fw-bold app-primary-color'>{t('callcordinator_assetdetails_title_assetdetails')}</h6>
      <div className="row">
        {/* col-1 */}
        <div className="col-md-4">
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_categoryname')}</label>
            <div >{assetDetails.CategoryName}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_slno')}</label>
            <div >{assetDetails.ProductSerialNumber}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_isvipasset')}</label>
            <div >{assetDetails.IsVipProduct ? t('callcordinator_assetdetails_yes') : t('callcordinator_assetdetails_no')}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_assetcondition')}</label>
            <div >{assetDetails.ProductCondition}</div>
          </div>
        </div>

        {/* col-2 */}
        <div className="col-md-4">
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_make')}</label>
            <div >{assetDetails.Make}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_accelassetid')}</label>
            <div >{assetDetails.MspAssetId ? assetDetails.MspAssetId : "---"}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_isenterpriseasset')}</label>
            <div >{assetDetails.IsEnterpriseProduct ? t('callcordinator_assetdetails_yes') : t('callcordinator_assetdetails_no')}</div>
          </div>
        </div>

        {/* col-3 */}
        <div className="col-md-4">
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_model')}</label>
            <div>{assetDetails.ModelName}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_warrantyenddate')}</label>
            <div className='pre-line'>{assetDetails.WarrantyEndDate ? formatDate(assetDetails.WarrantyEndDate) : "---"}</div>
          </div>
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_isoutsourcingneeded')}</label>
            <div >{assetDetails.IsOutSourcingNeeded ? t('callcordinator_assetdetails_yes') : t('callcordinator_assetdetails_no')}</div>
          </div>
        </div>
      </div>

      {/* SLA Details Start */}
      <h6 className='mt-4 fw-bold app-primary-color'>{t('callcordinator_assetdetails_title_sladeatils')}</h6>
      <div className="row">
        {/* col-1*/}
        <div className="col-md-4">
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_responsetimeinhours')}</label>
            <div className='text-break'>{assetDetails.ResponseTimeInHours}</div>
          </div>
        </div>

        {/* col-2*/}
        <div className="col-md-4">
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_resolutiontimeinhours')}</label>
            <div >{assetDetails.ResolutionTimeInHours}</div>
          </div>
        </div>

        {/* col-3*/}
        <div className="col-md-4">
          <div className="pt-2">
            <label className="form-text">{t('callcordinator_assetdetails_standbytimeinhours')}</label>
            <div >{assetDetails.StandByTimeInHours}</div>
          </div>
        </div>
      </div>

      {/* Exclusion Details */}
      {assetDetails.ProductCategoryId && assetDetails.ContractId && (
        <div className="mb-2">
          <h6 className='mt-3 fw-bold app-primary-color'>{t('callcordinator_assetdetails_title_exclusion')}</h6>
          <PartsExclusions ProductCategoryId={assetDetails.ProductCategoryId} ContractId={assetDetails.ContractId} ProductCategoryName={assetDetails.CategoryName} />
        </div>
      )}
    </>
  );
}

export default AssetDetails