import { Fragment, useState, useEffect, useRef } from "react";
import axios from "axios";
import { store } from "../../state/store";
import { logout, updateUserLogoutStatus } from "../App/App.slice";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { useStore } from "../../state/storeHooks";
import SweetAlert from "react-bootstrap-sweetalert";
import feather from "feather-icons";
import ProfileName from "./ProfileName";
import { injectStore } from "../../interceptor";
import { useTranslation } from "react-i18next";
import { checkForMenuPermission, checkForPermission } from "../../helpers/permissions";
import { setPartStocks } from "../Pages/Inventory/Stock/PartStock/PartStockBasket/PartStockBasket.slice";
import { masterDataDetails } from "../../tabs.json";
import { userLogout } from "../../services/login";

injectStore(store)

export const Header = () => {

  const { user, isUserAboutToLogout } = useStore(({ app }) => app);

  useEffect(() => {
    feather.replace();
  }, []);

  /**start */

  const history = useHistory();
  const location = useLocation();
  const modalRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    return history.listen((newLocation, action) => {
      if (action === "POP") {
        modalRef.current?.click(); // Click on the modal or any desired action
        history.go(0);
      }
    });
  }, [history, location]);

  /** End  */

  return (
    <Fragment>
      {user.match({
        none: () => <></>,
        some: () => <TopBar isLogoutButtonClicked={isUserAboutToLogout} user={user} />, // Topbar Component
      })}
      <OffCanvas />
    </Fragment>
  );
}

