import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BreadCrumb from "../../../BreadCrumbs/BreadCrumb";
import { ContainerPage } from "../../../ContainerPage/ContainerPage";

export const QueueManagement = () => {
    const { t } = useTranslation();
    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_manage_queue' }
        ];
    } 
    return (
        <ContainerPage>
        <>
        <BreadCrumb items={breadcrumbItems()}/> 
         <div className="ms-3">
                 <div className="row">
                <div className='col-md-4 p-0 pe-2 pb-2'>
                    <div className='bg-light h-100 p-2'>
                        <h3 className='fw-bold'>12</h3>
                        <div className="text-muted mb-2"><small>EInvoices</small></div>
                        <div className="row m-0 mt-3">
                            <div className='col-md-6'>
                                <Link to="/queue/einvoice" className="btn btn-sm btn-light app-primary-color fw-bold w-100" role="button">EInvoice List</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
        </>
        </ContainerPage>
    )
}