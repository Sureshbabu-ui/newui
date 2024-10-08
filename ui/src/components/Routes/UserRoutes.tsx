import { Route, Redirect, Switch, RouteProps } from 'react-router-dom';
import { useStore } from '../../state/storeHooks';
import { Dashboard } from '../Pages/Dashboard/Dashboard';
import { ContractManagement } from '../Pages/ContractManagement/ContractManagement';
import { PasswordReset } from '../Pages/PasswordReset/PasswordReset';
import { BankManagement } from '../Pages/BankManagement/BankManagement';
import { PendingApprovals } from '../Pages/PendingApproval/PendingApprovalList/PendingApprovals';
import { ContractView } from '../Pages/ContractView/ContractView';
import { CustomerView } from '../Pages/CustomerView/CustomerView';
import { UserProfile } from '../Pages/UserProfile/UserProfile';
import { PersonalInfo } from '../Pages/UserProfile/ProfileInfo'
import { ContractEdit } from '../Pages/ContractManagement/ContractEdit';
import { DivisionList } from '../Pages/MasterData/Division/DivisionList/DivisionList';
import { SettingsView } from '../Pages/Settings/SettingsView/SettingsView';
import { BankBranchList } from '../Pages/MasterData/BankBranch/BankBranchList/BankBranchList';
import { PartProductCategoryList } from '../Pages/MasterData/PartProductCategory/PartProductCategoryList/PartProductCategoryList';
import { MakeList } from '../Pages/MasterData/Make/MakeList/MakeList';
import { ProductList } from '../Pages/MasterData/Product/ProductList/ProductList';
import { TenantView } from '../Pages/Tenant/TenantView/TenantView';
import { RoleList } from '../Pages/MasterData/Role/RoleList/RoleList';
import { DesignationList } from '../Pages/MasterData/Designation/DesignationList/DesignationList';
import { BusinessEventList } from '../Pages/MasterData/BusinessEvents/BusinessEventList/BusinessEventList';
import { CustomerGroupList } from '../Pages/MasterData/CustomerGroup/CustomerGroupList/CustomerGroupList';
import { PartCategoryList } from '../Pages/MasterData/PartCategory/PartCategoryList/PartCategoryList';
import { PartList } from '../Pages/MasterData/Part/PartList/PartList';
import { PaymentFrequencyList } from '../Pages/MasterData/PaymentFrequency/PaymentFrequencyList/PaymentFrequencyList';
import { VendorManagement } from '../Pages/Vendor/VendorList/VendorList';
import { ContractInvoiceScheduleCreate } from '../Pages/ContractSubMenu/ContractInvoiceSchedule/ContractInvoiceCreate/ContractInvoiceCreate';
import { CreateContract } from '../Pages/CreateContract/CreateContract';
import { ProductCategoryView } from '../Pages/MasterData/AssetProductCategory/AssetProductCategoryView/ProductCategoryView';
import { BusinessModuleList } from '../Pages/MasterData/BusinessModule/BusinessModuleList/BusinessModuleList';
import { BusinessFunctionList } from '../Pages/MasterData/BusinessFunction/BusinessFunctionList/BusinessFunctionList';
import { RoleFunctionPermissionList } from '../Pages/MasterData/RoleFunctionPermission/RoleFunctionPermissionList/RoleFunctionPermissionList';
import RequestApproval from '../Pages/ContractSubMenu/General/ContractApprovalRequest/RequestApproval/RequestApproval';
import { CustomerEdit } from '../Pages/CustomerManagement/CustomerEdit/CustomerEdit';
import { ContractInvoiceView } from '../Pages/ContractSubMenu/ContractInvoiceSchedule/ContractInvoiceView/ContractInvoiceView';
import { ReceiptList } from '../Pages/Receipt/ReceiptList/ReceiptList';
import { ReceiptView } from '../Pages/Receipt/ReceiptView/ReceiptView';
import { ContractRenew } from '../Pages/ContractSubMenu/ContractSetting/ContractRenew/ContractRenew';
import { MasterView } from '../Pages/Masters/MasterView';
import { InvoicePrerequisiteList } from '../Pages/MasterData/InvoicePrerequisite/InvoicePrerequisiteList/InvoicePrerequisiteList';
import { CreateCustomer } from '../Pages/CreateCustomer/CreateCustomer';
import CustomerManagement from '../Pages/CustomerManagement/CustomerManagement';
import { BankCollectionManagement } from '../Pages/BankCollection/BankCollectionManagement/BankCollectionManagement'
import { BankCollectionList } from '../Pages/BankCollection/BankCollectionList/BankCollectionList';
import { InvoiceReconciliationList } from '../Pages/InvoiceReconciliation/InvoiceReconciliationList/InvoiceReconciliationList';
import { StateList } from '../Pages/MasterData/States/StatesList';
import { QueueManagement } from '../Pages/Queue/QueueManagement/QueueManagement';
import { EInvoiceList } from '../Pages/Queue/EInvoice/EInvoiceList';
import { StockBinList } from '../Pages/MasterData/StockBin/StockBinList/StockBinList';
import { StockRoomList } from '../Pages/MasterData/StockRoom/StockRoomList/StockRoomList';
import { PartStockList } from '../Pages/Inventory/Stock/PartStock/PartStockList/PartStockList';
import PartStockDetailList from '../Pages/Inventory/Stock/PartStockDetail/PartStockDetailList/PartStockDetailList';
import PartIndentRequestList from '../Pages/Inventory/PartIndentRequest/PartIndentRequestList/PartIndentRequestList';
import { VendorView } from '../Pages/Vendor/VendorView/VendorView';
import CreateUser from '../Pages/UserManagement/CreateUser/CreateUser';
import { CallCordinatorManagement } from '../Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorManagement';
import { CallCentreManagement } from '../Pages/ServiceRequestManagement/CallCentreManagement/CallCentreManagement';
import { PartIndentDemandDetail } from '../Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandView/PartIndentDemandView';
import { PartIndentRequestView } from '../Pages/Inventory/PartIndentRequest/PartIndentRequestList/PartIndentRequestView';
import { GoodsReceivedNoteList } from '../Pages/GoodsReceivedNote/GRNList/GRNList';
import { EditUser } from '../Pages/UserManagement/EditUser/EditUser';
import { ServiceRequestCreate } from '../Pages/ServiceRequestManagement/CallCentreManagement/ServiceRequestCreate/ServiceRequestCreate';
import { ServiceRequestEdit } from '../Pages/ServiceRequestManagement/CallCentreManagement/ServiceRequestEdit/ServiceRequestEdit';
import { CreateGRN } from '../Pages/GoodsReceivedNote/CreateGoodReceivedNote/CreateGRN/CreateGRN';
import { CreateGoodReceivedNoteDetail } from '../Pages/GoodsReceivedNote/CreateGoodReceivedNote/CreateGoodsReceviedNoteDetail/CreateGoodsReceivedNoteDetail';
import { GoodsReceivedNoteDetailList } from '../Pages/GoodsReceivedNote/GRNDList/GRNDetailList';
import PartIndentDemandListCWH from '../Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandListCWH/PartIndentDemandListCWH';
import InvoiceScheduleList from '../Pages/InvoiceManagement/InvoiceScheduleList/InvoiceScheduleList';
import { PartIndentDemandAllocated } from '../Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandAllocated/PartIndentDemandAllocated';
import DemandsManagement from '../Pages/Inventory/PartIndentRequest/PartIndentDemand/PartIndentDemandListLogistics/DemandListManagement';
import CallStatusReport from '../Pages/ServiceRequestManagement/CallCordinatorManagement/CallCordinatorView/Submenu/Others/CurrentCallStatus/CurrentCallStatusView/CallStatusView';
import { AssetInterimRequestList } from '../Pages/ServiceRequestManagement/InterimRequestManagement/InterimRequestList/AssetInterimRequestList/AssetInterimRequestList';
import { FinanceInterimRequestList } from '../Pages/ServiceRequestManagement/InterimRequestManagement/InterimRequestList/FinanceInterimRequestList/FinanceInterimRequestList';
import { InterimAssetReview } from '../Pages/ServiceRequestManagement/InterimRequestManagement/InterimRequestReview/InterimAssetReview/InterimAssetReview';
import { InterimFinanceReview } from '../Pages/ServiceRequestManagement/InterimRequestManagement/InterimRequestReview/InterimFinanceReview/InterimFinanceReview';
import { ReportHome } from '../Pages/Reports/ReportHome';
import { AssetProductCategoryList } from '../Pages/MasterData/AssetProductCategory/AssetProductCategoryList/AssetProductCategoryList';
import { AboutView } from '../Pages/About/About';
import { DeliveryChallans } from '../Pages/Inventory/DeliveryChallans/ListDeliveryChallan/DeliveryChallans';
import { DeliveryChallanView } from '../Pages/Inventory/DeliveryChallans/DeliveryChallanView/DeliveryChallanView';
import { UsersLoginHistory } from '../Pages/UserManagement/UserLoginHistory/UsersLoginHistory';
import { PartSubCategoryList } from '../Pages/MasterData/PartSubCategory/PartSubCategoryList/PartSubCategoryList';
import { PurchaseOrderList } from '../Pages/Inventory/ListPurchaseOrders/PurchaseOrderList/PurchaseOrderList';
import { PartListImprestPurchaseOrder } from '../Pages/Inventory/ImprestPurchaseOrder/PartListImprestPO/PartListImprestPO';
import { SmeView } from '../Pages/SME/Sme';
import InvoiceCollectionDetail from '../Pages/InvoiceManagement/InvoiceCollectionDetail/InvoiceCollectionDetail';
import PreAmcContracts from '../Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcContracts/PreAmcContracts';
import { CityList } from '../Pages/MasterData/City/CityList/City';
import { CountryList } from '../Pages/MasterData/Country/CountryList/CountryList';
import { ApprovalWorkflowList } from '../Pages/ApprovalWorkflow/ApprovalWorkflowList/ApprovalWorkflowList';
import { ApprovalWorkflowView } from '../Pages/ApprovalWorkflow/ApprovalWorkflowView/ApprovalWorkflowView';
import ClickToCopy from '../Pages/Common/ClickToCopy'
import PreAmcSites from '../Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcContracts/PreAmcSites/PreAmcSites';
import PreAmcManagement from '../Pages/ServiceRequestManagement/CallCordinatorManagement/PreAmcManagement/PreAmcManagement';
import UserManagementHome from '../Pages/UserManagement/UsersList/UserManagementHome';
import { LoggedUserProfileInfo } from '../Pages/UserProfile/LoggedUserProfileInfo/LoggedUserProfileInfo';
import { UserPendingEdit } from '../Pages/UserManagement/UserPedingEdit/UserPendingEdit';
import LookupData from '../Pages/LookupData/LookupData';
import WorkflowConfigurationHome from '../Pages/ApprovalWorkflow/WorkflowConfigurationHome/WorkflowConfigurationHome';
import GstList from '../Pages/MasterData/GST Tax Rate/GstList';
import { ApprovalEventList } from '../Pages/ApprovalWorkflow/ApprovalEvent/ApprovalEventList';
import { EventConditionList } from '../Pages/ApprovalWorkflow/EventConditionList/EventConditionList';
import EventConditionCreate from '../Pages/ApprovalWorkflow/EventConditionCreate/EventConditionCreate';
import EventConditionEdit from '../Pages/ApprovalWorkflow/EventConditionEdit/EventConditionEdit';

