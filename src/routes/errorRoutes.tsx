import { Routes_Interface } from "../lib/modules/routesInterface";
import { AccountSuspended } from "../views/errors/AccountSuspended";

export const standardErrorRoutes: Array<Routes_Interface> = [
    { path: "/u/account/status/suspended", element: <AccountSuspended />, caseSensitive: true, name: 'SUSP_ACC' },
]