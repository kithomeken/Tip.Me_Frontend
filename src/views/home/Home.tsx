import React from "react"
import { Helmet } from "react-helmet"

import Crypto from '../../security/Crypto'
import { AdminstrativeHome } from "./AdministrativeHome"
import StorageServices from "../../services/StorageServices"
import { STORAGE_KEYS } from "../../global/ConstantsRegistry"
import { ArtistHome } from "./ArtistHome"

export const Home = () => {
    const encryptedKeyString = StorageServices.getLocalStorage(STORAGE_KEYS.ACCOUNT_DATA)
    const storageObject = JSON.parse(encryptedKeyString)

    const accountData = Crypto.decryptDataUsingAES256(storageObject)
    const jsonAccountInfo = JSON.parse(accountData)

    return (
        <React.Fragment>
            <Helmet>
                <title>Home</title>
            </Helmet>

            {
                jsonAccountInfo.type === 'A' ? (
                    <AdminstrativeHome />
                ) : (
                    <ArtistHome />
                )
            }


        </React.Fragment>
    )
}