const UserRoutes = () => {
  const { user } = useStore(({ app }) => app);
  const isUserLoggedIn = user.isSome();
  const routes = [
    { path: '/home', component: Dashboard },
    { path: '/contracts', component: ContractManagement },
    { path: '/contracts/booking', component: CreateContract },
    { path: '/contracts/edit/:ContractId', component: ContractEdit },
    { path: '/contracts/view/:ContractId', component: ContractView },
    { path: '/contracts/requestapproval/:ContractId', component: RequestApproval },
    { path: '/contracts/view/:ContractId/create-invoice/:InvoiceScheduleId', component: ContractInvoiceScheduleCreate },
    { path: '/contracts/renew/:ContractId', component: ContractRenew },
    { path: '/invoice/:ContractInvoiceId', component: ContractInvoiceView },
    { path: '/finance/invoices', component: InvoiceScheduleList },
    { path: '/finance/invoices/create/:InvoiceScheduleId', component: ContractInvoiceScheduleCreate },
    { path: '/finance/invoices/collection/:InvoiceId', component: InvoiceCollectionDetail },
    { path: '/finance/collections', component: BankCollectionManagement },
    { path: '/finance/collections/:status', component: BankCollectionList },
    { path: '/finance/invoicereconciliation', component: InvoiceReconciliationList },
    { path: '/finance/receipts', component: ReceiptList },
    { path: '/finance/receipts/:ReceiptId', component: ReceiptView },
    { path: '/finance/interimcalls', component: FinanceInterimRequestList },
    { path: '/finance/interimcalls/:ServiceRequestId/review', component: InterimFinanceReview },
    { path: '/calls/callcentre', component: CallCentreManagement },
    { path: '/calls/callcoordinator', component: CallCordinatorManagement },
    { path: '/calls/callcoordinator/preamcpending', component: PreAmcManagement },
    { path: '/calls/asset/interimlist', component: AssetInterimRequestList },
    { path: '/calls/create', component: ServiceRequestCreate },
    { path: '/calls/edit/:ServiceRequestId', component: ServiceRequestEdit },
    { path: '/calls/asset/interimlist/:ServiceRequestId/review', component: InterimAssetReview },
    { path: '/calls/sme', component: SmeView },
    { path: '/callstatusreport/:ServiceRequestId', component: CallStatusReport },
    { path: '/logistics/partindentrequests', component: PartIndentRequestList },
    { path: '/logistics/partindentrequests/view/:RequestId', component: PartIndentRequestView },
    { path: '/logistics/partindentdemands/cwh', component: PartIndentDemandListCWH },
    { path: '/logistics/partindentdemands/logistics', component: DemandsManagement },
    { path: '/logistics/partindentdemands/detail/:DemandId', component: PartIndentDemandDetail },
    { path: '/logistics/partindentdemands/allocated/detail/:DemandId', component: PartIndentDemandAllocated },
    { path: '/logistics/purchaseorders', component: PurchaseOrderList },
    { path: '/logistics/imprest/purchaseorder', component: PartListImprestPurchaseOrder },
    { path: '/logistics/deliverychallans', component: DeliveryChallans },
    { path: '/logistics/deliverychallans/detail/:DCId', component: DeliveryChallanView },
    { path: '/logistics/goodsreceivednote', component: GoodsReceivedNoteList },
    { path: '/logistics/goodsreceivednote/create', component: CreateGRN },
    { path: '/logistics/goodsreceivednotedetail/create/:GRNId', component: CreateGoodReceivedNoteDetail },
    { path: '/logistics/goodsreceivednote/detail/:GRNId', component: GoodsReceivedNoteDetailList },
    { path: '/inventory/partstock', component: PartStockList },
    { path: '/inventory/partstockdetail', component: PartStockDetailList },
    { path: '/pendingapprovals', component: PendingApprovals },
    { path: '/config/companyinfo/:TenantId', component: TenantView },
    { path: '/config/settings', component: SettingsView },
    { path: '/config/masters', component: MasterView },
    { path: '/config/masters/banks', component: BankManagement },
    { path: '/config/masters/division', component: DivisionList },
    { path: '/config/masters/division', component: DivisionList },
    { path: '/config/masters/division', component: DivisionList },
    { path: '/config/masters/bankbranch', component: BankBranchList },
    { path: '/config/masters/partproductcategory', component: PartProductCategoryList },
    { path: '/config/masters/make', component: MakeList },
    { path: '/config/masters/product', component: ProductList },
    { path: '/config/masters/partcategory', component: PartCategoryList },
    { path: '/config/masters/bankbranch', component: BankBranchList },
    { path: '/config/masters/bussinessevents', component: BusinessEventList },
    { path: '/config/masters/designation', component: DesignationList },
    { path: '/config/masters/role', component: RoleList },
    { path: '/config/masters/states', component: StateList },
    { path: '/config/masters/cities', component: CityList },
    { path: '/config/masters/parts', component: PartList },
    { path: '/config/masters/customergroup', component: CustomerGroupList },
    { path: '/config/masters/paymentfrequency', component: PaymentFrequencyList },
    { path: '/config/masters/businessmodule', component: BusinessModuleList },
    { path: '/config/masters/businessfunction', component: BusinessFunctionList },
    { path: '/config/masters/rolefunctionpermission', component: RoleFunctionPermissionList },
    { path: '/config/masters/invoiceprerequisite', component: InvoicePrerequisiteList },
    { path: '/config/masters/stockbin', component: StockBinList },
    { path: '/config/masters/assetproductcategory', component: AssetProductCategoryList },
    { path: '/config/masters/gsttaxrate', component: GstList },
    { path: '/config/masters/assetproductcategory/:PCId', component: ProductCategoryView },
    { path: '/config/masters/partsubcategorylist', component: PartSubCategoryList },
    { path: '/config/masters/stockrooms', component: StockRoomList },
    { path: '/config/masters/lookupdata', component: LookupData },
    { path: '/config/users', component: UserManagementHome },
    { path: '/config/users/create', component: CreateUser },
    { path: '/config/users/edit/:Id', component: EditUser },
    { path: '/config/users/pendingupdate/:PendingUserId', component: UserPendingEdit },
    { path: '/config/users/profile/:UserId', component: UserProfile },
    { path: '/config/loginhistory', component: UsersLoginHistory },
    { path: '/config/customers', component: CustomerManagement },
    { path: '/config/customers/view/:CustomerId', component: CustomerView },
    { path: '/config/customers/create', component: CreateCustomer },
    { path: '/config/customers/edit/:CustomerId', component: CustomerEdit },
    { path: '/config/customers/pendingupdate/:PendingCustomerId', component: CustomerEdit },
    { path: '/config/vendors', component: VendorManagement },
    { path: '/config/vendors/view/:VendorId', component: VendorView },
    { path: '/config/workflowconfiguration', component:  WorkflowConfigurationHome},
    { path: '/config/workflowconfiguration/condition/:EventId', component:  EventConditionList },
    { path: '/config/workflowconfiguration/condition/:EventId/create', component:  EventConditionCreate },
    { path: '/config/workflowconfiguration/condition/:EventId/edit/:EventConditionId', component:  EventConditionEdit },
    { path: '/config/workflowconfiguration/approvalworkflow', component: ApprovalWorkflowList },
    { path: '/config/workflowconfiguration/approvalworkflow/:ApprovalWorkflowId', component: ApprovalWorkflowView },

    { path: '/reports', component: ReportHome },
    { path: '/userinfo', component: LoggedUserProfileInfo },
    { path: '/passwordreset', component: PasswordReset },
    { path: '/queue', component: QueueManagement },
    { path: '/queue/einvoice', component: EInvoiceList },
    { path: '/about', component: AboutView },
    { path: '/config/masters/country', component: CountryList },
    { path: '/calls/callcoordinator/preamcpending/:ContractId/sitelist', component: PreAmcSites }
  ];

  return (
    <Switch>
      {routes.map(({ path, component: Component }) => (
        <UserOnlyRoute key={path} exact path={path} isUserLoggedIn={isUserLoggedIn}>
          <Component />
        </UserOnlyRoute>
      ))}
      <Route path='/'> {isUserLoggedIn ? <Redirect to='/home' /> : <Redirect to='/login' />} </Route>
      <Route path='*'> {isUserLoggedIn ? <Redirect to='/home' /> : <Redirect to='/login' />} </Route>
    </Switch>
  )
}

function UserOnlyRoute({
  children,
  isUserLoggedIn,
  ...rest
}: { children: JSX.Element | JSX.Element[]; isUserLoggedIn: boolean } & RouteProps) {
  return (
    <Route {...rest}>
      {children}
      {!isUserLoggedIn && <Redirect to='/' />}
    </Route>
  );
}

export default UserRoutes;