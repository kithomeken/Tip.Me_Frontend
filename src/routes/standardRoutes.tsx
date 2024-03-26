import { Home } from "../views/home/Home";
import { IdentityOnboarding } from "../views/home/IdentityOnboarding";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { WithdrawalRequest } from "../views/home/WithdrawalRequest";
import { AccountManagement } from "../views/settings/AccountManagement";
import { ChangeEmail } from "../views/settings/ChangeEmail";
import { EntityProfile } from "../views/settings/EntityProfile";
import { Entity } from "../views/settings/Entity";

export const standardRoutes: Array<Routes_Interface> = [
    { 
        path: "/u/artist/home", 
        element: <Home />, 
        caseSensitive: true, 
        name: 'PERIPH_HOME_' 
    },
    { 
        path: "/u/artist/_/identity/onboarding", 
        element: <IdentityOnboarding />, 
        caseSensitive: true, 
        name: 'IDENTITY_ONBRD_' 
    },
    





    { path: "/admin/withdrawals/requests/:uuid", element: <WithdrawalRequest />, activeMenu: 'Y', caseSensitive: true, name: 'PENDING_DETAILS_' },
    { path: "/u/default/account/profile", element: <AccountManagement />, activeMenu: 'Y', caseSensitive: true, name: 'ACCOUNT_PROFILE' },

]


export const standardSettingsRoutes: Array<Routes_Interface> = [
    {
        path: "/u/settings/account/profile", 
        element: <EntityProfile />, 
        activeMenu: 'Y', 
        caseSensitive: true, 
        name: 'CNF_ACC_ID_' 
    },
    {
        path: "/u/settings/email/change", 
        element: <ChangeEmail />, 
        activeMenu: 'Y', 
        caseSensitive: true, 
        name: 'CNF_EMAIL_CHNG_' 
    },
    {
        path: "/u/settings/entity", 
        element: <Entity />, 
        activeMenu: 'Y', 
        caseSensitive: true, 
        name: 'CNF_ENTITY_' 
    },

]