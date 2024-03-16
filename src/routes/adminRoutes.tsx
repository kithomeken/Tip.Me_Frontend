import { AllEntities } from "../views/admin/AllEntities";
import { UserManagement } from "../views/admin/UserManagement";
import { MpesaExceptions } from "../views/admin/MpesaExceptions";
import { Routes_Interface } from "../lib/modules/routesInterface";
import { TransactionPayIn } from "../views/admin/TransactionPayIn";
import { AdminstrativeHome } from "../views/admin/AdministrativeHome";
import { OnboardingRequests } from "../views/admin/OnboardingRequests";
import { TransactionPayOuts } from "../views/admin/TransactionPayOuts";
import { WithdrawalRequests } from "../views/admin/WithdrawalRequests";

export const administrativeRoutes: Array<Routes_Interface> = [
    { 
        path: "/default/a/home", 
        element: <AdminstrativeHome />, 
        activeMenu: 'N', 
        caseSensitive: true, 
        name: 'CORE_HOME_' 
    },
    { 
        path: "/default/a/onboarding/requests", 
        element: <OnboardingRequests />, 
        activeMenu: 'N', 
        caseSensitive: true, 
        name: 'CORE_ONBOARDING_' 
    },
    { 
        path: "/default/a/onboarding/entities", 
        element: <AllEntities />, 
        activeMenu: 'N', 
        caseSensitive: true, 
        name: 'CORE_ENTITIES_' 
    },
    { 
        path: "/default/a/onboarding/user-management", 
        element: <UserManagement />, 
        activeMenu: 'N', 
        caseSensitive: true, 
        name: 'CORE_USERS_' 
    },
    { 
        path: "/default/a/payments/requests", 
        element: <WithdrawalRequests />, 
        activeMenu: 'N', 
        caseSensitive: true, 
        name: 'CORE_PAYMENTS_' 
    },
    { 
        path: "/default/a/transactions/payouts", 
        element: <TransactionPayOuts />, 
        activeMenu: 'N', 
        caseSensitive: true, 
        name: 'CORE_TXN_PAYOUTS_' 
    },
    { 
        path: "/default/a/transactions/contributions", 
        element: <TransactionPayIn />, 
        activeMenu: 'N', 
        caseSensitive: true, 
        name: 'CORE_TXN_PAYIN_' 
    },
    { 
        path: "/default/a/core/mpesa/exceptions", 
        element: <MpesaExceptions />, 
        activeMenu: 'N', 
        caseSensitive: true, 
        name: 'CORE_MPESA_EXCS_' 
    },
]