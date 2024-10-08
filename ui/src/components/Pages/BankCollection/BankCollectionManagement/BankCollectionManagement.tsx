import { useEffect } from 'react';
import { store } from '../../../../state/store';
import { useStore } from '../../../../state/storeHooks';
import { ContainerPage } from '../../../ContainerPage/ContainerPage';
import { useTranslation } from 'react-i18next';
import { checkForPermission } from '../../../../helpers/permissions';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import { initializeBankCollectionsList, loadCollectionDashboardDetail } from './BankCollectionManagement.slice';
import { getBankCollectionDashboardDetail } from '../../../../services/bankCollection';
import { BankCollectionUploadExcel } from './BankCollectionUploadExcel/BankCollectionUploadExcel';
import { useHistory } from 'react-router-dom';
import { formatCurrency } from '../../../../helpers/formats';
import { ChequeExcelUpload } from './ChequeExcelUpload/ChequeExcelUpload';

export const BankCollectionManagement = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const {
        bankcollectionmanagement: { bankCollectionDashboardDetail },
    } = useStore(({ bankcollectionmanagement, app }) => ({ bankcollectionmanagement, app }));

    useEffect(() => {
        if (checkForPermission("BANKCOLLECTION_LIST")) {
            onLoad();
        }
    }, [null]);
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_manage_bankcollection' }
    ];

    const onLoad = async () => {
        store.dispatch(initializeBankCollectionsList());
        try {
            const result = await getBankCollectionDashboardDetail()
            store.dispatch(loadCollectionDashboardDetail(result))

        } catch (error) {
            console.error(error);
        }
    }
    const handleListRecords = (ev: any) => {
        history.push(`/finance/collections/${ev.target.value}`)
    }
    const fileName = "BankCollectionSampleUpload";
    return <>
        <BreadCrumb items={breadcrumbItems} />

        {checkForPermission("BANKCOLLECTION_UPLOAD") &&
            <div className="px-2">
                {checkForPermission("BANKCOLLECTION_UPLOAD") && <>
                    <ContainerPage>
                        <div className="mb-2 ">
                            {/* Table */}
                            <div className="row h-100 m-3">
                                {/* raw collection data */}
                                <div className='col-md-4 p-0 pe-2 pb-2'>
                                    <div className='bg-light h-100 p-2'>
                                        <h3 className='fw-bold mb-0'>{bankCollectionDashboardDetail.PendingCollectionCount}</h3>
                                        <div className="text-muted mb-4"><small>{t('bankcollectionmanagement_pendingcard_message')}</small></div>
                                        <small className="fw-bold ">{t('bankcollectionmanagement_inr')}</small> <h3 className='fw-bold mb-0'>{formatCurrency(bankCollectionDashboardDetail.PendingCollectionAmount)}</h3>
                                        <div className="text-muted mb-2"><small>{t('bankcollectionmanagement_pendingcard_message2')}</small></div>
                                        {/*  */}
                                        <div className="row m-0 mt-3">
                                            <div className='col-md-8 p-0' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <button className="btn btn-light app-primary-color fw-bold btn-sm border" type="button" onClick={handleListRecords} value={"Pending"}>
                                                    {t('bankcollectionmanagement_pendingcard_btn_list')}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            {checkForPermission('BANKCOLLECTION_UPLOAD') &&
                                                <div className='pt-3'>
                                                    <h6 className="app-primary-color fw-bold text-size-14"> {t('bankcollectionmanagement_upload_collection_btn_upload')}</h6>
                                                    <small> {t('bankcollectionmanagement_helptext_template')}</small>
                                                    {/* upload button */}
                                                    <div className="d-flex">
                                                        <div className="mt-2 w-100 pe-1" role="group">
                                                            <button type="button" className="mt-2 btn btn-sm btn-light rounded-1 w-100 app-primary-color fw-bold border  px-0 dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                {t('bankcollectionmanagement_pendingcard_btn_upload')}
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li>  <button className="btn btn-sm  btn-light app-primary-color fw-bold ps-3" type="button" data-bs-toggle='modal' data-bs-target='#BankCollectionUpload'>
                                                                    {t('bankcollectionmanagement_pendingcard_btn_uploadbankcollection')}
                                                                </button></li>
                                                                <li>  <button className="btn btn-sm w-100 mt-1 btn-light app-primary-color fw-bold ps-3 " type="button" data-bs-toggle='modal' data-bs-target='#ChequeExcelUpload'>
                                                                    {t('bankcollectionmanagement_pendingcard_btn_uploadcheque')}
                                                                </button></li>
                                                            </ul>
                                                        </div>
                                                        <div className="mt-2 w-100 pe-1" role="group">
                                                            <button type="button" className="mt-2 btn btn-sm btn-light rounded-1 w-100 app-primary-color fw-bold border  px-0 dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                {t('bankcollectionmanagement_pendingcard_download_template')}
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <a className='w-100' href={`${process.env.REACT_APP_DOWNLOAD_TEMPLATE}${fileName}.xlsx`} download>
                                                                        <button className="btn btn-light w-100 mt-3 app-primary-color fw-bold btn-sm border px-2" type="button">
                                                                            <span className="material-symbols-outlined align-middle me-1">
                                                                                download
                                                                            </span>
                                                                            {t('bankcollectionmanagement_pendingcard_collectiondownload_template')}
                                                                        </button>
                                                                    </a>
                                                                </li>
                                                                <li>  <a className='w-100' href={`${process.env.REACT_APP_DOWNLOAD_TEMPLATE}ChequeCollectionSampleUpload.xlsx`} download>
                                                                        <button className="btn btn-light mt-3 app-primary-color fw-bold btn-sm border px-2 w-100" type="button">
                                                                            <span className="material-symbols-outlined align-middle me-1">
                                                                                download
                                                                            </span>
                                                                            {t('bankcollectionmanagement_pendingcard_chequedownload_template')}
                                                                        </button>
                                                                    </a></li>
                                                            </ul>
                                                        </div>
                                                        {/* upload buttons ends */}
                                                        {/* Download template button */}

                                                    </div>
                                                    {/* Download template button ends */}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>

                                <div className='col-md-4 p-0 pe-2 pb-2'>
                                    <div className='bg-light h-100 p-2'>
                                        <h3 className='fw-bold'>{bankCollectionDashboardDetail.MappedCollectionCount}</h3>
                                        <div className="text-muted mb-2"><small>{t('bankcollectionmanagement_mappingcard_message1')}</small></div>
                                        <div className="row m-0 mt-3">
                                            <div className='col-md-6'>
                                                <button className="btn btn-sm btn-light app-primary-color fw-bold w-100" type="button" value={"Processing"} onClick={handleListRecords}>
                                                    {t('bankcollectionmanagement_mappingcard_message2')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-md-4 p-0 pe-2 pb-2'>
                                    <div className='bg-light h-100 p-2'>
                                        <h3 className='fw-bold'>{bankCollectionDashboardDetail.IgnoredCollectionCount}</h3>
                                        <div className="text-muted mb-2"><small>{t('bankcollectionmanagement_ignoredcard_message1')}</small></div>
                                        <div className="row m-0 mt-3">
                                            <div className='col-md-6'>
                                                <button className="btn btn-sm btn-light app-primary-color fw-bold w-100" type="button" value={"Ignored"} onClick={handleListRecords}>
                                                    {t('bankcollectionmanagement_ignoredcard_message2')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Table ends */}
                        </div>
                    </ContainerPage>
                </>}
                <BankCollectionUploadExcel />
                <ChequeExcelUpload />
            </div >
        }
    </>
}