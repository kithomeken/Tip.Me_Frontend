import { Home } from "../views/home/Home";
import { IndexToHome } from "../views/home/IndexToHome";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { WithdrawalRequest } from "../views/home/WithdrawalRequest";
import { AccountManagement } from "../views/settings/AccountManagement";
import { IdentityCheck } from "../views/home/IdentityCheck";
import { IdentityVerification } from "../views/home/IdentityVerification";

export const standardRoutes: Array<Routes_Interface> = [
    { 
        path: "/", 
        element: <IndexToHome />, 
        caseSensitive: true, 
        name: 'INDEX_' 
    },
    { 
        path: "/home", 
        element: <IdentityCheck />, 
        caseSensitive: true, 
        name: 'HOME_'
    },
    { 
        path: "/u/artist/home", 
        element: <Home />, 
        caseSensitive: true, 
        name: 'PERIPH_HOME_' 
    },
    { 
        path: "/u/artist/_/identity-verification", 
        element: <IdentityVerification />, 
        caseSensitive: true, 
        name: 'IDENTITY_VERF_' 
    },
    


    { path: "/admin/withdrawals/requests/:uuid", element: <WithdrawalRequest />, activeMenu: 'Y', caseSensitive: true, name: 'PENDING_DETAILS_' },
    { path: "/u/default/account/profile", element: <AccountManagement />, activeMenu: 'Y', caseSensitive: true, name: 'ACCOUNT_PROFILE' },

]
