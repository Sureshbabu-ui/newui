import { downloadCallStatusReport } from '../../../../../../../services/serviceRequest';
import FileSaver from 'file-saver';
import { formatDocumentName } from '../../../../../../../helpers/formats';
import { t } from 'i18next';
import { store } from '../../../../../../../state/store';

const CallStatus = (props:{SRId?:number|null}) => {
    const ServiceRequestId = props.SRId;
    const onDownloadClick = async () => {
        const response = await downloadCallStatusReport(Number(ServiceRequestId))
        const url = window.URL.createObjectURL(response.data);
        FileSaver.saveAs(url, formatDocumentName())
    }
    return (
        <div className='row ms-0'>
            <div className='row mt-3'>
                <h5 className="bold-text ps-0 m-0">{t('callstatus_heading')}</h5>
                <p className='p-0 m-0'>
                {t('callstatus_description')}
                </p>
                <div className="dropdown p-0 m-0 pt-2">
                    <button className="btn app-primary-bg-color text-white px-2 " type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    {t('callstatus_current_call_status')}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                        <li><a className="dropdown-item" href={`/callstatusreport/${props.SRId? props.SRId:  ServiceRequestId}`} target="_blank">{t('callstatus_view')}</a></li>
                        <li><a className="dropdown-item pe-auto" onClick={onDownloadClick} >{t('callstatus_download')}</a></li>
                    </ul>
                </div>
            </div>
             </div >
    );
}
export default CallStatus