import { Home } from "../views/home/Home";
import { IndexToHome } from "../views/home/IndexToHome";
import { ProfileCheck } from "../views/home/ProfileCheck";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { WithdrawalRequest } from "../views/home/WithdrawalRequest";
import { AccountManagement } from "../views/settings/AccountManagement";

export const standardRoutes: Array<Routes_Interface> = [
    { 
        path: "/", 
        element: <IndexToHome />, 
        caseSensitive: true, 
        name: 'INDEX_' 
    },
    { 
        path: "/u/artist/home", 
        element: <Home />, 
        caseSensitive: true, 
        name: 'PERIPH_HOME_' 
    },
    { 
        path: "/u/artist/_/identity/onboarding", 
        element: <ProfileCheck />, 
        caseSensitive: true, 
        name: 'IDENTITY_ONBRD_' 
    },
    


    { path: "/admin/withdrawals/requests/:uuid", element: <WithdrawalRequest />, activeMenu: 'Y', caseSensitive: true, name: 'PENDING_DETAILS_' },
    { path: "/u/default/account/profile", element: <AccountManagement />, activeMenu: 'Y', caseSensitive: true, name: 'ACCOUNT_PROFILE' },

]
