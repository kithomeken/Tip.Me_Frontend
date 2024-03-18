import { Yeat } from "../views/home/Yeat";
import { EntityPayIn } from "../views/home/EntityPayIn";
import { EmailActions } from "../views/auth/EmailActions";
import { IdentityCheck } from "../views/home/IdentityCheck";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { IndexToHome } from "../views/home/IndexToHome";

export const genericRoutes: Array<Routes_Interface> = [
    {
        path: "_/auth/action/email",
        element: <EmailActions />,
        caseSensitive: true,
        name: 'EMAIL_ACTION_'
    },
    {
        path: "/entity/:uuid",
        element: <EntityPayIn />,
        caseSensitive: true,
        name: 'ENTITY_0_'
    },

    { path: "/yeat", element: <Yeat />, caseSensitive: true, name: 'YEAT_' },
]

export const commonRoutes: Array<Routes_Interface> = [
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
]