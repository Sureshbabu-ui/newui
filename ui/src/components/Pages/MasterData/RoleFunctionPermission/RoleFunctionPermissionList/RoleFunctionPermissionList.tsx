import { t } from "i18next";
import { RoleWiseList } from "../RoleWiseList/RoleWiseList";
import { useTranslation } from "react-i18next";
import { checkForPermission } from "../../../../../helpers/permissions";
import BreadCrumb from "../../../../BreadCrumbs/BreadCrumb";

export const RoleFunctionPermissionList = () => {
    const { t } = useTranslation();
    const breadcrumbItems = [
        { Text: 'breadcrumbs_home', Link: '/' },
        { Text: 'breadcrumbs_masters', Link: '/config/masters' },
        { Text: 'breadcrumbs_masters_role_permission' },
    ];

    return (
        <>            
        <BreadCrumb items={breadcrumbItems} />
        <div className="permissions p-3 ">
            <div>
               <RoleWiseList/> 
            </div>
        </div>
        </>
    )
}