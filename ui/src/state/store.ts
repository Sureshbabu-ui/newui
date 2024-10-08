import { Action, configureStore } from '@reduxjs/toolkit';
import app from '../components/App/App.slice';
import login from '../components/Pages/Login/Login.slice';
import usermanagement from '../components/Pages/UserManagement/UsersList/UserManagement.slice';
import useredit from '../components/Pages/UserManagement/EditUser/EditUser.slice';
import userStatus from '../components/Pages/ToggleUserStatus/ToggleUserStatus.slice';
import usercreate from '../components/Pages/UserManagement/CreateUser/CreateUser.slice';
import bankapprovalrequestcreate from '../components/Pages/BankManagement/BankApprovalRequestCreate/BankApprovalRequestCreate.slice';
import forgotPassword from '../components/Pages/ForgotPassword/ForgotPassword.slice';
import codeverification from '../components/Pages/CodeVerification/CodeVerification.slice';
import changePassword from '../components/Pages/ChangePassword/ChangePassword.slice';
import passwordReset from '../components/Pages/PasswordReset/PasswordReset.slice';
import userhistory from '../components/Pages/LoginHistory/LoginHistory.slice';
import approvalworkflowlist from '../components/Pages/ApprovalWorkflow/ApprovalWorkflowList/ApprovalWorkflowList.slice'
import approvalworkflowedit from "../components/Pages/ApprovalWorkflow/ApprovalWorkflowEdit/ApprovalWorkflowEdit.slice"
import approvalworkflowview from '../components/Pages/ApprovalWorkflow/ApprovalWorkflowView/ApprovalWorkflowView.slice'
import approvalworkflowdetailcreate from '../components/Pages/ApprovalWorkflow/ApprovalWorkflowDetailCreate/ApprovalWorkflowDetailCreate.slice'
import approvalworkflowdetailedit from '../components/Pages/ApprovalWorkflow/ApprovalWorkflowDetailEdit/ApprovalWorkflowDetailEdit.slice'
import approvalsmanagement from '../components/Pages/PendingApproval/PendingApprovalList/PendingApprovals.slice';
import bankspending from '../components/Pages/BankManagement/BanksPendingList/BanksPendingList.slice'
import banksapproved from '../components/Pages/BankManagement/BanksApprovedList/BanksApprovedList.slice';
import approvarequestdetails from '../components/Pages/PendingApproval/PendingApprovalView/PendingApprovalView.slice';
import approvalrequestreview from '../components/Pages/PendingApproval/PendingApprovalReview/PendingApprovalReview.slice';
import bankapprovalrequestedit from '../components/Pages/BankManagement/BankApprovalRequestEdit/BankApprovalRequestEdit.slice'
import contractmanagement from '../components/Pages/ContractManagement/ContractManagement.slice';
import contractcreate from '../components/Pages/CreateContract/CreateContract.slice';
import bookingdetailreport from '../components/Pages/Reports/ReportsSubmenu/BookingDetailReport/BookingDetailReport.slice';
import contractview from '../components/Pages/ContractView/ContractView.slice';
import generalcontractdetails from '../components/Pages/ContractSubMenu/General/General.slice';
import manpowersummarycreate from '../components/Pages/ContractSubMenu/ContractManPower/ContractManpowerSummary/ManPowerSummaryCreate.slice';
import assetscreate from '../components/Pages/ContractSubMenu/Assets/CreateAssets.slice';
import assetslist from '../components/Pages/ContractSubMenu/Assets/AssetsList.slice';
import manpowermanagement from '../components/Pages/ContractSubMenu/ContractManPower/ContractManpowerSummary/ManPowerSummaryList.slice';
import manpoweredit from '../components/Pages/ContractSubMenu/ContractManPower/ContractManpowerSummary/EditManPowerSummary.slice';
import preloader from '../components/Preloader/Preloader.slice';
import lookupdata from '../components/Pages/LookupData/LookupData.slice';
import lookupdatacreate from '../components/Pages/LookupData/LookupDataCreate.slice';
import usercount from '../components/Cards/UserCountCard.slice';
import contractcount from '../components/Cards/ContractCountCard.slice';
import customerlist from '../components/Pages/CustomerManagement/CustomerList/CustomerList.slice';
import customercreate from '../components/Pages/CreateCustomer/CreateCustomer.slice';
import customerupdate from '../components/Pages/CustomerManagement/CustomerEdit/CustomerEdit.slice';
import userprofile from '../components/Pages/UserProfile/UserProfile.slice'
import customerprofile from '../components/Pages/CustomerSubMenu/Profile/Profile.slice';
import profile from '../components/Pages/UserProfile/ProfileInfo.slice';
import contractdocumentcreate from '../components/Pages/ContractSubMenu/ContractDocument/ContractDocumentCreate.slice';
import contractdocumentlist from '../components/Pages/ContractSubMenu/ContractDocument/ContractDocumentList.slice';
import customersitemanagement from '../components/Pages/CustomerSubMenu/Site/SiteManagement.slice';
import customersitecreate from '../components/Pages/CustomerSubMenu/Site/CreateSite.slice';
import changeuserPassword from '../components/Pages/UserProfile/UpdateUserPassword.slice';
import contractcustomersitemanagement from '../components/Pages/ContractSubMenu/ContractCustomerSite/CustomerSiteManagement.slice'
import contractcustomersitecreate from '../components/Pages/ContractSubMenu/ContractCustomerSite/CustomerSiteCreate.slice'
import contractpreamcmanagement from '../components/Pages/ContractSubMenu/PreAMC/PreAMCManagement.slice'
import assignengineer from '../components/Pages/ContractSubMenu/PreAMC/PreAMCAssignEngineer.Slice'
import servicerequestcreate from '../components/Pages/ServiceRequestManagement/CallCentreManagement/ServiceRequestCreate/ServiceRequestCreate.slice';
import servicerequestedit from '../components/Pages/ServiceRequestManagement/CallCentreManagement/ServiceRequestEdit/ServiceRequestEdit.slice';
import contractedit from '../components/Pages/ContractManagement/ContractEdit.slice'
import divisionlist from "../components/Pages/MasterData/Division/DivisionList/DivisionList.slice"
import divisioncreate from "../components/Pages/MasterData/Division/DivisionCreate/DivisionCreate.slice"
import assetdocumentupload from '../components/Pages/ContractSubMenu/Assets/AssetsDocumentUpload.slice'
import tenantcreate from '../components/Pages/Tenant/TenantCreate/TenantCreate.slice'
import tenantlist from '../components/Pages/Tenant/TenantList/TenantList.slice';
import sitedocumentupload from '../components/Pages/ContractSubMenu/ContractCustomerSite/SiteDocumentUpload.slice'
import bankbranchlist from '../components/Pages/MasterData/BankBranch/BankBranchList/BankBranchList.slice'
import bankbranchcreate from '../components/Pages/MasterData/BankBranch/BankBranchCreate/BankBranchCreate.slice'
import locationsetting from "../components/Pages/Settings/LocationSetting/LocationSetting.slice"
import eventwise from "../components/Pages/Settings/NotificationSetting/EventWise/EventWise.slice"
import rolewise from "../components/Pages/Settings/NotificationSetting/RoleWise/RoleWise.slice"
import makecreate from "../components/Pages/MasterData/Make/MakeCreate/MakeCreate.slice"
import makelist from "../components/Pages/MasterData/Make/MakeList/MakeList.slice"
import partproductcategorycreate from "../components/Pages/MasterData/PartProductCategory/PartProductCategoryCreate/PartProductCategoryCreate.slice"
import partproductcategorylist from "../components/Pages/MasterData/PartProductCategory/PartProductCategoryList/PartProductCategoryList.slice"
import productcreate from "../components/Pages/MasterData/Product/ProductCreate/ProductCreate.slice"
import productlist from "../components/Pages/MasterData/Product/ProductList/ProductList.slice"
import tenantprofile from "../components/Pages/Tenant/TenantSubmenu/TenantProfile/TenantProfile.slice"
import designationlist from "../components/Pages/MasterData/Designation/DesignationList/DesignationList.slice"
import designationcreate from "../components/Pages/MasterData/Designation/DesignationCreate/DesignationCreate.slice"
import businesseventlist from "../components/Pages/MasterData/BusinessEvents/BusinessEventList/BusinessEventList.slice";
import contractcustomer from "../components/Pages/ContractSubMenu/ContractCustomer/ContractCustomer.slice"
import partcategorylist from "../components/Pages/MasterData/PartCategory/PartCategoryList/PartCategoryList.slice"
import partcategorycreate from "../components/Pages/MasterData/PartCategory/PartCategoryCreate/PartCategoryCreate.slice"
import partlist from "../components/Pages/MasterData/Part/PartList/PartList.slice"
import partcreate from "../components/Pages/MasterData/Part/PartCreate/PartCreate.slice"
import rolelist from "../components/Pages/MasterData/Role/RoleList/RoleList.slice";
import rolecreate from "../components/Pages/MasterData/Role/RoleCreate/RoleCreate.slice";
import roleedit from "../components/Pages/MasterData/Role/RoleEdit/RoleEdit.slice";
import customergrouplist from "../components/Pages/MasterData/CustomerGroup/CustomerGroupList/CustomerGroupList.slice";
import customergroupcreate from "../components/Pages/MasterData/CustomerGroup/CustomerGroupCreate/CustomerGroupCreate.slice";
import tenantofficelist from "../components/Pages/Tenant/TenantSubmenu/TenantOffice/TenantOfficeList/TenantOfficeList.slice";
import citieslist from "../components/Pages/MasterData/City/CityList/City.slice";
import tenantofficecreate from "../components/Pages/Tenant/TenantSubmenu/TenantOffice/TenantOfficeCreate/TenantOfficeCreate.slice";
import tenantofficeedit from "../components/Pages/Tenant/TenantSubmenu/TenantOffice/TenantOfficeEdit/TenantOfficeEdit.slice";
import contracthistory from "../components/Pages/ContractSubMenu/General/ContractHistory/ContractHistory.slice";
import paymentfrequencylist from "../components/Pages/MasterData/PaymentFrequency/PaymentFrequencyList/PaymentFrequencyList.slice"
import paymentfrequencycreate from "../components/Pages/MasterData/PaymentFrequency/PaymentFrequencyCreate/PaymentFrequencyCreate.slice"
import tenantbankaccountlist from "../components/Pages/Tenant/TenantSubmenu/TenantBankAccount/TenantBankAccountList/TenantBankAccountList.slice"
import tenantbankaccountcreate from "../components/Pages/Tenant/TenantSubmenu/TenantBankAccount/TenantBankAccountCreate/TenantBankAccountCreate.slice"
import appsetting from "../components/Pages/Settings/AppSetting/AppSetting.slice";
import tenantbankaccountdetails from "../components/Pages/Tenant/TenantSubmenu/TenantBankAccount/TenantBankAccountView/TenantBankAccountView.slice"
import contractapprovalrequest from "../components/Pages/ContractSubMenu/General/ContractApprovalRequest/RequestApproval/RequestApproval.slice"
import contractinvoiceschedulelist from "../components/Pages/ContractSubMenu/ContractInvoiceSchedule/ContractInvoiceScheduleList/ContractInvoiceScheduleList.slice";
import vendorlist from "../components/Pages/Vendor/VendorList/VendorList.slice";
import vendorcreate from "../components/Pages/Vendor/VendorCreate/VendorCreate.slice";
import vendoredit from "../components/Pages/Vendor/VendorEdit/VendorEdit.slice";
import vendordetails from "../components/Pages/Vendor/Submenu/VendorDetails/VendorDetails.slice";
import vendorbranchcreate from "../components/Pages/Vendor/Submenu/VendorBranches/BranchCreate/VendorBranchCreate.slice";
import vendorbranchedit from "../components/Pages/Vendor/Submenu/VendorBranches/BranchEdit/VendorBranchEdit.slice";
import vendorbranchlist from "../components/Pages/Vendor/Submenu/VendorBranches/VendorBranches.slice";
import vendorbankaccountlist from "../components/Pages/Vendor/Submenu/BankAccounts/BankAccounts.slice";
import vendorbankaccountcreate from "../components/Pages/Vendor/Submenu/BankAccounts/BankAccountCreate/BankAccountCreate.slice";
import vendorbankaccountedit from "../components/Pages/Vendor/Submenu/BankAccounts/BankAccountEdit/BankAccountEdit.slice";
import assetsummarylist from "../components/Pages/ContractSubMenu/Assets/AssetsSummary/AssetsSummaryList/AssetSummaryList.slice";
import contractassetsitewiseummarylist from "../components/Pages/ContractSubMenu/Assets/AssetSiteWiseSummary/AssetSiteWiseSummaryList/ContractAssetSiteWiseSummaryList.slice"
import summarycreate from "../components/Pages/ContractSubMenu/Assets/AssetsSummary/AssetsSummaryCreate/AssetsSummaryCreate.slice"
import productcategorydetails from "../components/Pages/MasterData/AssetProductCategory/AssetProductCategorySubMenu/ProductCategoryDetails/Details.slice";
import partsnotcovered from "../components/Pages/MasterData/AssetProductCategory/AssetProductCategorySubMenu/ProductCategoryPartsNotCovered/ProductCategoryPartsNotCovered.slice";
import contractinvoicecreate from "../components/Pages/ContractSubMenu/ContractInvoiceSchedule/ContractInvoiceCreate/ContractInvoiceCreate.slice"
import bankmanagement from "../components/Pages/BankManagement/BankManagement.slice";
import tenantregionlist from "../components/Pages/Tenant/TenantSubmenu/TenantRegion/TenantRegionList/TenantRegionList.slice";
import tenantregioncreate from "../components/Pages/Tenant/TenantSubmenu/TenantRegion/TenantRegionCreate/TenantRegionCreate.slice";
import tenantregionupdate from "../components/Pages/Tenant/TenantSubmenu/TenantRegion/TenantRegionEdit/TenantRegionEdit.slice";
import businessmodulelist from '../components/Pages/MasterData/BusinessModule/BusinessModuleList/BusinessModuleList.slice'
import businessfunctionlist from "../components/Pages/MasterData/BusinessFunction/BusinessFunctionList/BusinessFunctionList.slice"
import rolewiselist from "../components/Pages/MasterData/RoleFunctionPermission/RoleWiseList/RoleWiseList.slice"
import assettransfer from "../components/Pages/ContractSubMenu/Assets/AssetsView/AssetTransfer/AssetTransfer.slice";
import assigneeslist from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/AssignEngineer/AssignEngineer.slice";
import assignengineercreate from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/AssignEngineer/AssignEngineerCreate/AssignEngineerCreate.slice";
import deleteengineer from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/AssignEngineer/DeleteEngineer/DeleteEngineer.slice";
import interimcallcreate from "../components/Pages/ServiceRequestManagement/CallCentreManagement/ServiceRequestCreate/InterimCall/InterimCallCreate.slice"
import locationDetails from "../components/Pages/Tenant/TenantSubmenu/TenantOffice/TenantOfficeView/TenantOfficeView.slice";
import tenantview from "../components/Pages/Tenant/TenantView/TenantView.slice"
import callstopsetting from "../components/Pages/ContractSubMenu/ContractSetting/CallStopUpdate/CallStatusUpdate.slice";
import exclusions from "../components/PartsExclusions/PartsExclusions.slice";
import previoustickets from "../components/PreviousServiceRequests/PreviousTicketList.slice";
import interimrequestreview from "../components/Pages/ServiceRequestManagement/InterimRequestManagement/InterimRequestReview/InterimRequestReview.slice"
import contractinvoiceview from "../components/Pages/ContractSubMenu/ContractInvoiceSchedule/ContractInvoiceView/ContractInvoiceView.slice"
import callclosure from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/CallClosure/CallClosure.slice";
import partindentlist from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/PartIndent/PartIndent.slice";
import partindentcart from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/PartIndent/PartIndentCart/PartIndentCart.slice";
import receiptlist from "../components/Pages/Receipt/ReceiptList/ReceiptList.slice"
import receiptview from "../components/Pages/Receipt/ReceiptView/ReceiptView.slice"
import manpowerallocation from "../components/Pages/ContractSubMenu/ContractManPower/ContractManpowerAllocation/ManPowerAllocationList.slice";
import createmanpowerallocation from "../components/Pages/ContractSubMenu/ContractManPower/ContractManpowerAllocation/CreateManpowerAllocation.slice";
import editmanpowerallocation from "../components/Pages/ContractSubMenu/ContractManPower/ContractManpowerAllocation/EditManPowerAllocation.slice";
import bankbranchinfo from "../components/Pages/MasterData/BankBranch/BankBranchView/BankBranchView.slice";
import assetsummaryupdate from "../components/Pages/ContractSubMenu/Assets/AssetsSummary/AssetsSummaryUpdate/AssetsSummaryUpdate.slice";
import contractapprovercreate from '../components/Pages/Settings/ContractSettings/ApproverSetting/ContractApproverCreate/ContractApproverCreate.slice';
import contractapproverlist from '../components/Pages/Settings/ContractSettings/ApproverSetting/ContractApproverList/ContractApproverList.slice';
import contractapproveredit from '../components/Pages/Settings/ContractSettings/ApproverSetting/ContractApproverEdit/ContractApproverEdit.slice';
import productupdate from "../components/Pages/MasterData/Product/ProductEdit/ProdutEdit.slice";
import makeupdate from "../components/Pages/MasterData/Make/MakeEdit/MakeEdit.slice";
import contractrenew from "../components/Pages/ContractSubMenu/ContractSetting/ContractRenew/ContractRenew.slice"
import invoiceprerequisitelist from "../components/Pages/MasterData/InvoicePrerequisite/InvoicePrerequisiteList/InvoicePrerequisiteList.slice"
import invoiceprerequisitecreate from "../components/Pages/MasterData/InvoicePrerequisite/InvoicePrerequisiteCreate/InvoicePrerequisiteCreate.slice"
import contractreviewhistory from "../components/Pages/ContractSubMenu/ContractReviewHistory/ContractReviewHistory.slice"
import invoicependingreason from "../components/Pages/ContractSubMenu/ContractInvoiceSchedule/ContractInvoiceView/InvoicePendingReason/InvoicePendingReason.slice"
import contractdashboard from "../components/Pages/ContractSubMenu/ContractDashboard/ContractDashboard.slice";
import userloginhistory from "../components/Pages/UserProfile/UserLoginHistory/UserLoginHistory.slice";
import bankguaranteelist from "../components/Pages/ContractSubMenu/ContractBankGuarantee/BankGuaranteeList/BankGuaranteeList.slice"
import bankguaranteecreate from "../components/Pages/ContractSubMenu/ContractBankGuarantee/BankGuaranteeCreate/BankGuaranteeCreate.slice"
import bankguaranteeedit from "../components/Pages/ContractSubMenu/ContractBankGuarantee/BankGuaranteeEdit/BankGuaranteeEdit.slice"
import bankcollectionmanagement from "../components/Pages/BankCollection/BankCollectionManagement/BankCollectionManagement.slice"
import bargraphmanagement from "../components/DashboardWidget/BarGraph/BarGraphManagement.slice"
import callstopnotification from "../components/DashboardWidget/CallStopNotification/CallStopNotification.slice"
import customerspending from "../components/Pages/CustomerManagement/CustomerPendingList/CustomerPendingList.slice"
import bankcollectionlist from "../components/Pages/BankCollection/BankCollectionList/BankCollectionList.slice"
import invoiceschedulelist from "../components/Pages/InvoiceManagement/InvoiceScheduleList/InvoiceScheduleList.slice"
import bankcollectionprocess from "../components/Pages/BankCollection/BankCollectionProcess/BankCollectionProcess.slice"
import bankcollectionuploadexcel from "../components/Pages/BankCollection/BankCollectionManagement/BankCollectionUploadExcel/BankCollectionUploadExcel.slice"
import contractclose from "../components/Pages/ContractSubMenu/ContractSetting/ContractClose/ContractClose.slice";
import customermanagement from "../components/Pages/CustomerManagement/CustomerManagement.slice";
import contractsettinglist from "../components/Pages/ContractSubMenu/ContractSetting/ContractSettingList/ContractSettingList.slice"
import invoicereconciliationlist from "../components/Pages/InvoiceReconciliation/InvoiceReconciliationList/InvoiceReconciliationList.slice";
import customersdraft from "../components/Pages/CustomerManagement/CustomerDraftList/CustomerDraftList.slice";
import callexpiryextend from "../components/Pages/ContractSubMenu/ContractSetting/CallExpiryExtend/CallExpiryExtend.slice"
import einvoicelist from "../components/Pages/Queue/EInvoice/EInvoiceList.slice";
import stockbinlist from "../components/Pages/MasterData/StockBin/StockBinList/StockBin.slice";
import stockbincreate from "../components/Pages/MasterData/StockBin/StockBinCreate/StockBinCreate.slice";
import stockroomcreate from "../components/Pages/MasterData/StockRoom/StockRoomCreate/StockRoomCreate.slice";
import stockroomlist from "../components/Pages/MasterData/StockRoom/StockRoomList/StockRoomList.slice";
import partstocklist from "../components/Pages/Inventory/Stock/PartStock/PartStockList/PartStockList.slice"
import partstockcreate from "../components/Pages/Inventory/Stock/PartStock/PartStockCreate/PartStockCreate.slice"
import partstockdetaillist from "../components/Pages/Inventory/Stock/PartStockDetail/PartStockDetailList/PartStockDetailList.slice";
import contractrevenuerecognitionlist from "../components/Pages/ContractSubMenu/RevenueRecognition/RevenueRecognitionList/ContractRevenueRecognitionList.slice";
import customersiteupdate from "../components/Pages/CustomerSubMenu/Site/CustomerSiteUpdate/UpdateCustomerSite.slice";
import availablepartlist from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/PartIndent/AvailablePartList/AvailablePartList.slice"
import partindentmanagement from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/PartIndent/PartIndentManagement/PartIndentManagement.slice";
import partindentrequestlist from "../components/Pages/Inventory/PartIndentRequest/PartIndentRequestList/PartIndentRequestList.slice";
import contractinvoiceshare from "../components/Pages/ContractSubMenu/ContractInvoiceSchedule/ContractInvoiceShare/ContractInvoiceShare.slice";
import partindentreview from "../components/Pages/Inventory/PartIndentRequest/PartIndentReview/PartIndentReview.slice"
import invoicereconciliationtaxupload from "../components/Pages/InvoiceReconciliation/TaxUpload/TaxUpload.slice";
import assetdetailupdate from "../components/Pages/ContractSubMenu/Assets/AssetDetailUpdate/AssetDetailUpdate.slice";
import contractpartindentsummary from "../components/Pages/ContractSubMenu/ContractDashboard/ContractPartIndentSummary/ContractPartIndentSummary.slice";
import creategirn from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/GoodsIssuedReceivedNote/GINAllocation/GINAllocatePart.slice";
import callcordinatormanagement from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorManagement.slice"
import callcentremanagement from "../components/Pages/ServiceRequestManagement/CallCentreManagement/CallCentreManagement.slice"
import callcentreservicerequestdetails from "../components/Pages/ServiceRequestManagement/CallCentreManagement/ServiceRequestView/ServiceRequestView.slice";
import requestpurchaseorder from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/RequestPO/RequestPO.slice";
import demanddetail from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandView/PartIndentDemandView.slice";
import createpurchaseorder from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/CreatePO/CreatePO.slice";
import goodsreceivednotelist from "../components/Pages/GoodsReceivedNote/GRNList/GRNList.slice";
import creategrn from "../components/Pages/GoodsReceivedNote/CreateGoodReceivedNote/CreateGRN/CreateGRN.slice";
import purchaseorders from "../components/Pages/GoodsReceivedNote/CreateGoodReceivedNote/PurchaseOrders/PurchaseOrders.slice";
import creategoodsreceivednotedetail from "../components/Pages/GoodsReceivedNote/CreateGoodReceivedNote/CreateGoodsReceviedNoteDetail/CreateGoodsReceivedNoteDetail.slice";
import goodsreceivednotedetaillist from "../components/Pages/GoodsReceivedNote/GRNDList/GRNDetailList.slice";
import partindentdemandlistcwh from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandListCWH/PartIndentDemandListCWH.slice";
import partcodificationrequestview from "../components/Pages/PendingApproval/PendingApprovalView/PartCodificationRequestView/PartCodificationRequestView.slice"
import userrequestview from "../components/Pages/PendingApproval/PendingApprovalView/UserRequestView/UserRequestView.slice"
import financeinterimservicerequestlist from "../components/Pages/ServiceRequestManagement/InterimRequestManagement/InterimRequestList/FinanceInterimRequestList/FinanceInterimRequestList.slice"
import assetinterimservicerequestlist from "../components/Pages/ServiceRequestManagement/InterimRequestManagement/InterimRequestList/AssetInterimRequestList/AssetInterimRequestList.slice";
import partallocateddemand from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandAllocated/PartIndentDemandAllocated.slice";
import partindentdemandlogisticsnotallocated from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandListLogistics/PartIndentDemandsCompleted/PartIndentDemandCompleted.slice";
import partindentdemandlogisticsallocated from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandListLogistics/PartIndentDemandsPending/PartIndentDemandsPending.slice";
import demandsmanagement from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandListLogistics/DemandListManagement.slice";
import partsubcategorylist from "../components/Pages/MasterData/PartSubCategory/PartSubCategoryList/PartSubCategoryList.slice"
import partsubcategoryedit from "../components/Pages/MasterData/PartSubCategory/PartSubCategoryEdit/PartSubCategoryEdit.slice"
import assetproductcategorylist from "../components/Pages/MasterData/AssetProductCategory/AssetProductCategoryList/AssetProductCategoryList.slice"
import assetproductcategorycreate from "../components/Pages/MasterData/AssetProductCategory/AssetProductCategoryCreate/AssetProductCategoryCreate.slice"
import partstockbasket from "../components/Pages/Inventory/Stock/PartStock/PartStockBasket/PartStockBasket.slice";
import deliverychallanlist from "../components/Pages/GoodsReceivedNote/CreateGoodReceivedNote/DeliveryChallanList/DeliveryChallanlist.slice";
import partreturnlist from "../components/Pages/GoodsReceivedNote/CreateGoodReceivedNote/PartReturnList/PartReturnList.slice";
import callstatusdetails from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/Others/CurrentCallStatus/CurrentCallStatusView/CallStatusView.slice"
import allusersloginhistory from "../components/Pages/UserManagement/UserLoginHistory/UsersLoginHistory.slice"
import assetdetailsforcallcordinator from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/AssetDetails/AssetDetails.slice"
import deliverychallans from "../components/Pages/Inventory/DeliveryChallans/ListDeliveryChallan/DeliveryChallans.slice";
import deliverychallandetail from "../components/Pages/Inventory/DeliveryChallans/DeliveryChallanView/DeliveryChallanView.slice";
import deliverychallanforgin from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandAllocated/CreateDeliveryChallan.slice";
import purchaseorderlist from "../components/Pages/Inventory/ListPurchaseOrders/PurchaseOrderList/PurchaseOrderList.slice";
import purchaseorderdetail from "../components/Pages/Inventory/ListPurchaseOrders/PurchaseOrderView/PurchaseOrderView.slice";
import partreturnreport from "../components/Pages/Reports/ReportsSubmenu/PartReturnReport/PartReturnReport.slice";
import pendingcallreport from "../components/Pages/Reports/ReportsSubmenu/PendingCallReport/PendingCallReport.slice";
import contractrenewduereport from "../components/Pages/Reports/ReportsSubmenu/ContractRenewalDueReport/ContractRenewalDueReport.slice";
import partsubcategorycreate from "../components/Pages/MasterData/PartSubCategory/PartSubCategoryCreate/PartSubCategoryCreate.slice";
import imprestpurchaseorderparts from "../components/Pages/Inventory/ImprestPurchaseOrder/PartListImprestPO/PartListImprestPO.slice";
import createimprestpo from "../components/Pages/Inventory/ImprestPurchaseOrder/CreateImprestPurchaseOrder/CreateImprestPurhaseOrder.slice";
import invoicecollectionreport from "../components/Pages/Reports/ReportsSubmenu/InvoiceReport/InvoiceCollectionReport/InvoiceCollectionReport.slice"
import outstandingpaymentreport from "../components/Pages/Reports/ReportsSubmenu/InvoiceReport/OutstandingPaymentReport/OutstandingPaymentReport.slice"
import chequeexcelupload from "../components/Pages/BankCollection/BankCollectionManagement/ChequeExcelUpload/ChequeExcelUpload.slice"
import callcordinatortableview from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorTableView/CallCordinatorTableView.slice"
import impreststockcustomer from "../components/Pages/Inventory/Stock/PartStock/StockManagement/ImprestStockCutomerCreate/ImprestStockCustomer.slice";
import stocktransferdc from "../components/Pages/Inventory/Stock/PartStock/StockManagement/InternalStocktransferDC/StockTransferDC.slice";
import invoicecollectiondetail from "../components/Pages/InvoiceManagement/InvoiceCollectionDetail/InvoiceCollectionDetail.slice";
import assetdetailsforsme from "../components/Pages/SME/SmeHome/SmeHomeAssets/SmeHomeAssets.slice";
import calldetailsforsme from "../components/Pages/SME/SmeHome/SmeHomeCalls/SmeHomeCalls.slice";
import partdetailsforsme from "../components/Pages/SME/SmeHome/SmeHomeParts/SmeHomeParts.slice"
import barcodereport from "../components/Pages/Reports/ReportsSubmenu/BarcodeReport/BarcodeReport.slice";
import partindentrequestdetailslist from "../components/Pages/SME/SmeIndentDetails/SmeIndentDetail/SmeIndentDetails.slice"
import preamcpendingassetlist from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcPendingAssets/PreAmcPendingAssets.slice"
import revenueduereport from "../components/Pages/Reports/ReportsSubmenu/InvoiceReport/RevenueDueReport/RevenueDueReport.slice"
import preamccontractlist from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcContracts/PreAmcContracts.slice"
import preamcsitewiselist from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcContracts/PreAmcSites/PreAmcSites.slice"
import billingdetailreport from "../components/Pages/Reports/ReportsSubmenu/InvoiceReport/BillingDetailReport/BillingDetailReport.slice";
import createbulkpo from "../components/Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandListCWH/CreateBulkPO/CreateBulkPO.slice";
import smeindentdetailsview from "../components/Pages/SME/SmeIndentDetails/SmeIndentDetailView/SmeIndentDetailView.slice"
import bankcollectioncancelclaim from "../components/Pages/BankCollection/BankCollectionCancelClaim/BankCollectionCancelClaim.slice"
import partedit from "../components/Pages/MasterData/Part/PartEdit/PartEdit.slice";
import fiatengreport from "../components/Pages/Reports/ReportsSubmenu/FIATEngineerDetailReport/FIATReport.slice";
import fiatrecountreport from "../components/Pages/Reports/ReportsSubmenu/FIATRECountReport/FIATRECountReport.slice";
import demandreport from "../components/Pages/Reports/ReportsSubmenu/DemandReport/DemandReport.slice";
import consumptionsummaryreport from "../components/Pages/Reports/ReportsSubmenu/ConsumptionSummaryReport/ConsumptionSummaryReport.slice";
import consumptionreport from "../components/Pages/Reports/ReportsSubmenu/ConsumptionReport/ConsumptionReport.slice";
import deleteusers from "../components/Pages/UserManagement/UsersList/DeleteUsers/DeleteUsers.slice";
import userspending from "../components/Pages/UserManagement/UserPendingList/UserPendingList.slice"
import disableusers from "../components/Pages/UserManagement/UsersList/BulkUserDisable/BulkUserDisable.slice";
import assetproductcategoryedit from "../components/Pages/MasterData/AssetProductCategory/AssetProductCategoryEdit/AssetProductCategoryEdit.slice";
import bankedit from "../components/Pages/BankManagement/BankEdit/BankEdit.slice";
import bankbranchedit from "../components/Pages/MasterData/BankBranch/BankBranchEdit/BankBranchEdit.slice";
import divisionedit from "../components/Pages/MasterData/Division/DivisionEdit/DivisionEdit.slice";
import citycreate from "../components/Pages/MasterData/City/CityCreate/CityCreate.slice";
import cityedit from "../components/Pages/MasterData/City/CityEdit/CityEdit.slice";
import countrylist from "../components/Pages/MasterData/Country/CountryList/CountryList.slice";
import countrycreate from "../components/Pages/MasterData/Country/CountryCreate/CountryCreate.slice";
import countryedit from "../components/Pages/MasterData/Country/CountryEdit/CountryEdit.slice";
import customergroupedit from "../components/Pages/MasterData/CustomerGroup/CustomerGroupEdit/CustomerGroupEdit.slice";
import designationupdate from "../components/Pages/MasterData/Designation/DesignationUpdate/DesignationUpdate.slice";
import partcategoryedit from "../components/Pages/MasterData/PartCategory/PartCategoryEdit/PartCategoryEdit.slice";
import partproductcategoryedit from "../components/Pages/MasterData/PartProductCategory/PartProductCategoryEdit/PartProductCategoryEdit.slice";
import statecreate from "../components/Pages/MasterData/States/StateCreate/StateCreate.slice";
import stateedit from "../components/Pages/MasterData/States/StateEdit/StateEdit.slice";
import statelist from "../components/Pages/MasterData/States/StateList.slice";
import auditlogs from "../components/Pages/Settings/AuditLogs/AuditLogs.slice"
import tenantprofileedit from "../components/Pages/Tenant/TenantSubmenu/TenantProfile/TenantProfileEdit/TenantProfileEdit.slice"
import paymentfrequencyupdate from "../components/Pages/MasterData/PaymentFrequency/PaymentFrequencyEdit/PaymentFrequencyEdit.slice";
import stockbinedit from "../components/Pages/MasterData/StockBin/StockBinEdit/StockBinEdit.slice";
import stockroomedit from "../components/Pages/MasterData/StockRoom/StockRoomEdit/StockRoomEdit.slice";
import bankrequestview from "../components/Pages/PendingApproval/PendingApprovalView/BankRequestView/BankRequestView.slice"
import bankpendingview from "../components/Pages/BankManagement/BankPendingView/BankPendingView.slice"
import preamcmanagement from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcManagement.slice"
import preamcupdate from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcPendingAssets/PreAmcUpdate/PreAmcUpdate.slice"
import preamcbulkupdate from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcPendingAssets/PreAmcBulkUpdate/PreAmcBulkUpdate.slice"
import preamcpendingsitelist from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcPendingSites/PreAmcPendingSites.slice"
import userpendingrequestview from "../components/Pages/UserManagement/UserPendingView/UserPendingView.slice";
import loggeduserprofile from "../components/Pages/UserProfile/LoggedUserProfileInfo/LoggedUserProfileInfo.slice";
import userpendingedit from "../components/Pages/UserManagement/UserPedingEdit/UserPendingEdit.slice"
import documentnumberserieslist from "../components/Pages/Settings/DocumentNumberSeries/DocumentNumberSeries.slice";
import customersitereport from "../components/Pages/Reports/ReportsSubmenu/CustomerSiteReport/CustomerSiteReport.slice";
import pmassetdetailreport from "../components/Pages/Reports/ReportsSubmenu/PMAssetDetailReport/PMAssetDetailReport.slice"
import pmassetsummaryreport from "../components/Pages/Reports/ReportsSubmenu/PMAssetSummaryReport/PMAssetSummaryReport.slice"
import preamcassetdetailreport from "../components/Pages/Reports/ReportsSubmenu/PreAmcAssetDetailReport/PreAmcAssetDetailReport.slice"
import preamcassetsummaryreport from "../components/Pages/Reports/ReportsSubmenu/PreAmcAssetSummaryReport/PreAmcAssetSummaryReport.slice"
import contractdashboardfilter from "../components/Pages/ContractManagement/ContractDashboard/ContractDashboard.slice"
import documentnumberformat from "../components/Pages/Settings/DocumentNumberFormat/DocumentNumberFormat.slice";
import gsttaxratelist from "../components/Pages/MasterData/GST Tax Rate/GstList.slice"
import gsttaxview from "../components/Pages/MasterData/GST Tax Rate/GST Tax View/GstTaxView.slice"
import gstedit from "../components/Pages/MasterData/GST Tax Rate/GST Tax Edit/GstTaxEdit.slice"
import backtobackvendorupload from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/ExcelUploadManagement/BackToBackVendorUpload/BackToBackVendorUpload.slice"
import preamcdonebulkupload from "../components/Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/ExcelUploadManagement/PreAmcDoneUpload/PreAmcDoneUpload.slice"
import numberformatcreate from "../components/Pages/Settings/DocumentNumberFormat/DocumentNumberFormatCreate/DocumentNumberFormatCreate.slice";
import futureupddatelist from "../components/Pages/ContractSubMenu/FutureUpdates/FutureUpdatesList/FutureUpdateList.slice"
import futureupdatecreate from "../components/Pages/ContractSubMenu/FutureUpdates/FutureUpdateCreate/FutureUpdateCreate.slice"
import editfutureupdate from "../components/Pages/ContractSubMenu/FutureUpdates/FutureUpdateEdit/FutureUpdateEdit.slice"
import assetfilters from "../components/Pages/ContractSubMenu/Assets/AssetFilter/AssetFilter.slice"
import approvaleventlist from "../components/Pages/ApprovalWorkflow/ApprovalEvent/ApprovalEventList.slice"
import eventconditionmasterlist from "../components/Pages/ApprovalWorkflow/EventConditionMasterList/EventConditionMasterList.slice"
import eventconditionlist from "../components/Pages/ApprovalWorkflow/EventConditionList/EventConditionList.slice"
import eventconditioncreate from "../components/Pages/ApprovalWorkflow/EventConditionCreate/EventConditionCreate.slice"
import approvalworkflowcreate from "../components/Pages/ApprovalWorkflow/ApprovalWorkflowCreate/ApprovalWorkflowCreate.slice"
import assetview from "../components/Pages/ContractSubMenu/Assets/AssetsView/AssetView.slice"
import eventconditionsort from "../components/Pages/ApprovalWorkflow/EventConditionSort/EventConditionSort.slice"
import numberformatedit from "../components/Pages/Settings/DocumentNumberFormat/DocumentNumberFormatEdit/DocumentNumberFormatEdit.slice";
import documentnumberformathome from "../components/Pages/Settings/DocumentNumberHome/DocumentNumberHome.slice";
import pmschedulelist from "../components/Pages/ContractSubMenu/PmSchedule/PmScheduleList/PmScheduleList.slice"
import pmscheduledetails from "../components/Pages/ContractSubMenu/PmSchedule/PmScheduleView/PmScheduleView.slice"
import lookupdataedit from "../components/Pages/LookupData/LookupDataEdit/LookupDataEdit.slice";
import customerrequestinfo from "../components/Pages/PendingApproval/PendingApprovalView/CustomerRequestView/CustomerRequestView.slice";
import customerpendingview from "../components/Pages/CustomerManagement/CustomerPendingList/CustomerPendingView/CustomerPendingView.slice";
import eventconditionedit from "../components/Pages/ApprovalWorkflow/EventConditionEdit/EventConditionEdit.slice";
import contractassetdownload from "../components/Pages/ContractSubMenu/Assets/AssetDownload/ContractAssetDownload.slice"
const middlewareConfiguration = { serializableCheck: false };
export const store = configureStore({
  reducer: {
    app,
    login,
    forgotPassword,
    codeverification,
    changePassword,
    passwordReset,
    usercreate,
    useredit,
    userStatus,
    usermanagement,
    allusersloginhistory,
    userhistory,
    bankapprovalrequestcreate,
    approvalsmanagement,
    banksapproved,
    bankspending,
    contractmanagement,
    contractcreate,
    bookingdetailreport,
    citieslist,
    contractdocumentlist,
    contractdocumentcreate,
    contractview,
    generalcontractdetails,
    approvarequestdetails,
    approvalworkflowlist,
    approvalworkflowview,
    approvalworkflowdetailcreate,
    approvalworkflowdetailedit,
    approvalworkflowedit,
    approvalrequestreview,
    bankapprovalrequestedit,
    manpowersummarycreate,
    manpowermanagement,
    manpoweredit,
    preloader,
    lookupdata,
    lookupdatacreate,
    assetscreate,
    assetslist,
    usercount,
    contractcount,
    contractcustomer,
    customerlist,
    customercreate,
    customerupdate,
    customerprofile,
    userprofile,
    profile,
    customersitemanagement,
    customersitecreate,
    changeuserPassword,
    contractcustomersitemanagement,
    contractcustomersitecreate,
    contractpreamcmanagement,
    assignengineer,
    servicerequestcreate,
    servicerequestedit,
    contractedit,
    divisionlist,
    divisioncreate,
    assetdocumentupload,
    tenantcreate,
    tenantlist,
    sitedocumentupload,
    bankbranchlist,
    bankbranchcreate,
    locationsetting,
    partproductcategorycreate,
    partproductcategorylist,
    makecreate,
    makelist,
    productcreate,
    productlist,
    tenantprofile,
    designationlist,
    designationcreate,
    businesseventlist,
    partcategorylist,
    partcategorycreate,
    rolelist,
    rolecreate,
    partlist,
    partcreate,
    partsubcategorycreate,
    customergrouplist,
    customergroupcreate,
    eventwise,
    rolewise,
    tenantofficelist,
    tenantofficecreate,
    tenantofficeedit,
    contracthistory,
    paymentfrequencylist,
    paymentfrequencycreate,
    tenantbankaccountlist,
    tenantbankaccountcreate,
    tenantbankaccountdetails,
    appsetting,
    contractinvoiceschedulelist,
    contractapprovalrequest,
    contractrenew,
    vendorlist,
    vendorcreate,
    vendoredit,
    vendordetails,
    vendorbranchedit,
    vendorbranchlist,
    vendorbankaccountlist,
    vendorbankaccountedit,
    vendorbankaccountcreate,
    vendorbranchcreate,
    assetsummarylist,
    contractassetsitewiseummarylist,
    summarycreate,
    contractinvoicecreate,
    productcategorydetails,
    partsnotcovered,
    bankmanagement,
    tenantregionlist,
    tenantregioncreate,
    tenantregionupdate,
    businessmodulelist,
    businessfunctionlist,
    rolewiselist,
    assettransfer,
    callstopsetting,
    assigneeslist,
    assignengineercreate,
    deleteengineer,
    interimcallcreate,
    locationDetails,
    tenantview,
    roleedit,
    exclusions,
    callclosure,
    previoustickets,
    interimrequestreview,
    contractinvoiceview,
    partindentlist,
    partindentcart,
    receiptlist,
    receiptview,
    manpowerallocation,
    createmanpowerallocation,
    editmanpowerallocation,
    bankbranchinfo,
    assetsummaryupdate,
    contractapproverlist,
    contractapprovercreate,
    contractapproveredit,
    productupdate,
    invoiceprerequisitelist,
    invoiceprerequisitecreate,
    contractreviewhistory,
    userloginhistory,
    makeupdate,
    auditlogs,
    invoicependingreason,
    contractdashboard,
    bankguaranteelist,
    bankguaranteecreate,
    bankguaranteeedit,
    bargraphmanagement,
    bankcollectionlist,
    invoiceschedulelist,
    bankcollectionprocess,
    bankcollectionmanagement,
    bankcollectionuploadexcel,
    contractclose,
    customerspending,
    customermanagement,
    invoicereconciliationlist,
    contractsettinglist,
    customersdraft,
    callexpiryextend,
    einvoicelist,
    callstopnotification,
    stockbinlist,
    stockbincreate,
    stockroomcreate,
    stockroomlist,
    partstocklist,
    partstockcreate,
    partstockdetaillist,
    contractrevenuerecognitionlist,
    customersiteupdate,
    availablepartlist,
    partindentmanagement,
    partindentrequestlist,
    partindentreview,
    contractpartindentsummary,
    contractinvoiceshare,
    invoicereconciliationtaxupload,
    assetdetailupdate,
    partindentdemandlogisticsallocated,
    partindentdemandlogisticsnotallocated,
    creategirn,
    callcordinatormanagement,
    callcentremanagement,
    callstatusdetails,
    callcentreservicerequestdetails,
    requestpurchaseorder,
    demanddetail,
    createpurchaseorder,
    goodsreceivednotelist,
    creategrn,
    purchaseorders,
    creategoodsreceivednotedetail,
    goodsreceivednotedetaillist,
    partindentdemandlistcwh,
    partcodificationrequestview,
    financeinterimservicerequestlist,
    assetinterimservicerequestlist,
    partallocateddemand,
    demandsmanagement,
    partsubcategorylist,
    partsubcategoryedit,
    assetproductcategorylist,
    assetproductcategorycreate,
    partstockbasket,
    deliverychallanlist,
    partreturnlist,
    assetdetailsforcallcordinator,
    deliverychallans,
    deliverychallandetail,
    deliverychallanforgin,
    purchaseorderlist,
    purchaseorderdetail,
    partreturnreport,
    imprestpurchaseorderparts,
    createimprestpo,
    invoicecollectionreport,
    outstandingpaymentreport,
    assetdetailsforsme,
    calldetailsforsme,
    pendingcallreport,
    callcordinatortableview,
    impreststockcustomer,
    stocktransferdc,
    invoicecollectiondetail,
    barcodereport,
    preamcpendingassetlist,
    revenueduereport,
    partdetailsforsme,
    chequeexcelupload,
    billingdetailreport,
    contractrenewduereport,
    partindentrequestdetailslist,
    preamccontractlist,
    preamcsitewiselist,
    createbulkpo,
    smeindentdetailsview,
    bankcollectioncancelclaim,
    partedit,
    fiatengreport,
    fiatrecountreport,
    deleteusers,
    userrequestview,
    userspending,
    disableusers,
    demandreport,
    consumptionsummaryreport,
    consumptionreport,
    assetproductcategoryedit,
    bankedit,
    bankbranchedit,
    divisionedit,
    citycreate,
    cityedit,
    countrylist,
    countrycreate,
    countryedit,
    customergroupedit,
    designationupdate,
    partcategoryedit,
    partproductcategoryedit,
    statecreate,
    stateedit,
    statelist,
    tenantprofileedit,
    paymentfrequencyupdate,
    stockbinedit,
    stockroomedit,
    bankrequestview,
    bankpendingview,
    userpendingrequestview,
    loggeduserprofile,
    preamcmanagement,
    preamcupdate,
    preamcbulkupdate,
    preamcpendingsitelist,
    userpendingedit,
    customersitereport,
    pmassetdetailreport,
    pmassetsummaryreport,
    preamcassetdetailreport,
    preamcassetsummaryreport,
    documentnumberserieslist,
    contractdashboardfilter,
    documentnumberformat,
    gsttaxratelist,
    gsttaxview,
    gstedit,
    numberformatcreate,
    backtobackvendorupload,
    preamcdonebulkupload,
    assetfilters,
    approvaleventlist,
    eventconditionmasterlist,
    eventconditionlist,
    eventconditioncreate,
    approvalworkflowcreate,
    futureupddatelist,
    futureupdatecreate,
    editfutureupdate,
    assetview,
    eventconditionsort,
    numberformatedit,
    documentnumberformathome,
    lookupdataedit,
    customerrequestinfo,
    customerpendingview,
    eventconditionedit,
    pmschedulelist,
    pmscheduledetails,
    contractassetdownload
  },
  devTools: {
    name: 'BeSure',
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfiguration),
});
export type State = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
  return () => store.dispatch(action);
} 