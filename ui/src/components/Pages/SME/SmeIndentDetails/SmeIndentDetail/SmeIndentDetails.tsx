import { useTranslation } from "react-i18next";
import { store } from "../../../../../state/store";
import { checkForPermission } from "../../../../../helpers/permissions";
import { getAllPartIndentRequestDetails, getSelectedPartRequestDetailsForSmeIndentDetails, partRequestStockAvialability } from "../../../../../services/partIndent";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";
import { useEffect } from "react";
import { changePage, loadPartIndentDetails, setStockTypeId } from "./SmeIndentDetails.slice";
import { loadPartAvailbilityDetail } from "../../../Inventory/PartIndentRequest/PartIndentRequestList/PartIndentRequestList.slice";
import { updateField } from "../../../Inventory/PartIndentRequest/PartIndentReview/PartIndentReview.slice";
import { useStore } from "../../../../../state/storeHooks";
import SmeIndentDetailsView from "../SmeIndentDetailView/SmeIndentDetailView";
import { loadSelectedCommonPartIndentDetailsForSme, setPartRequestStatus } from "../SmeIndentDetailView/SmeIndentDetailView.slice";
import { Pagination } from "../../../../Pagination/Pagination";

const SmeIndentDetails = () => {

    const { t } = useTranslation();
    const { partIndentDetails, reqStatus,currentPage,perPage,totalRows } = useStore(
        ({ partindentrequestdetailslist }) => (partindentrequestdetailslist));

    useEffect(() => {
        onLoad();
    }, []);

    useEffect(() => {
        const getIndentDetails = async () => {
            store.dispatch(changePage(1));
            try {
                const PartIndentRequestDetailsList = await getAllPartIndentRequestDetails(1,reqStatus);
                store.dispatch(loadPartIndentDetails(PartIndentRequestDetailsList))
            } catch (error) {
                return
            }
        }
        getIndentDetails()
    }, [reqStatus]);

    const onLoad = async () => {
        try {
            const PartIndentRequestDetailsList = await getAllPartIndentRequestDetails(1,reqStatus);
            store.dispatch(loadPartIndentDetails(PartIndentRequestDetailsList))

        } catch (error) {
            return
        }
    }

    const breadcrumbItems = () => {
        return [
            { Text: 'breadcrumbs_home', Link: '/' },
            { Text: 'breadcrumbs_sme_view', Link: '' },
            { Text: 'breadcrumbs_sme_view_indent_details' },
        ];
    }

    const selectedPartIndentDetails = async (PartIndentRequestId: number, PartIndentRequestDetailId: number, StockTypeId: number, PartRequestStatusCode: string) => {
        try {
            store.dispatch(setPartRequestStatus(PartRequestStatusCode));
            const { PartRequestAvailability, PartRequestLocationWiseAvailability } = await partRequestStockAvialability(PartIndentRequestDetailId);
            store.dispatch(loadPartAvailbilityDetail({ partAvilability: PartRequestAvailability, partLocationWiseAvilability: PartRequestLocationWiseAvailability }));
            const { SelectedPartIndentInfo } = await getSelectedPartRequestDetailsForSmeIndentDetails(Number(PartIndentRequestId));
            store.dispatch(loadSelectedCommonPartIndentDetailsForSme(SelectedPartIndentInfo));
            store.dispatch(setStockTypeId(StockTypeId));
            store.dispatch(updateField({ name: "Id", value: PartIndentRequestDetailId }));
        } catch (error) {
            return
        }
    };

    async function onPageChange(index: number) {        
         store.dispatch(changePage(index));
        const result = await getAllPartIndentRequestDetails(index,reqStatus);
        store.dispatch(loadPartIndentDetails(result));
    }

    return (
        <div className="">
            <div className="fs-5">{t("sme_indent_details_title")}</div>
            {partIndentDetails == null}
            <BreadCrumb items={breadcrumbItems()} />
            {checkForPermission("PARTINDENT_APPROVAL") &&
                <div className="row ">
                    <>
                        {partIndentDetails.length > 0 ? (
                            <div className="">
                                <table className="table table-bordered ">
                                    <thead>
                                        <tr className="">
                                            <th className="text-center">{t('partindent_view_indentaccordionheader_sln')} </th>
                                            <th className="text-center ">{t('partindent_view_indentaccordionheader_indent_no')} </th>
                                            <th className="text-center ">{t('partindent_view_indentaccordionheader_partcode')} </th>
                                            <th className="text-center">{t('partindent_view_indentaccordionheader_hsn')} </th>
                                            <th className="">{t('partindent_view_indentaccordionheader_partname')} </th>
                                            <th className="">{t('partindent_view_indentaccordionheader_status')} </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {partIndentDetails.map((detail, index) => (

                                            <tr className=""  key={index}>
                                                <td className="text-center">{(currentPage - 1) * 10 + (index + 1)}</td>
                                                <td className="text-center">
                                                    <span data-bs-toggle="modal" data-bs-target='#SmeIndentDetailView' onClick={() => selectedPartIndentDetails(detail.PartIndentRequestId, detail.PartIndentRequestDetailId, detail.StockTypeId, detail.PartRequestStatusCode)} className="pseudo-link text-primary text-decoration-underline">{detail.IndentRequestNumber}</span>
                                                </td>
                                                <td className="text-center">{detail.PartCode}</td>
                                                <td className="text-center">{detail.HsnCode}</td>
                                                <td >
                                                   {detail.PartName}
                                                </td>
                                                <td >{detail.PartRequestStatus}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="row mx-0 text-muted">{t('partindent_view_no_records')}</div>
                        )}
                        {/* Pagination */}
                        <div className='row m-0'>
                            <Pagination currentPage={currentPage} count={totalRows} itemsPerPage={perPage} onPageChange={onPageChange} />
                        </div>
                        {/* Pagination ends */}
                    </>
                </div>
            }
            <SmeIndentDetailsView />
        </div>
    );
}

export default SmeIndentDetails;
