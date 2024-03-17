import { Routes_Interface } from "../lib/modules/routesInterface";
import { AccountSuspended } from "../views/errors/AccountSuspended";
import { IdentityVerification } from "../views/home/IdentityVerification";

export const standardErrorRoutes: Array<Routes_Interface> = [
    { 
        path: "/u/account/status/suspended", 
        element: <AccountSuspended />, 
        caseSensitive: true, 
        name: 'SUSP_ACC' 
    },
    { 
        path: "/u/artist/_/identity-verification", 
        element: <IdentityVerification />, 
        caseSensitive: true, 
        name: 'IDENTITY_VERF_' 
    },
]