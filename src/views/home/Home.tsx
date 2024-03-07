import { Helmet } from "react-helmet"
import { toast } from "react-toastify"
import React, { useState } from "react"
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth"

import { useDispatch } from "react-redux"
import { ArtistHome } from "./ArtistHome"
import Crypto from '../../security/Crypto'
import { ProfileCheck } from "./ProfileCheck"
import { AUTH } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import StorageServices from "../../services/StorageServices"
import { firebaseAuth } from "../../firebase/firebaseConfigs"
import { STORAGE_KEYS } from "../../global/ConstantsRegistry"
import emptyBox from '../../assets/images/2761912-76t3209.svg'
import { AdminstrativeHome } from "../admin/AdministrativeHome"
import { setPRc0MetaStage } from "../../store/identityCheckActions"
import { ERR_404 } from "../errors/ERR_404"
import { ERR_500 } from "../errors/ERR_500"

export const Home = () => {
    const [state, setstate] = useState({
        verified: false,
        httpStatus: 200,
        status: 'pending',
        data: {
            PRc0: null
        },
        process: {
            type: '',
            state: false,
        }
    })

    const dispatch: any = useDispatch();
    const [verified, setVerified] = useState(false)
    const encryptedKeyString = StorageServices.getLocalStorage(STORAGE_KEYS.ACCOUNT_DATA)
    const storageObject = JSON.parse(encryptedKeyString)

    let Identity: any = Crypto.decryptDataUsingAES256(storageObject)
    Identity = JSON.parse(Identity)

    React.useEffect(() => {
        firebaseVerifiedAccountCheck()
    }, [])

    const firebaseVerifiedAccountCheck = () => {
        let { status } = state

        onAuthStateChanged(firebaseAuth,
            currentUser => {
                const verifiedA = currentUser.emailVerified
                setVerified(verifiedA)

                if (verifiedA) {
                    metaIdentityCheck()
                    return
                }

                status = 'fulfilled'

                setstate({
                    ...state, verified, status
                })
            },
            error => {
                status = 'rejected'

                setstate({
                    ...state, status
                })
            }
        );
    }

    const metaIdentityCheck = async () => {
        setstate({
            ...state, verified: true
        })

        let { data } = state
        let { status } = state
        let { httpStatus } = state

        try {
            const metaCheckResp: any = await HttpServices.httpGet(AUTH.META_CHECK)
            httpStatus = metaCheckResp.status

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
            ...state, status, data, httpStatus
        })
    }

    const resendEmailVerification = () => {
        let { process } = state

        if (!process.state) {
            process.state = true
            process.type = 'resend'

            setstate({
                ...state, process
            })

            sendEmailVerification(firebaseAuth.currentUser)
                .then(() => {
                    process.state = false

                    setstate({
                        ...state, process
                    })

                    toast.success("Your verification email is on its way.", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                })
                .catch((error) => {
                    process.state = false
                    const errorCode = error.code;
                    let errorMessage = error.message;
                    console.log('USBN909 0-03', errorCode);

                    if (errorCode === 'auth/too-many-requests') {
                        errorMessage = 'Too many requests for sent. Please try again later.'
                    } else {
                        errorMessage = 'Something went wrong. Kindly try again later'
                    }

                    toast.error(errorMessage, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    setstate({
                        ...state, process
                    })
                });;
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Home</title>
            </Helmet>

            {
                state.status === 'rejected' ? (
                    state.httpStatus === 404 ? (
                        <ERR_404
                            compact={true}
                        />
                    ) : (
                        <ERR_500 />
                    )
                ) : state.status === 'fulfilled' ? (
                    <>
                        {
                            verified ? (
                                <>
                                    {
                                        Identity.type === 'A' ? (
                                            <AdminstrativeHome />
                                        ) : (
                                            <>
                                                {
                                                    state.data.PRc0 === 'META_00' ? (
                                                        <ArtistHome />
                                                    ) : (
                                                        <ProfileCheck />
                                                    )
                                                }
                                            </>
                                        )
                                    }
                                </>
                            ) : (
                                <div className="w-full h-screen -mt-20 flex flex-col justify-center align-middle items-center mx-4">
                                    <div className="mx-auto my-2 px-4 bg-sky-00 py-4 border-2 border-sky-300 border-dashed rounded-md">
                                        <img src={emptyBox} alt="broken_robot" width="auto" className="block text-center m-auto w-68" />

                                        <div className="text-center m-auto text-slate-600 py-4 md:w-96">
                                            <span className="text-blue-900 mb-2 block">
                                                Verification pending
                                            </span>

                                            <div className="text-sm text-blue-700 md:text-center">
                                                A verification email was sent to <span className="text-slate-800">{firebaseAuth.currentUser.email}</span>, kindly check your email to complete the update.
                                            </div>
                                        </div>

                                        <div className="flex flex-row-reverse align-middle items-center pt-3">
                                            <span onClick={resendEmailVerification} className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-stone-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                {
                                                    state.process.type === 'resend' && state.process.state ? 'Resending' : 'Resend email'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </>
                ) : (
                    <div className="w-full h-screen -mt-20 flex flex-col justify-center align-middle items-center mx-4">
                        <Loading />
                    </div>
                )
            }
        </React.Fragment>
    )
}