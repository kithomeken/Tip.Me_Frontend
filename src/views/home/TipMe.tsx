import { Helmet } from "react-helmet"
import React, { useState } from "react"
import { useParams } from "react-router"

import { Loading } from "../../components/modules/Loading"
import { APPLICATION } from "../../global/ConstantsRegistry"
import { classNames, formatAmount } from "../../lib/modules/HelperFunctions"
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers"
import { ACCOUNT } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"

export const TipMe = () => {
    const [state, setstate] = useState({
        status: 'fulfilled',
        posting: false,
        data: {
            max: '100000',
        },
        input: {
            amount: '200',
            msisdn: '254724392070'
        },
        errors: {
            amount: '',
            msisdn: ''
        }
    })

    const params = useParams();

    React.useEffect(() => {
        fetchArtistDetails()
    }, [])

    const fetchArtistDetails = async () => {
        let { data } = state
        let { status } = state

        try {

        } catch (error) {
            console.log(error);
            status = 'rejected'
        }

        setstate({
            ...state, status, data
        })
    }

    const onChangeHandler = (e: any) => {
        let output: any = G_onInputChangeHandler(e, state.posting)
        let { input } = state
        let { errors }: any = state

        input[e.target.name] = output.value
        errors[e.target.name] = output.error

        setstate({
            ...state, input, errors
        })
    }

    const onInputBlur = (e: any) => {
        let output: any = G_onInputBlurHandler(e, state.posting, '')
        let { input } = state
        let { errors }: any = state

        switch (e.target.name) {
            case 'amount':
                const transactionMaxAmount = state.data.max
                const tipAmount = output.value.replace(',', '')

                if (output.error.length < 1) {
                    if (parseFloat(tipAmount) > parseFloat(transactionMaxAmount)) {
                        // Maximum withdrawable amount per transaction
                        output.value = transactionMaxAmount
                        output.error = 'Maximum tipping amount is KSh. ' + formatAmount(parseFloat(transactionMaxAmount))
                    }
                }

                const theAmount = output.value.replace(',', '')
                input[e.target.name] = formatAmount(parseFloat(theAmount))
                errors[e.target.name] = output.error
                break;

            default:
                input[e.target.name] = output.value
                errors[e.target.name] = output.error
                break;
        }

        setstate({
            ...state, input, errors
        })
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {
            stkPushNotification()
        }
    }

    const stkPushNotification = async () => {
        let { input } = state
        let { errors } = state

        try {
            let formData = new FormData()
            formData.append("amount", input.amount.replace(',', ''))
            formData.append("msisdn", input.msisdn)
            formData.append("account", params.acid)

            const apiResponse: any = await HttpServices.httpPost(ACCOUNT.STK_PUSH_NOFITICATION, formData)

            if (apiResponse.data.success) {

            } else {

            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>{APPLICATION.NAME}</title>
            </Helmet>

            <div className="flex flex-col">
                <div className="wrapper flex-grow">
                    <section className="w-144 my-0 mx-auto py-8 z-0">
                        <div className="px-5">
                            <header className="landing-header">
                                <div className="landing pl-3 mb-0 text-left">
                                    <h2 className="odyssey text-left text-purple-500 nunito">
                                        {APPLICATION.NAME}
                                    </h2>
                                </div>
                            </header>

                            {
                                state.status === 'rejected' ? (
                                    <>

                                    </>
                                ) : state.status === 'fulfilled' ? (
                                    <>
                                        <form className="space-y-3 shadow-none px-2 mb-5" onSubmit={onFormSubmitHandler}>
                                            <div className="pb-2 md:basis-1/2 w-full pt-1 md:border-l md:border-t-0 border-t md:px-4">
                                                <div className="shadow-none mb-4">
                                                    <label htmlFor="msisdn" className="block text-xs leading-6 py-1 text-stone-500 mb-2">Phone Number:</label>

                                                    <div className="relative mt-2 rounded shadow-sm">
                                                        <input type="text" name="msisdn" id="msisdn" placeholder="2547XXXXXXXX" autoComplete="off"
                                                            className={classNames(
                                                                state.errors.msisdn.length > 0 ?
                                                                    'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                    'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-purple-600 focus:outline-purple-500 hover:border-gray-400',
                                                                'block w-full rounded-md py-2 pl-3 pr-8 border border-gray-300 text-m'
                                                            )} onChange={onChangeHandler} value={state.input.msisdn} onBlur={onInputBlur} required />
                                                        <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                            {
                                                                state.errors.msisdn.length > 0 ? (
                                                                    <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pb-2 md:basis-1/2 w-full pt-1 md:border-l md:border-t-0 border-t md:px-4">
                                                <div className="shadow-none mb-4">
                                                    <label htmlFor="amount" className="block text-xs leading-6 py-1 text-stone-500 mb-2">Amount To Tip:</label>

                                                    <div className="relative mt-2 rounded shadow-sm">
                                                        <input type="text" name="amount" id="amount" placeholder="0.00" autoComplete="off"
                                                            className={classNames(
                                                                state.errors.amount.length > 0 ?
                                                                    'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                    'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-purple-600 focus:outline-purple-500 hover:border-gray-400',
                                                                'block w-full rounded-md py-2 pl-3 pr-8 border border-gray-300 text-m'
                                                            )} onChange={onChangeHandler} value={state.input.amount} onBlur={onInputBlur} required />
                                                        <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                            {
                                                                state.errors.amount.length > 0 ? (
                                                                    <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button type="submit" className="w-24 justify-center disabled:cursor-not-allowed text-sm rounded-md border border-transparent shadow-sm px-3 py-1-5 bg-purple-600 text-white disabled:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-purple-500">
                                                Done
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col justify-center">
                                        <div className="flex-grow">
                                            <Loading />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </section>
                </div>
            </div>
        </React.Fragment>
    )
}