import { dispatchOnCall, store } from '../../../../../../state/store';
import { ContainerPage } from '../../../../../ContainerPage/ContainerPage';
import { useStoreWithInitializer } from '../../../../../../state/storeHooks';
import { useEffect } from 'react';
import { initializeProductCategoryDetails, loadProductCategoryDetails } from './Details.slice';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getProductCategoryDetails } from '../../../../../../services/assetProductCategory';
import { formatDateTime } from '../../../../../../helpers/formats';
import { checkForPermission } from '../../../../../../helpers/permissions';
import BreadCrumb from '../../../../../BreadCrumbs/BreadCrumb';

export function ProductCategoryDetails() {
  const { t } = useTranslation();
  const { singleproductcategory } = useStoreWithInitializer(
    ({ productcategorydetails }) => productcategorydetails,
    dispatchOnCall(initializeProductCategoryDetails())
  );

  const { PCId } = useParams<{ PCId: string }>();

  useEffect(() => {
    if(checkForPermission('ASSETPRODUCTCATEGORY_VIEW'))
    onLoad(PCId);
  }, [PCId]);
  const breadcrumbItems = [
    { Text: 'breadcrumbs_home', Link: '/' },
    { Text: 'breadcrumbs_masters', Link: '/config/masters' },
    { Text: 'breadcrumbs_masters_assetproduct_category', Link: '/config/masters/assetproductcategory' },
    { Text: 'breadcrumbs_masters_product_category_details' }
  ];

  return (
    <ContainerPage>
      <BreadCrumb items={breadcrumbItems} />
      <h5 className='mt-2'>{t('productcategorydetails_heading')}</h5>
      <div className='row'>
        {checkForPermission('ASSETPRODUCTCATEGORY_VIEW') && <>
          <div className='col-md-6'>
            <div className='row pt-2'>
              <label className='form-text'>{t('productcategorydetails_label_code')}</label>
              <div>{singleproductcategory.Code}</div>
            </div>
            <div className='row pt-2'>
              <label className='form-text'>{t('productcategorydetails_label_categoryname')}</label>
              <div>{singleproductcategory.CategoryName}</div>
            </div>
            <div className='row pt-2'>
              <label className='form-text'>{t('productcategorydetails_label_partproductcategory')}</label>
              <div>{singleproductcategory.PartProductCategory}</div>
            </div>
            <div className='row pt-2'>
              <label className='form-text'>{t('productcategorydetails_label_generalnotcovered')}</label>
              <div>{singleproductcategory.GeneralNotCovered}</div>
            </div>
            <div className='row pt-2'>
              <label className='form-text'>{t('productcategorydetails_label_softwarenotcovered')}</label>
              <div>{singleproductcategory.SoftwareNotCovered}</div>
            </div>  <div className='row pt-2'>
              <label className='form-text'>{t('productcategorydetails_label_hardwarenotcovered')}</label>
              <div>{singleproductcategory.HardwareNotCovered}</div>
            </div>
          </div>
        </>}
      </div>
    </ContainerPage>
  );
}

async function onLoad(PCId: string) {
  store.dispatch(initializeProductCategoryDetails());
  try {
    const result = await getProductCategoryDetails(PCId);
    store.dispatch(loadProductCategoryDetails(result.ProductCategoryDetails));
  } catch (error) {
    console.error(error);
  }
}
