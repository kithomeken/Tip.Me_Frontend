import React, { useState } from "react"
import { Helmet } from "react-helmet"

import Crypto from '../../security/Crypto'
import { AdminstrativeHome } from "../admin/AdministrativeHome"
import StorageServices from "../../services/StorageServices"
import { STORAGE_KEYS } from "../../global/ConstantsRegistry"
import { ArtistHome } from "./ArtistHome"
import { ProfileCheck } from "./ProfileCheck"
import { AUTH } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { setPRc0MetaStage } from "../../store/identityCheckActions"
import { useDispatch } from "react-redux"
import { Loading } from "../../components/modules/Loading"

export const Home = () => {
    const [state, setstate] = useState({
        data: {
            PRc0: null
        },
        status: 'pending',
    })

    const dispatch: any = useDispatch();
    const encryptedKeyString = StorageServices.getLocalStorage(STORAGE_KEYS.ACCOUNT_DATA)
    const storageObject = JSON.parse(encryptedKeyString)

    let Identity: any = Crypto.decryptDataUsingAES256(storageObject)
    Identity = JSON.parse(Identity)

    React.useEffect(() => {
        metaIdentityCheck()
    }, [])

    const metaIdentityCheck = async () => {
        let { data } = state
        let { status } = state

        try {
            const metaCheckResp: any = await HttpServices.httpGet(AUTH.META_CHECK)

            if (metaCheckResp.data.success) {
                status = 'fulfilled'
                data.PRc0 = metaCheckResp.data.payload.PRc0

                const metaCheckProps = {
                    identity: 'password',
                    dataDump: {
                        PRc0: data.PRc0,
                    }
                }

                dispatch(setPRc0MetaStage(metaCheckProps))
            } else {
                status = 'rejected'
            }
        } catch (error) {
            console.log(error);
            status = 'rejected'
        }

        setstate({
            ...state, status, data
        })
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Home</title>
            </Helmet>

            {
                Identity.type === 'A' ? (
                    <AdminstrativeHome />
                ) : (
                    <>
                        {
                            state.status === 'rejected' ? (
                                <>
                                    Rejected
                                </>
                            ) : state.status === 'fulfilled' ? (
                                <>
                                    {
                                        state.data.PRc0 === 'META_00' ? (
                                            <ArtistHome />
                                        ) : (
                                            <ProfileCheck />
                                        )
                                    }
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col justify-center">
                                    <div className="flex-grow">
                                        <Loading />
                                    </div>
                                </div>
                            )
                        }

                    </>
                )
            }


        </React.Fragment>
    )
}