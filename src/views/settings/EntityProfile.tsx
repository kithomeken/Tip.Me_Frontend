import { Helmet } from "react-helmet"
import React, { useState } from "react"
import PhoneInput from 'react-phone-number-input'

import { Loading } from "../../components/modules/Loading"
import { ACCOUNT } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"

export const EntityProfile = () => {
    const [state, setstate] = useState({
        status: 'pending',
        posting: false,
        data: {
            Fb0C: null,
            entity: null,
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

    const fetchDesignatedMember = async () => {
        let { status } = state
        let { data } = state

        try {
            const response: any = await HttpServices.httpGet(ACCOUNT.GET_DESIGNATED)

            if (response.data.success) {
                status = 'fulfilled'

                data.Fb0C = response.data.payload.Fb0C
                data.entity = response.data.payload.entity
                data.designated = response.data.payload.designated
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

    const emptyOnChangeHandler = () => { }

    const setOwnMsisdnAsDesignated = async () => {
        let { posting } = state

        if (!posting) {
            posting = true

            try {
                const response: any = await HttpServices.httpGet(ACCOUNT.SET_DESIGNATED)

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
                                Designated Number
                            </p>

                            <p className="text-sm text-slate-500 mb-3">
                                This refers to the phone number that has been designated to receive withdrawal notifications, funds and confirming transactions.
                                {/* It serves as a unique identifier and is crucial for facilitating secure and efficient fund transfers from your account. */}
                            </p>

                            {
                                state.data.entity.max === 1 ? (
                                    <>

                                    </>
                                ) : (
                                    <div className="md:w-10/12 w-full py-3">
                                        {
                                            state.data.designated === null || state.data.designated === undefined ? (
                                                state.data.Fb0C === 'N' ? (
                                                    <div className="mb-2 bg-sky-00 py-4 px-4 border-2 border-sky-300 border-dashed rounded-md">
                                                        <div className="flex flex-row align-middle items-center text-sky-700 px-2">
                                                            <i className="fa-duotone fa-info-circle fa-2x mt-1 text-blue-700 flex-none"></i>

                                                            <div className="flex-auto ml-1 mt-1">
                                                                <span className="text-sm pl-3 block py-2 text-blue-700">
                                                                    You can't set a designated number. Please wait for your inviter to set or select one first. Once they do, you'll be have to approve it to make it operational.
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
                                                                    Your account does not have a designated number.
                                                                </span>

                                                                <span className="text-sm pl-3 block text-blue-700">
                                                                    Upon setting a designated number, it will require approval from your members before it can be opertional.
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex md:flex-row-reverse flex-col align-middle items-center pt-3">
                                                            <span className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-slate-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                Choose a member's number
                                                            </span>

                                                            <span onClick={setOwnMsisdnAsDesignated} className="text-sm flex-none shadow-none px-3 py-1 bg-inherit text-slate-600 hover:underline hover:cursor-pointer mr-2 sm:w-auto sm:text-sm">
                                                                Set your own number
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="mb-2 bg-sky-00 px-2">
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
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            }


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