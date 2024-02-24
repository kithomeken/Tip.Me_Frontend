import { Home } from "../views/home/Home";
import { IndexToHome } from "../views/home/IndexToHome";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { PendingRequests } from "../views/home/admin/PendingRequests";
import { WithdrawalRequest } from "../views/home/WithdrawalRequest";
import { AccountManagement } from "../views/settings/AccountManagement";

export const standardRoutes: Array<Routes_Interface> = [
    { path: "/", element: <IndexToHome />, activeMenu: 'N', caseSensitive: true, name: 'INDEX_' },
    { path: "/home", element: <Home />, activeMenu: 'Y', caseSensitive: true, name: 'HOME_' },

    


    { path: "/admin/onboarding/requests/:uuid", element: <PendingRequests />, activeMenu: 'Y', caseSensitive: true, name: 'PENDING_DETAILS_' },
    { path: "/admin/withdrawals/requests/:uuid", element: <WithdrawalRequest />, activeMenu: 'Y', caseSensitive: true, name: 'PENDING_DETAILS_' },


    { path: "/u/default/account/profile", element: <AccountManagement />, activeMenu: 'Y', caseSensitive: true, name: 'ACCOUNT_PROFILE' },


]
