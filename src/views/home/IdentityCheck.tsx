import React, { useState } from 'react'
import { Navigate } from 'react-router'

import Crypto from '../../security/Crypto'
import StorageServices from '../../services/StorageServices'
import { STORAGE_KEYS } from '../../global/ConstantsRegistry'
import { administrativeRoutes } from '../../routes/adminRoutes'
import { standardRoutes } from '../../routes/standardRoutes'

export const IdentityCheck = () => {
    /* 
     * Performs an identity check to determine 
     * which component should be rendered
    */
    const encryptedKeyString = StorageServices.getLocalStorage(STORAGE_KEYS.ACCOUNT_DATA)
    const storageObject = JSON.parse(encryptedKeyString)

    let identityData: any = Crypto.decryptDataUsingAES256(storageObject)
    identityData = JSON.parse(identityData)

    if (identityData.type === 'A') {
        const homeCoreRoute: any = (
            administrativeRoutes.find(
                (routeName) => routeName.name === 'CORE_HOME_')
        )?.path

        return <Navigate to={homeCoreRoute} replace />;
    }

    const homePeripheralRoute: any = (
        standardRoutes.find(
            (routeName) => routeName.name === 'PERIPH_HOME_')
    )?.path    

    return <Navigate to={homePeripheralRoute} replace />;
}