import { useTranslation } from "react-i18next";
import { useStore } from "../../../../../state/storeHooks";
import { store } from "../../../../../state/store";
import { checkForPermission } from "../../../../../helpers/permissions";
import { loadPartAvailbilityDetail, loadPartIndentDetail, loadPartsCategoryNotCovered, setPartAvailabilityStatus } from "./PartIndentRequestList.slice";
import { getSelectedPartRequestDetails, partRequestStockAvialability, partRequestUpdateDetails } from "../../../../../services/partIndent";
import { useParams } from "react-router-dom";
import { updateField } from "../PartIndentReview/PartIndentReview.slice";
import { PartIndentReview } from "../PartIndentReview/PartIndentReview";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { formatDateTime } from "../../../../../helpers/formats";
import { getSelectedPartsNotCovered } from "../../../../../services/assetsSummary";
import { useEffect } from "react";
import CallStatus from "../../../ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/Others/CallStatus";

export const PartIndentRequestView = () => {
    const { t } = useTranslation();
    const { RequestId } = useParams<{ RequestId: string }>();
    const { partIndentDetails, selectedPartIndentInfo, partCategory, partAvilability, partAvailabilityStatus } = useStore(
        ({ partindentrequestlist }) => (partindentrequestlist));

    useEffect(() => {
        onLoad();
    }, []);

    const onLoad = async () => {
        try {
            const { PartRequestInfo, SelectedPartIndentInfo } = await getSelectedPartRequestDetails(Number(RequestId));
            store.dispatch(loadPartIndentDetail({ PartIndentDetail: PartRequestInfo, selectedPartdetails: SelectedPartIndentInfo }))
            const data = await getSelectedPartsNotCovered(SelectedPartIndentInfo.AssetProductCategoryId.toString(), SelectedPartIndentInfo.ContractId.toString())
            store.dispatch(loadPartsCategoryNotCovered(data.ProductCategoryPartnotCovered[0].PartCategoryNames));
        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = (ev: any, StockTypeId?: any) => {
        store.dispatch(updateField({ name: "StockTypeId", value: StockTypeId }))
        store.dispatch(updateField({ name: "RequestStatus", value: ev.target.value }))
        store.dispatch(updateField({ name: "Id", value: ev.target.name }))
    }

    const handleStockAvailability = async (Id: number) => {
        try {
            const { PartRequestAvailability, PartRequestLocationWiseAvailability } = await partRequestStockAvialability(Id);
            store.dispatch(loadPartAvailbilityDetail({ partAvilability: PartRequestAvailability, partLocationWiseAvilability: PartRequestLocationWiseAvailability }))
        } catch (err) {
            console.log(err);
        }
        store.dispatch(setPartAvailabilityStatus(Id))
    }

    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_sme_approval_indents', Link: '/calls/sme' },
            { Text: 'breadcrumbs_manage_partindent_requests_view' }
        ];
    }

    return (
        <div className="mt-5">
            <BreadCrumb items={breadcrumbItems()} />
            {checkForPermission("PARTINDENT_APPROVAL") &&
                <div className="row mx-2">
                    <div>
                        <div className="col-6 mb-3">
                            <div><CallStatus SRId={selectedPartIndentInfo.ServiceRequestId} /></div>
                        </div>
                        <div className="row mb-2">
                            <div className="col-3">
                                <div className="text-muted text-size-11" >{t('partindent_view_indentaccordionheader_wono')}</div>
                                <div>{selectedPartIndentInfo.WorkOrderNumber}</div>
                            </div>
                            <div className="col-3">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_callstatus')}</div>
                                <div>{selectedPartIndentInfo.CallStatus}</div>
                            </div>
                            <div className="col-3">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_indentnum')}</div>
                                <div>{selectedPartIndentInfo.IndentRequestNumber}</div>
                            </div>
                            <div className="col-3">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_remarks')}</div>
                                <div>
                                    {selectedPartIndentInfo.Remarks ? selectedPartIndentInfo.Remarks : "---"}
                                </div>
                            </div>

                        </div>
                        <div className="row mb-2">
                            <div className="col-3">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_location')}</div>
                                <div>{selectedPartIndentInfo.Location}</div>
                            </div>
                            <div className="col-3">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_reqby')}</div>
                                <div>{selectedPartIndentInfo.RequestedBy}</div>
                            </div>
                            <div className="col-3">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_reqon')}</div>
                                <div>{formatDateTime(selectedPartIndentInfo.CreatedOn)}</div>
                            </div>


                        </div>

                    </div>
                    <div className="table-responsive overflow-auto">
                        <table className="table table-bordered text-nowrap mt-2">
                            <thead>
                                <tr className="align-middle">
                                    <th className="text-center py-0" rowSpan={2}>{t('partindent_view_indentaccordionheader_sln')} </th>
                                    <th className="text-center py-0" rowSpan={2}>{t('partindent_view_indentaccordionheader_partcode')} </th>
                                    <th className="py-0" rowSpan={2}>{t('partindent_view_indentaccordionheader_partname')} </th>
                                    <th className="py-0" rowSpan={2}>{t('partindent_view_indentaccordionheader_hsn')} </th>
                                    <th className="text-center py-0" rowSpan={2}>{t('partindent_view_indentaccordionheader_qty')} </th>
                                    <th className="py-0" rowSpan={2}>{t('partindent_view_indentaccordionheader_parttype')} </th>
                                    <th className="text-center py-0" rowSpan={2}>{t('partindent_view_indentaccordionheader_underwarranty')} </th>
                                    <th className="py-0" rowSpan={2}>{t('partindent_view_indentaccordionheader_partcat')} </th>
                                    <th className="py-0" rowSpan={2}>{t('partindent_view_indentaccordionheader_status')} </th>
                                    <th className="py-0" rowSpan={2}>{t('partindent_view_indentaccordionheader_reviewcomments')} </th>
                                    <th className="text-center py-0" colSpan={3}>{t('partindent_view_indentaccordionheader_partavailability')}</th>
                                    <th className="text-center py-0" rowSpan={2}>{t('partindent_view_indentaccordionheader_action')}</th>
                                </tr>
                                <tr>
                                    <td className="text-center text-size-13 fw-bold py-0">{t('partindent_view_indentaccordiontitle_cwhavailbaility')}</td>
                                    <td className="text-center text-size-13 fw-bold py-0">{t('partindent_view_indentaccordiontitle_currentavailbaility')}</td>
                                    <td className="text-center text-size-13 fw-bold py-0">{t('partindent_view_indentaccordiontitle_otheravailbaility')}</td>
                                </tr>
                            </thead>
                            <tbody>
                                {partIndentDetails.map((detail, index) => (
                                    <tr className="align-middle" role="button">
                                        <td className="text-center">{index + 1}</td>
                                        <td className="text-center">{detail.PartCode}</td>
                                        <td >{detail.PartName}</td>
                                        <td >{detail.HsnCode}</td>
                                        <td className="text-end">{detail.Quantity}</td>
                                        <td >{detail.StockType}</td>
                                        <td className="text-center">{detail.IsWarrantyReplacement ? "Yes" : "No"}</td>
                                        <td >{detail.PartCategoryName}</td>
                                        <td >{detail.PartRequestStatus}</td>
                                        <td >{detail.ReviewerComments}</td>
                                        {partAvailabilityStatus == detail.Id ? (
                                            <>
                                                <td className="text-center">
                                                    {partAvilability.map((part, idx) => (
                                                        part.Location == "CWH" &&
                                                        <div key={idx}>
                                                            {part.Quantity}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="text-center">
                                                    {partAvilability.map((part, idx) => (
                                                        part.Location != "CWH" && part.Location != "Others" &&
                                                        <div key={idx}>
                                                            {part.Quantity}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="text-center">
                                                    {partAvilability.map((part, idx) => (
                                                        part.Location == "Others" &&
                                                        <div key={idx}>
                                                            {part.Quantity > 0 ? (
                                                                <a className="text-primary cursor-pointer" data-bs-toggle="offcanvas"
                                                                    data-bs-target="#OtherLocations"
                                                                >
                                                                    {part.Quantity}
                                                                </a>
                                                            ) :
                                                                part.Quantity}
                                                        </div>
                                                    ))}
                                                </td>
                                            </>
                                        ) : (
                                            <td className="text-center" colSpan={3}>
                                                <a className="text-primary cursor-pointer text-decoration-none" onClick={() => handleStockAvailability(detail.Id)}>
                                                    {t('partindent_view_indentaccordiontitle_stockavailability')}
                                                </a>
                                            </td>
                                        )}
                                        <td className="text-center">
                                            {(detail.PartRequestStatusCode != "PRT_CRTD" && detail.PartRequestStatusCode != "PRT_HOLD") ? (
                                                <span>{detail.PartRequestStatus}</span>
                                            )
                                                :
                                                (
                                                    <>
                                                        <div className="btn-group dropend">
                                                            <button className="btn app-primary-bg-color btn-sm dropdown-toggle text-white" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                {t('partindent_view_indentbuttontitle_process')}
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <button
                                                                        onClick={(ev) => handleClick(ev, detail.StockTypeId)}
                                                                        className="dropdown-item" name={`${detail.Id}`}
                                                                        value='PRT_APRV' type="button" data-bs-toggle='modal' data-bs-target='#ReviewPartIndent'>
                                                                        {t('partindent_view_indentbutton_approve')}
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        onClick={(ev) => handleClick(ev)}
                                                                        className="dropdown-item"
                                                                        name={`${detail.Id}`} value='PRT_RJTD' type="button" data-bs-toggle='modal' data-bs-target='#ReviewPartIndent'                                                                        >
                                                                        {t('partindent_view_indentbutton_reject')}
                                                                    </button>
                                                                </li>
                                                                {detail.PartRequestStatusCode != "PRT_HOLD" &&
                                                                    <li>
                                                                        <button
                                                                            onClick={(ev) => handleClick(ev)}
                                                                            className="dropdown-item"
                                                                            name={`${detail.Id}`} value='PRT_HOLD' type="button" data-bs-toggle='modal' data-bs-target='#ReviewPartIndent'                                                                        >
                                                                            {t('partindent_view_indentbutton_hold')}
                                                                        </button>
                                                                    </li>
                                                                }
                                                            </ul>
                                                        </div>
                                                    </>
                                                )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-2 mt-1">
                        <div className="text-size-14"><strong>{t('partindent_view_indentaccordiontitle_customerrepissue')}</strong></div>
                        <div>
                            <div className="text-muted text-size-11 mt-1">{t('partindent_view_indentaccordionheader_customerrepissue')}</div>
                            <div className="mb-1">
                                {selectedPartIndentInfo.CustomerReportedIssue}
                            </div>
                            {selectedPartIndentInfo.CallcenterRemarks && (
                                <>
                                    <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_callcentreremarks')}</div>
                                    <div className="mb-1">
                                        {selectedPartIndentInfo.CallcenterRemarks}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="mb-1">
                        <div className="row mb-2">
                            <div className="text-size-14"><strong>{t('partindent_view_indentaccordiontitle_asset')}</strong></div>
                            <div className="col-4">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_productcat')}</div>
                                <div>{selectedPartIndentInfo.CategoryName}</div>
                            </div>
                            <div className="col-4">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_make')}</div>
                                <div>{selectedPartIndentInfo.Make}</div>
                            </div>
                            <div className="col-4">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_model')}</div>
                                <div>{selectedPartIndentInfo.ModelName}</div>
                            </div>
                            <div className="col-4 mt-2">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_serialnum')}</div>
                                <div>{selectedPartIndentInfo.ProductSerialNumber}</div>
                            </div>
                            <div className="col-4 mt-2">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_iswarrentyended')}</div>
                                <div>{selectedPartIndentInfo.IsWarranty ? t('partindent_view_indentaccordionheader_iswarrentyended_yes') : t('partindent_view_indentaccordionheader_iswarrentyended_no')}</div>
                            </div>
                            <div className="col-4 mt-2">
                                <div className="text-muted text-size-11">{t('partindent_view_indentaccordionheader_part_exclusions')}</div>
                                <div>
                                    {partCategory ? partCategory : "No Excluded Parts"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <PartIndentReview />
            <OffCanvas />
        </div >
    );
}

const OffCanvas = () => {
    const { partLocationWiseAvilability } = useStore(
        ({ partindentrequestlist }) => partindentrequestlist);
    return (
        <div className="offcanvas offcanvas-end" id="OtherLocations">
            <div className="offcanvas-header">
                <h1 className="offcanvas-title app-primary-color">Locations</h1>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div className="offcanvas-body">
                <ul className="list-group">
                    {partLocationWiseAvilability.map((item, nestedIndex) => (
                        <li className="list-group-item d-flex justify-content-between align-items-start border-0" key={nestedIndex}>
                            <div className="ms-2 me-auto fw-bold app-primary-color">
                                {item.Location}
                            </div>
                            <span className="ms-4 badge text-bg-primary rounded-pill">
                                {item.Quantity}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
