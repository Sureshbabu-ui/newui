import { useTranslation } from "react-i18next";
import { useStoreWithInitializer } from "../../../../../state/storeHooks";
import { initializeVendorDetails, loadVendorDetails } from "./VendorDetails.slice";
import { formatDate } from "../../../../../helpers/formats";
import { useParams } from "react-router-dom";
import { getClickedVendorDetails } from "../../../../../services/vendor";
import { store } from "../../../../../state/store";

const VendorDetails = () => {
    const { t } = useTranslation();
    const { VendorId } = useParams<{ VendorId: string }>();

    const onLoad = async () => {
        store.dispatch(initializeVendorDetails());
        try {
            const result = await getClickedVendorDetails(VendorId);
            store.dispatch(loadVendorDetails(result));
        } catch (error) {
            console.error(error);
        }
    }
    const { vendorDetails } = useStoreWithInitializer(
        ({ vendordetails }) => vendordetails,
        onLoad
    );

    return (
        <div>
            <div>
                <h5 className="px-0 pt-0 bold-text">{t('vendor_details_title_vendordetails')}</h5>
                <div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_name')}</label>
                        <div>{vendorDetails.Name}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_vendortype')}</label>
                        <div>{vendorDetails.VendorType}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_officename')}</label>
                        <div>{vendorDetails.OfficeName}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_address')}</label>
                        <div >{vendorDetails.Address}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_state')}</label>
                        <div>{vendorDetails.State}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_city')}</label>
                        <div >{vendorDetails.City}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_pincode')}</label>
                        <div >{vendorDetails.Pincode}</div>
                    </div>
                </div>
            </div>
            <div>
                <h5 className="px-0 pt-3 bold-text">{t('vendor_details_title_contactdetails')}</h5>
                <div >
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_contactname')}</label>
                        <div >{vendorDetails.ContactName}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_email')}</label>
                        <div >{vendorDetails.Email}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_contactnumberone')}</label>
                        <div >{vendorDetails.ContactNumberOneCountryCode}&nbsp;{vendorDetails.ContactNumberOne}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_contactnumbertwo')}</label>
                        <div >{vendorDetails.ContactNumberTwo ? <><div>{vendorDetails.ContactNumberTwoCountryCode}&nbsp;{vendorDetails.ContactNumberTwo}</div></> : "---"}</div>
                    </div>
                </div>
            </div>
            <div>
                <h5 className="px-0 pt-3 bold-text">{t('vendor_details_title_generaldetails')}</h5>
                <div >
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_creditperiod')}</label>
                        <div >{vendorDetails.CreditPeriodInDays}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_gstnumber')}</label>
                        <div >{vendorDetails.GstNumber} </div>
                    </div>
                    <div className="row pt-2 ">
                        <label className="form-text">{t('vendor_details_gsttype')}</label>
                        <div >{vendorDetails.GstVendorType}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_tannumber')}</label>
                        <div>{vendorDetails.TanNumber ? vendorDetails.TanNumber : "---"}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_cinnumber')}</label>
                        <div>{vendorDetails.CinNumber ? vendorDetails.CinNumber : "---"}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_arnnumber')}</label>
                        <div>{vendorDetails.ArnNumber ? vendorDetails.ArnNumber : "---"}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_esinumber')}</label>
                        <div>{vendorDetails.EsiNumber ? vendorDetails.EsiNumber : "---"}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_pannumber')}</label>
                        <div>{vendorDetails.PanNumber ? vendorDetails.PanNumber : "---"}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_pantype')}</label>
                        <div>{vendorDetails.PanType ? vendorDetails.PanType : "---"}</div>
                    </div>
                    <div className="row pt-2">
                        <label className="form-text">{t('vendor_details_ismsme')}</label>
                        <div>{vendorDetails.IsMsme ? "Yes" : "No"}</div>
                    </div>
                    {vendorDetails.IsMsme && (
                        <>
                            <div className="row pt-2">
                                <label className="form-text">{t('vendor_details_msmereg_number')}</label>
                                <div>{vendorDetails.MsmeRegistrationNumber}</div>
                            </div>
                            <div className="row pt-2">
                                <label className="form-text">{t('vendor_details_msmecommen_date')}</label>
                                <div>{formatDate(vendorDetails.MsmeCommencementDate)}</div>
                            </div>
                            <div className="row pt-2">
                                <label className="form-text">{t('vendor_details_msmeexp_date')}</label>
                                <div>{formatDate(vendorDetails.MsmeExpiryDate)}</div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VendorDetails