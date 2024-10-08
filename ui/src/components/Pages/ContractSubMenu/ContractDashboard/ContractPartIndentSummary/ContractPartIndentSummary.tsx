import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../../../state/storeHooks';
import { store } from '../../../../../state/store';
import { checkForPermission } from '../../../../../helpers/permissions';
import { initializePartIndentSummary, loadPartIndentSummaryDetail } from './ContractPartIndentSummary.slice';
import { getContractPartIndentCount } from '../../../../../services/partIndent';
import { useParams } from 'react-router-dom';

export const ContractPartIndentSummary = () => {
    const { t } = useTranslation();
    const { partIndentCountDetail } = useStore(
        ({ contractpartindentsummary }) => contractpartindentsummary);

    const { ContractId } = useParams<{ ContractId: string }>();
    useEffect(() => {
        if(checkForPermission('SERVICE_REQUEST_DETAILS')&& Number(ContractId)>0) 
        onLoad(ContractId);
    }, [ContractId]); 
 
    const onLoad = async (ContractId: string) => {
        store.dispatch(initializePartIndentSummary());
        try {
            const result = await getContractPartIndentCount(ContractId)
            store.dispatch(loadPartIndentSummaryDetail(result))

        } catch (error) {
            console.error(error);
        }
    }

    return <>
        {checkForPermission("SERVICE_REQUEST_DETAILS") &&
           <div className="">
           <div className="me-1 mt-0 mb-4">
               {/* header */}
               <div className="small mb-2 fw-bold">{t('contractpartindentsummary_partindent_status')}</div>
               {/* header ends */}
               <div className="row">
                   <div className="col-md-3">
                       {/* total wapper */}
                       <div className="p-0 mt-1 m-0 ">
                           {/* total count */}
                           <div className=" rounded me-2 p-3 bg-warning-subtle">
                               <div className="h2 fw-bold">{partIndentCountDetail.TotalPartIndentCount}</div>
                               <div className="h5">{t('contractpartindentsummary_total_indent')}</div>
                           </div>
                           {/* total count */}
                       </div>
                   </div>
                   <div className="col-md-3">
                       {/* pending wrapper  */}
                       <div className="p-0 mt-1 m-0 ">
                           <div className=" rounded me-2 p-3 bg-success-subtle">
                               <div className="h2 fw-bold">{partIndentCountDetail.PendingPartIndentCount}</div>
                               <div className="h5">{t('contractpartindentsummary_pending_indent')}</div>
                           </div>
                       </div>
                   </div>
                   <div className="col-md-3">
                       {/* consumed wrapper  */}
                       <div className="p-0 mt-1 m-0">
                           <div className=" rounded me-2 p-3 bg-secondary-subtle">
                               <div className="h2 fw-bold">{partIndentCountDetail.ApprovedPartIndentCount}
                               </div>
                               <div className="h5">{t('contractpartindentsummary_consumed_indent')}</div>
                           </div>
                       </div>
                   </div>

                   <div className="col-md-3">
                       {/* rejected wrapper  */}
                       <div className="p-0 mt-1 m-0">
                           <div className=" rounded me-2 p-3 bg-primary-subtle">
                               <div className="h2 fw-bold">{partIndentCountDetail.RejectedPartIndentCount}</div>
                               <div className="h5">{t('contractpartindentsummary_rejected_indent')}</div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>
       </div>
        }
    </>
}