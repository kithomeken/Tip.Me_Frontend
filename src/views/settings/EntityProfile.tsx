import { Helmet } from "react-helmet"
import { toast } from "react-toastify"
import React, { useState } from "react"
import PhoneInput from 'react-phone-number-input'

import { ACCOUNT } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"
import { Loading } from "../../components/modules/Loading"
import { classNames } from "../../lib/modules/HelperFunctions"

export const EntityProfile = () => {
    const [state, setstate] = useState({
        status: 'pending',
        posting: false,
        data: {
            Fb0C: null,
            meta: null,
            enTT: null,
            Nm0T: null,
            designated: null,
        },
        input: {
            email: ''
        },
        errors: {
            email: ''
        },
        process: {
            type: '',
            state: false,
        }
    })

    React.useEffect(() => {
        fetchDesignatedMember()
    }, [])

    const emptyOnChangeHandler = () => { }

    const fetchDesignatedMember = async () => {
        let { posting } = state
        let { status } = state
        let { data } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.GET_NOMINATED)

            if (response.data.success) {
                status = 'fulfilled'

                data.Fb0C = response.data.payload.Fb0C
                data.Nm0T = response.data.payload.Nm0T
                data.meta = response.data.payload.meta
                data.enTT = response.data.payload.enTT
                data.designated = response.data.payload.designated
            } else {
                status = 'rejected'
            }
        } catch (error) {
            console.log(error);
            status = 'rejected'
        }

        posting = false

        setstate({
            ...state, status, data, posting
        })
    }

    const setOwnMsisdnAsDesignated = async () => {
        let { posting } = state

        if (!posting) {
            posting = true

            try {
                const response: any = await HttpServices.httpPost(ACCOUNT.SET_NOMINATED, null)

                if (response.data.success) {
                    fetchDesignatedMember()
                } else {

                }
            } catch (error) {
                console.log(error);
            }

            posting = false

            setstate({
                ...state, posting
            })
        }
    }

    const nominatedMemberAction = (action: string) => {
        let { posting } = state

        if (!posting) {
            posting = true

            setstate({
                ...state, posting
            })

            if (action === 'A') {
                approveNominatedMember()
            } else {
                rejectNominatedMember()
            }
        }
    }

    const approveNominatedMember = async () => {
        let { posting } = state
        
        try {
            const response: any = await HttpServices.httpPost(ACCOUNT.NMNTD_MMBR_ACTION, null)

            if (response.data.success) {
                fetchDesignatedMember()
            } else {
                toast.error("Something went wrong, could not process your request", {
                    position: "top-right",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong, could not process your request", {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const rejectNominatedMember = async () => {
        let { posting } = state
        
        try {
            const response: any = await HttpServices.httpDelete(ACCOUNT.NMNTD_MMBR_ACTION, null)

            if (response.data.success) {
                fetchDesignatedMember()
            } else {
                toast.error("Something went wrong, could not process your request", {
                    position: "top-right",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong, could not process your request", {
                position: "top-right",
                autoClose: 7000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Account Profile</title>
            </Helmet>

            <div className="md:w-12/12 w-full pr-4">
                <p className="text-2xl text-amber-600 mb-3">
                    Account Profile
                </p>

                {
                    state.status === 'rejected' ? (
                        <>

                        </>
                    ) : state.status === 'fulfilled' ? (
                        <div className="w-full">
                            <p className="text-lg text-stone-600 py-2">
                                Nominated Member
                            </p>

                            <p className="text-sm text-stone-500 mb-3">
                                This refers to a member's phone number that has been nominated to receive withdrawal notifications, funds and confirmation of transactions.
                                {/* It serves as a unique identifier and is crucial for facilitating secure and efficient fund transfers from your account. */}
                            </p>

                            {
                                state.data.enTT.max === 1 ? (
                                    <>

                                    </>
                                ) : (
                                    <div className="md:w-10/12 w-full py-3">
                                        {
                                            state.data.Nm0T === 'Y' ? (
                                                <div className="mb-2 py-2 border-y-2 border-stone-300 border-dashed rounded">
                                                    <span className="text-sm px-3 py-1 block bg-inherit text-stone-700 sm:w-auto sm:text-sm">
                                                        Current nominated member:
                                                    </span>

                                                    <div className="flex md:flex-row flex-col gap-y-1 md:pt-0 pt-3 w-full md:gap-x-3 align-middle md:items-center px-3">
                                                        <span className="md:py-2 block basis-1/2 text-stone-500 whitespace-nowrap">
                                                            {state.data.meta.dsGA.display_name}
                                                        </span>
                                                        <div className="md:py-2 basis-1/2 text-stone-500 whitespace-nowrap">
                                                            <PhoneInput
                                                                international
                                                                readOnly={true}
                                                                disabled={true}
                                                                defaultCountry="KE"
                                                                onChange={emptyOnChangeHandler}
                                                                value={state.data.meta.dsGA.msisdn}
                                                            />
                                                        </div>
                                                    </div>

                                                    {
                                                        state.data.meta.dsG0 === undefined || state.data.meta.dsG0 === null ? (
                                                            // User does not have an approval
                                                            <>
                                                                {
                                                                    state.data.meta.dsGR === undefined || state.data.meta.dsGR === null ? (
                                                                        // Already approved
                                                                        state.data.Fb0C === 'Y' ? (
                                                                            <div className="flex flex-row-reverse align-middle items-center py-1">
                                                                                <span className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-amber-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                                    Change Nominated Member
                                                                                </span>
                                                                            </div>
                                                                        ) : null
                                                                    ) : (
                                                                        // Not fully approved by members
                                                                        <span className={
                                                                            classNames(
                                                                                state.data.meta.dsGR[0] > state.data.meta.dsGR[1] ? 'text-orange-500' : 'text-emerald-500',
                                                                                'text-sm px-3 py-2 block text-right'
                                                                            )
                                                                        }> Nomination approved by {
                                                                                state.data.meta.dsGR[0] > state.data.meta.dsGR[1] ? (
                                                                                    <span>{state.data.meta.dsGR[1]}/{state.data.meta.dsGR[0]}</span>
                                                                                ) : (
                                                                                    <span>All</span>
                                                                                )
                                                                            } members
                                                                        </span>
                                                                    )
                                                                }
                                                            </>
                                                        ) : (
                                                            // User has an approval
                                                            state.posting ? (
                                                                <div className="flex flex-row-reverse items-center py-1-5 px-3">
                                                                    <span className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-amber-500 sm:w-auto sm:text-sm">Recording your action...
                                                                    </span>
                                                                    <span className="fad text-amber-500 fa-spinner-third fa-xl block fa-spin"></span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-row-reverse align-middle items-center py-1">
                                                                    <span onClick={() => nominatedMemberAction('R')} className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-red-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                        <span className="hidden md:inline-block">Reject Nomination</span>
                                                                        <span className="md:hidden">Reject</span>
                                                                    </span>

                                                                    <span onClick={() => nominatedMemberAction('A')} className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-emerald-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                        <span className="hidden md:inline-block">Approve Nomination</span>
                                                                        <span className="md:hidden">Approve</span>
                                                                    </span>
                                                                </div>
                                                            )

                                                        )
                                                    }
                                                </div>
                                            ) : (
                                                // No nominated member found
                                                state.data.Fb0C === 'N' ? (
                                                    <div className="mb-2 bg-sky-00 py-4 px-4 border-2 border-sky-300 border-dashed rounded-md">
                                                        <div className="flex flex-row align-middle items-center text-sky-700 px-2">
                                                            <i className="fa-duotone fa-info-circle fa-2x mt-1 text-blue-700 flex-none"></i>

                                                            <div className="flex-auto ml-1 mt-1">
                                                                <span className="text-sm pl-3 block py-2 text-blue-700">
                                                                    No nominated member set. Please wait for your inviter to select one first. Once they do, you'll have to approve to make the nominated member's phone operational.
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="mb-2 bg-sky-00 py-4 px-4 border-2 border-sky-300 border-dashed rounded-md">
                                                        <div className="flex flex-row align-middle items-center text-sky-700 px-2">
                                                            <i className="fa-duotone fa-info-circle fa-2x mt-1 text-blue-700 flex-none"></i>

                                                            <div className="flex-auto ml-1 mt-1">
                                                                <span className="text-sm pl-3 block text-blue-900 mb-1">
                                                                    No nominated member set.
                                                                </span>

                                                                <span className="text-sm pl-3 block text-blue-700">
                                                                    Upon selecting a nominated member, you will require approval from other members before it can be opertional.
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-row-reverse align-middle items-center pt-3">
                                                            <span className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-stone-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                Nominate another
                                                            </span>

                                                            <span onClick={setOwnMsisdnAsDesignated} className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-stone-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                Nominate yourself
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        }
                                    </div>
                                )
                            }


                            {/* <div className="mb-2 bg-sky-00 px-2">
                                <div className="flex flex-row align-middle items-center text-sky-700 px-2">
                                    <i className="fa-duotone fa-phone fa-2x mt-1 text-stone-400 flex-none"></i>

                                    <div className="flex-auto ml-1 mt-1">
                                        <span className="text-sm pl-3 block py- text-blue-700">
                                            {state.data.designated.display_name}
                                        </span>

                                        <span className="text-sm pl-3 block py-2 text-blue-700">
                                            <PhoneInput
                                                international
                                                readOnly={true}
                                                disabled={true}
                                                defaultCountry="KE"
                                                onChange={emptyOnChangeHandler}
                                                value={state.data.designated.msisdn}
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div> */}


                        </div >
                    ) : (
                        <div className="w-full h-full flex flex-col justify-center">
                            <div className="flex-grow">
                                <Loading />
                            </div>
                        </div>
                    )
                }

            </div >
        </React.Fragment >
    )
}