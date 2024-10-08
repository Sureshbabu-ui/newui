import { useEffect, useState } from 'react';
import BreadCrumb from '../../../BreadCrumbs/BreadCrumb';
import SmeHomeCalls from './SmeHomeCalls/SmeHomeCalls';
import SmeHomeAssets from './SmeHomeAssets/SmeHomeAssets';
import { t } from 'i18next';
import SmeHomeParts from './SmeHomeParts/SmeHomeParts';
import { store } from '../../../../state/store';
import { initializeCallDetailsForSme } from './SmeHomeCalls/SmeHomeCalls.slice';
import { initializeAssetDetailsForSme } from './SmeHomeAssets/SmeHomeAssets.slice';
import { initializePartDetailsForSme } from './SmeHomeParts/SmeHomeParts.slice';

const SmeHome = () => {
    
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_sme_view', Link: '' },
        { Text: 'breadcrumbs_sme_home', },
    ];

    const [selectedOption, setSelectedOption] = useState('calls');

    useEffect(()=>{
      store.dispatch(initializeCallDetailsForSme())
      store.dispatch(initializeAssetDetailsForSme())
      store.dispatch(initializePartDetailsForSme())
    },[selectedOption])

    const renderComponent = () => {
        switch (selectedOption) {
            case 'calls':
                return <SmeHomeCalls />;
            case 'assets':
                return <SmeHomeAssets />;
            case 'parts':
                    return <SmeHomeParts />;
            default:
                return null;
        }
    };

    return (
        <div>
            <BreadCrumb items={breadcrumbItems} />
            <div className="row ps-4">
                <div className='d-flex'>
                    <div className="form-check px-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                            checked={selectedOption === 'calls'}
                            onChange={() => setSelectedOption('calls')}
                        />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                           {t("sme_home_checkbox_label_calls")}
                        </label>
                    </div>
                    <div className="form-check pe-2">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            checked={selectedOption === 'assets'}
                            onChange={() => setSelectedOption('assets')}
                        />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                        {t("sme_home_checkbox_label_assets")}
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            checked={selectedOption === 'parts'}
                            onChange={() => setSelectedOption('parts')}
                        />
                        <label className="form-check-label" htmlFor="flexRadioDefault2">
                        {t("sme_home_checkbox_label_parts")}
                        </label>
                    </div>
                </div>
            </div>
            <div>
                {renderComponent()}
            </div>
        </div>
    );
}

export default SmeHome;
