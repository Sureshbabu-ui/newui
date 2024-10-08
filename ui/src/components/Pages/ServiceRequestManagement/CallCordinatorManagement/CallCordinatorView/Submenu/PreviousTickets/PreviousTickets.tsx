import PreviousTicketsList from './PreviousServiceRequests/PreviousTicketList';
import { ContainerPage } from '../../../../../../ContainerPage/ContainerPage';

const PreviousTickets = () => {
    return (
        <ContainerPage>
            <div className='row mt-2 ms-0'>
                <PreviousTicketsList ContractAssetId={0} Show={true} Hide={true} />
            </div>
        </ContainerPage>
    );
}
export default PreviousTickets