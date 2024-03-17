import { EmailActions } from "../views/auth/EmailActions";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { Yeat } from "../views/home/Yeat";
import { IdentityCheck } from "../views/home/IdentityCheck";

export const genericRoutes: Array<Routes_Interface> = [
    { path: "_/auth/action/email", element: <EmailActions />, caseSensitive: true, name: 'EMAIL_ACTION_' },


    { path: "/yeat", element: <Yeat />, caseSensitive: true, name: 'YEAT_' },
]

export const commonRoutes: Array<Routes_Interface> = [
    { 
        path: "/home", 
        element: <IdentityCheck />, 
        caseSensitive: true, 
        name: 'HOME_'
    },
]