function TopBar({ isLogoutButtonClicked, user }: { isLogoutButtonClicked: boolean, user: any }) {
  const userInfo = user.match({
    none: () => <></>,
    some: (user: any) => {
      return user.user[0];
    }
  });
  const { apiErrorCode } = useStore(({ app }) => app);

  type MenuItem = {
    text: string;
    href: string;
  };

  const moreMenu = () => {
    const menu: MenuItem[] = []
    menu.push({ text: "Profile", href: `/userinfo` })
    menu.push({ text: "Queue", href: "/queue" })
    menu.push({ text: "Change Password", href: "/passwordreset" })
    menu.push({ text: "About", href: "/about" })
    menu.push({ text: "Logout", href: "/" })
    return menu
  }

  const financeMenu = () => {
    const menu: MenuItem[] = []

    if (checkForMenuPermission('INVOICE_LIST'))
      menu.push({ text: "Invoices", href: "/finance/invoices" })

    if (checkForMenuPermission('BANKCOLLECTION_LIST', 'BANKCOLLECTION_UPLOAD', 'BANKCOLLECTION_PROCESS'))
      menu.push({ text: "Collections", href: checkForMenuPermission('BANKCOLLECTION_UPLOAD') ? '/finance/collections' : '/finance/collections/Pending' },
      )

    if (checkForMenuPermission("INVOICERECONCILIATION_LIST"))
      menu.push({ text: "Reconciliation", href: "/finance/invoicereconciliation" })

    if (checkForMenuPermission('SERVICE_REQUEST_FINANCE_INTERIM_LIST')) {
      menu.push({ text: "Interim Calls ", href: "/finance/interimcalls" })
    }

    if (checkForMenuPermission("RECEIPT_LIST", "RECEIPT_CREATE"))
      menu.push({ text: "Receipts", href: "/finance/receipts" })

    return menu
  }

  const inventoryMenu = () => {
    const menu: MenuItem[] = []
    if (checkForMenuPermission("PARTSTOCK_LIST"))
      menu.push({ text: "Part Stock", href: "/inventory/partstock" })
    return menu
  }

  const serviceRequestMenu = () => {
    const menu: MenuItem[] = []
    if (checkForMenuPermission('SERVICEREQUEST_CALLCENTRE_VIEW')) {
      menu.push({ text: "Call Centre", href: "/calls/callcentre" })
    }
    if (checkForMenuPermission('SERVICEREQUEST_CALLCORDINATOR_VIEW')) {
      menu.push({ text: "Call Coordinator", href: "/calls/callcoordinator" })
    }
    if (checkForMenuPermission('SERVICE_REQUEST_ASSET_INTERIM_LIST')) {
      menu.push({ text: "Interim Asset Calls ", href: "/calls/asset/interimlist" })
    }
    if (checkForMenuPermission('SERVICEREQUEST_CALLCORDINATOR_VIEW')) {
      menu.push({ text: "PRE-Amc", href: "/calls/callcoordinator/preamcpending" })
    }

    if (checkForMenuPermission('PARTINDENT_APPROVAL'))
      menu.push({ text: "SME Home", href: "/calls/sme" })

    return menu
  }

  const logisticsMenu = () => {
    const menu: MenuItem[] = []
    if (checkForMenuPermission('PARTINDENT_APPROVAL'))
      menu.push({ text: "Part Indents", href: "/logistics/partindentrequests" })

    if (checkForMenuPermission('PARTINDENTDEMAND_LIST_WAITING_FOR_CWH_ATTENTION')) {
      menu.push({ text: "Part Indent Demands - CWH", href: "/logistics/partindentdemands/cwh" })
    }
    if (checkForMenuPermission('PARTINDENTDEMAND_LIST_FOR_LOGISTICS')) {
      menu.push({ text: "Part Indent Demands - Logistics", href: "/logistics/partindentdemands/logistics" })
    }
    if ((checkForMenuPermission('PURCHASEORDER_VIEW'))) {
      menu.push({ text: "Purchase Orders", href: "/logistics/purchaseorders" })
    }

    if ((checkForMenuPermission('DELIVERYCHALLAN_VIEW'))) {
      menu.push({ text: "Delivery Challans", href: "/logistics/deliverychallans" })

    }
    if (checkForMenuPermission('GOODSRECEIVEDNOTE_VIEW'))
      menu.push({ text: "GRN", href: "/logistics/goodsreceivednote" })

    return menu
  }

  const datamanagementMenu = () => {

    const menu: MenuItem[] = []

    if (checkForMenuPermission('ACCEL_MANAGE', 'ACCEL_MANAGE_BANK'))
      menu.push({ text: "Company Info", href: "/config/companyinfo/1" })

    if (checkForMenuPermission('ACCEL_MANAGE', 'ACCEL_MANAGE_BANK'))
      menu.push({ text: "Settings", href: "/config/settings" })

    if (masterDataDetails.filter((item) => checkForPermission(item.permission)).length > 0)
      menu.push({ text: "Master Data", href: "/config/masters" })

    if (checkForMenuPermission("USER_MANAGE", "USER_VIEW"))
      menu.push({ text: "Manage Users", href: "/config/users" })
    if (checkForMenuPermission("ALL_USER_LOGIN_HISTORY")) {
      menu.push({ text: "Login History", href: "/config/loginhistory" })
    }

    if (checkForMenuPermission('CUSTOMER_LIST', 'CUSTOMER_CREATE')) {
      menu.push({ text: "Customers", href: "/config/customers" })
    }

    if (checkForMenuPermission('VENDOR_CREATE', 'VENDOR_LIST')) {
      menu.push({ text: "Vendors", href: "/config/vendors" })
    }

    
    if (checkForMenuPermission('APPROVALWORKFLOW_VIEW')) {
      menu.push({ text: "Workflow Configuration", href: "/config/workflowconfiguration" })
    }

    return menu
  }

  const [version, setVersion] = useState("");

  useEffect(() => {
    fetchVersion();
  }, []);
  const { t } = useTranslation()

  const fetchVersion = async () => {
    try {
      const response = await axios.get("version/get");
      const data = response.data;
      const versionString = data.toString();
      setVersion(versionString);
    } catch (error) {
      console.error("Error fetching version:", error);
    }
  };
  const { partstockbasket: { deliverychallan, BasketList } } = useStore(({ partstockbasket }) => ({ partstockbasket }));

  const handleBasketItemsModal = () => {
    store.dispatch(setPartStocks(true))
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light moving-bg p-0 sticky-top fixed ">
        <div className="container-fluid">
          {/* Besure Name */}
          <NavLink className="navbar-brand pt-0 ms-2  app-primary-color" to="/home">
            <img className="besure_logo pt-0" src="/images/logo.1.0.png" />
            {/* <div className="besure-text pt-0">BeSure
              <span className="version d-flex  pb-3 float-end ">{version}</span>
            </div> */}
            {/* TODOS api should be written correctly in services */}
          </NavLink>
          {/* Besure Name End */}

          {/* Toggle Icon Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="feather feather-align-justify"
              >
                <line x1="21" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="21" y1="18" x2="3" y2="18"></line>
              </svg>
            </span>
          </button>
          {/* Toggler Icon Button End*/}

          {/* Navbar Menu Section  */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav small">
              <NavItem text="Home" href="/home" icon="home" />
              {checkForMenuPermission('CONTRACT_VIEW', 'CONTRACT_REVIEW', 'CONTRACT_CREATE') && <NavItem text="Contract" icon="contract" href="/contracts" />}
              {checkForMenuPermission('INVOICE_LIST', 'BANKCOLLECTION_LIST', 'INVOICERECONCILIATION_LIST', 'BANKCOLLECTION_UPLOAD', 'RECEIPT_LIST', 'SERVICE_REQUEST_FINANCE_INTERIM_LIST') && <NavDropDownItems icon="account_balance" text="Finance" children={financeMenu()} />}
              {checkForMenuPermission('SERVICEREQUEST_CALLCORDINATOR_VIEW', 'SERVICEREQUEST_CALLCENTRE_VIEW', 'SERVICE_REQUEST_CREATE', 'SERVICE_REQUEST_ASSET_INTERIM_LIST') && <NavDropDownItems text="Calls" icon="headphones" children={serviceRequestMenu()} />}
              {checkForMenuPermission('PARTINDENTDEMAND_LIST_WAITING_FOR_CWH_ATTENTION', 'PARTINDENT_APPROVAL', 'PARTINDENTDEMAND_LIST_FOR_LOGISTICS', 'PURCHASEORDER_VIEW', 'DELIVERYCHALLAN_VIEW', 'GOODSRECEIVEDNOTE_VIEW') && <NavDropDownItems icon="inventory" text="Logistics" children={logisticsMenu()} />}
              {checkForMenuPermission('PARTSTOCK_LIST') && <NavDropDownItems icon="inventory" text="Inventory" children={inventoryMenu()} />}
              {checkForMenuPermission('APPROVAL_VIEW') && <NavItem text="Approval" icon="approval" href="/pendingapprovals" />}
              {(masterDataDetails.filter((item) => checkForPermission(item.permission)).length > 0 || checkForMenuPermission('ACCEL_MANAGE', 'ACCEL_MANAGE_BANK', 'USER_VIEW', 'ALL_USER_LOGIN_HISTORY', 'CUSTOMER_LIST', 'VENDOR_LIST')) && <NavDropDownItems icon="database" text="Config" children={datamanagementMenu()} />}
              <NavItem text="Reports" href="/reports" icon="lab_profile" />
              <a className="nav-link text-center" href="https://172.21.1.22:8443/besure.html" target="blank"> <span className="material-symbols-outlined align-middle" >help</span>  <div>Help</div> </a>
              <a className="nav-link fw-bold animate-charcter text-center" href="https://forms.office.com/r/gaS8Qc6qSs?origin=lprLink"> <span className="material-symbols-outlined align-middle" >message</span> <div>Feedback</div> </a>
            </ul>
          </div>
          {/* Navbar Menu Section 1 end */}

          {/* Navbar Menu Section 2 */}

          <div className="d-flex">
            {checkForMenuPermission("DELIVERYCHALLAN_CREATE") && deliverychallan.partstocks.length !== 0 &&
              <button type="button" className="nav-link position-relative me-3" onClick={handleBasketItemsModal} data-bs-toggle="modal" data-bs-target="#StockTransfer">
                <span className="material-symbols-outlined mt-1 fs-3 text-dark" data-toggle="tooltip" data-placement="left" title={'Besure Basket'}>shopping_cart</span>
                <span className="position-absolute mt-2 start-100 translate-middle badge rounded-pill bg-danger">
                  <small>{deliverychallan.partstocks.length}</small>
                </span>
              </button>
            }
            <span>
              <ProfileName fullName={userInfo.FullName} />
            </span>
            <span className="pt-2" data-toggle="tooltip" data-placement="left" title={'Notifications'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                data-bs-toggle="offcanvas"
                data-bs-target="#appNotifications"
                className="feather feather-bell"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </span>
            <span className="pt-2">
              <NavMoreMenuItems icon="more_vert" children={moreMenu()} />
              {isLogoutButtonClicked && <ConfirmationModal />}
            </span>
          </div>
          {/* Navbar Menu Section 2 end */}
        </div>
      </nav>

      {apiErrorCode == "500" && <div className="alert alert-danger" role="alert" style={{ zIndex: 1000001 }}>
        {t('api_statuscode_500') ?? ''}
      </div>}
      {apiErrorCode == "403" && <div className="alert alert-danger" role="alert" style={{ zIndex: 1000001 }}>
        {t('api_statuscode_403') ?? ''}
      </div>}
    </>
  );
}

const NavItem = ({ text, href, icon }: { text: string; href: string, icon: string }) => {
  return (
    <li className="nav-item" >
      <NavLink to={href} activeClassName="active app-primary-color fw-bold" className="nav-link text-center">
        <span className="">
          <span className="material-symbols-outlined align-middle " >{icon}</span>
          <div className="align-middle  mt-0">{text}</div>
        </span>
      </NavLink>
    </li>
  );
}

const NavMoreMenuItems = ({
  text,
  icon,
  children,
}: {
  text?: string;
  icon?: string;
  children: { text: string; href: string }[];
}) => {
  return (
    <li className="nav-item list-unstyled" >
      <div className="dropdown nav-link text-center" >
        <span
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {icon == undefined ? (
            text
          ) : (
            <>
              <span className=""> <div className={`${icon == 'more-vertical' ? "pt-2" : ""}`}>
                <span className={icon != "more_vert" ? "dropdown-toggle pseudo-link " : " pseudo-link"}

                ><div className="material-symbols-outlined align-middle"   >{icon}</div> </span>
                <div role="button">{text}</div>
              </div>
              </span>
            </>
          )}
        </span>
        <ul className="dropdown-menu dropdown-menu-end zindex-1100" >
          {children.map((childMenu, index) => (
            <li key={index}>
              {childMenu.text === "Logout" ? (
                <span className="dropdown-item pseudo-link " onClick={ToggleLogoutConfirmationModal}>Logout</span>
              ) : (
                <a className="dropdown-item" href={childMenu.href}>{childMenu.text}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

const NavDropDownItems = ({
  text,
  icon,
  children,
}: {
  text?: string;
  icon?: string;
  children: { text: string; href: string }[];
}) => {
  return (
    <li className="nav-item list-unstyled" >
      <div className="dropdown nav-link text-center" >
        <span
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {icon == undefined ? (
            text
          ) : (
            <>
              <span className=""> <div className={`${icon == 'more-vertical' ? "pt-2" : ""}`}>
                <span className={icon != "more_vert" ? "dropdown-toggle pseudo-link " : " pseudo-link"}

                ><div className="material-symbols-outlined align-middle"   >{icon}</div> </span>
                <div role="button">{text}</div>
              </div>
              </span>
            </>
          )}
        </span>
        <ul className="dropdown-menu dropdown-menu-start zindex-1100" >
          {children.map((childMenu, index) => (
            <li key={index}>
              <a className="dropdown-item" href={childMenu.href}>{childMenu.text}</a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}


const ToggleLogoutConfirmationModal = () => {
  store.dispatch(updateUserLogoutStatus());
}

const ConfirmationModal = () => {
  return (
    <SweetAlert
      warning
      showCancel
      confirmBtnText="Yes, logout!"
      confirmBtnBsStyle="danger"
      title="Are you sure?"
      onConfirm={_logout}
      onCancel={ToggleLogoutConfirmationModal}
      focusCancelBtn
    >
      Are you sure you want to log out from the system?
    </SweetAlert>
  );
}

const OffCanvas = () => {
  return (
    <div className="offcanvas offcanvas-end" id="appNotifications">
      <div className="offcanvas-header">
        <h1 className="offcanvas-title">Notifications</h1>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div className="offcanvas-body">
        <small>Notifications are not yet implemented.</small>
      </div>
    </div>
  );
}

const _logout = async () => {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("bsmasterdata");
    const result = await userLogout()
    result.match({
      ok: () => {
        delete axios.defaults.headers.Authorization;
        store.dispatch(updateUserLogoutStatus());
        location.pathname = "/login";
        store.dispatch(logout());
      },
      err: (e) => {
        return;
      },
    });
  } catch (ex: any) {
    return
  }

}