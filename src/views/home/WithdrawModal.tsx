import React, { FC, useState } from "react"

import { DynamicModal } from "../../lib/hooks/DynamicModal"
import { API_RouteReplace, classNames, formatAmount } from "../../lib/modules/HelperFunctions"
import { G_onInputBlurHandler, G_onInputChangeHandler } from "../../components/lib/InputHandlers"
import { ACCOUNT } from "../../api/API_Registry"
import HttpServices from "../../services/HttpServices"

interface props {
    account: string,
    show: boolean,
    showOrHide: any,
}

export const WithdrawModal: FC<props> = ({ show, showOrHide, account }) => {
    const [state, setstate] = useState({
        posting: false,
        show: false,
        status: 'pending',
        modal: {
            errorTitle: '',
            errorMessage: '',
        },
        data: {
            pending: '',
            locked: '',
            bal: '',
            max: '',
        },
        input: {
            amount: '',
            description: '',
        },
        errors: {
            amount: '',
            description: '',
        }
    })

    React.useEffect(() => {
        if (show) {
            cashWithdrawalValidation()
        }
    }, [show])

    const cashWithdrawalValidation = async () => {
        let { status } = state
        let { data } = state
        let { modal } = state

        try {
            const apiRoute = API_RouteReplace(ACCOUNT.VALIDATE_WITHDRAWAL, ':auid', account)
            const response: any = await HttpServices.httpPostWithoutData(apiRoute)
            console.log(response);

            if (response.data.success) {
                status = 'fulfilled'
                data.locked = response.data.payload.locked
                data.bal = response.data.payload.bal
                data.max = response.data.payload.max
                data.bal = formatAmount(parseFloat(data.bal))
            } else {
                status = 'rejected'
                data.locked = response.data.payload.locked
                data.pending = response.data.payload.pending
                modal.errorTitle = 'Withdrawal Disabled'

                if (data.locked === 'Y') {
                    modal.errorMessage = 'Withdrawal process has temporarily been disabled for your account. Please contact the admin for further details and assistance'
                } else if (data.pending) {
                    modal.errorMessage = 'A pending withdrawal request already exists'
                }
            }
        } catch (error) {
            console.log(error);
            status = 'rejected'
        }

        setstate({
            ...state, status, data, posting: false, modal,
            input: { amount: '', description: '' },
            errors: { amount: '', description: '' },
        })
    }

    const showOrHideSummaryDescription = () => {
        let { show } = state
        show = !state.show

        setstate({
            ...state, show
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
                const withdrawalAmount = output.value.replace(',', '')
                const walletBalanace = state.data.bal.replace(',', '')
                const transactionMaxAmount = state.data.max

                if (output.error.length < 1) {
                    if (parseFloat(withdrawalAmount) > parseFloat(transactionMaxAmount)) {
                        // Maximum withdrawable amount per transaction
                        output.value = transactionMaxAmount
                        output.error = 'Maximum withdrawal amount per transaction is KSh. ' + formatAmount(parseFloat(transactionMaxAmount))
                    } else if (parseFloat(withdrawalAmount) > parseFloat(walletBalanace)) {
                        // Maximum withdrawable amount as per wallet
                        output.value = walletBalanace
                        output.error = 'Maximum withdrawal amount is KSh. ' + formatAmount(parseFloat(walletBalanace))
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

    function formValidation() {
        let valid = true

        let { input } = state
        let { errors } = state

        if (input.amount.length < 1) {
            errors.amount = "Kindly add the amount you'd wish to withdraw"
            valid = false
        } else {
            const amount = input.amount.replace(',', '')
            const isValidAmount = /^\d+(\.\d{1,2})?$/.test(amount);

            const walletBalanace = state.data.bal.replace(',', '')
            const transactionMaxAmount = state.data.max

            if (!isValidAmount) {
                errors.amount = "Invalid amount format"
                valid = false
            } else {
                if (parseFloat(amount) < 100) {
                    errors.amount = "Minimum withdrawal amount per transaction is KSh. 100"
                    valid = false
                } else if (parseFloat(amount) > parseFloat(transactionMaxAmount)) {
                    errors.amount = "Maximum withdrawal amount per transaction is KSh. " + formatAmount(parseFloat(transactionMaxAmount))
                    valid = false
                } else if (parseFloat(amount) > parseFloat(walletBalanace)) {
                    errors.amount = 'Maximum withdrawal amount is KSh. ' + formatAmount(parseFloat(walletBalanace))
                    valid = false
                }
            }
        }

        if (input.description.length > 1) {
            if (input.description.length < 5) {
                errors.description = 'Summary description cannot be less than 5 characters'
                valid = false
            } else if (input.description.length > 200) {
                errors.description = 'Summary description cannot be more than 200 characters'
                valid = false
            }
        }

        return valid
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {
            const valid = formValidation()

            if (valid) {
                setstate({
                    ...state, posting: true
                })

                cashWithdrawalRequest()
            }
        }
    }

    const cashWithdrawalRequest = async () => {
        let { modal } = state
        let { status } = state

        try {
            let { input } = state
            let formData = new FormData()

            formData.append("amount", input.amount.replace(',', ''))
            formData.append("description", input.description)

            const cashWithdrawalRoute = API_RouteReplace(ACCOUNT.REQUEST_WITHDRAWAL, ':auid', account)
            const apiResponse: any = await HttpServices.httpPost(cashWithdrawalRoute, formData)

            if (apiResponse.data.success) {
                showOrHide()
            } else {
                status = 'rejected'
                modal.errorTitle = 'Action Failed'
                modal.errorMessage = apiResponse.data.payload.message
            }
        } catch (error) {
            console.log(error);
            status = 'rejected'

            modal.errorTitle = 'Action Failed'
            modal.errorMessage = "Something went wrong. Kindly try again later"
        }

        setstate({
            ...state, status, modal, posting: false
        })
    }

    return (
        <React.Fragment>
            <DynamicModal
                size={"md"}
                title={'Cash Withdrawal'}
                status={state.status}
                show={show}
                posting={state.posting}
                showOrHideModal={showOrHide}
                actionButton={"Request"}
                error={{
                    title: state.modal.errorTitle,
                    message: state.modal.errorMessage
                }}
                onFormSubmitHandler={onFormSubmitHandler}
                formComponents={
                    <>

                        <div className="flex flex-col md:flex-row">
                            <div className="pb-2 md:basis-1/2 w-full py-2">
                                <span className="py-1 px-1.5 block text-xs text-stone-500">
                                    <i className="fa-light fa-wallet text-stone-500 fa-lg mr-2"></i>
                                    Available
                                </span>

                                <div className="w-full flex flex-row align-middle items-center py-4">
                                    <span className="pc-1 px-1.5 text-stone-500 text-xs">
                                        Ksh.
                                    </span>

                                    <span className="pc-1 px-1.5 text-2xl">
                                        <span className="text-stone-700">{state.data.bal.split('.')[0]}</span>
                                        <span className="text-stone-400">.{state.data.bal.split('.')[1]}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="pb-2 md:basis-1/2 w-full pt-1 md:border-l md:border-t-0 border-t md:px-4">
                                <div className="shadow-none mb-4">
                                    <label htmlFor="amount" className="block text-xs leading-6 py-1 text-stone-500 mb-2">Withdrawal Amount:</label>

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
                        </div>

                        {
                            state.errors.amount.length > 0 ? (
                                <span className='invalid-feedback text-xs text-red-600 py-2'>
                                    {state.errors.amount}
                                </span>
                            ) : null
                        }

                        <div className="w-full pt-2">
                            <span onClick={showOrHideSummaryDescription} className="text-purple-600 py-1 text-sm md:flex cursor-pointer flex-row items-center hover:text-purple-700 focus:outline-none">
                                <i className="fa-regular fa-plus mr-2 fa-lg" data-te-toggle="tooltip" title="Summary description is only visible to you"></i>
                                {
                                    state.show ? 'Hide summary description' : 'Add summary description'
                                }
                            </span>

                            {
                                state.show ? (
                                    <>
                                        <div className="py-2 rounded shadow-sm pr-4">
                                            <textarea name="description" id="description" placeholder="Summary description" autoComplete="off" rows={3}
                                                className={classNames(
                                                    state.errors.description.length > 0 ?
                                                        'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                        'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:outline-none focus:border-0 focus:ring-purple-600 focus:outline-purple-500 hover:border-gray-400',
                                                    'block w-full rounded py-2 resize-none pl-3 pr-8 border border-gray-300 text-sm'
                                                )} onChange={onChangeHandler} onBlur={onInputBlur} value={state.input.description}></textarea>
                                            <div className="absolute inset-y-0 right-0 top-0 pt-4 flex items-enter w-8">
                                                {
                                                    state.errors.description.length > 0 ? (
                                                        <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                    ) : null
                                                }
                                            </div>
                                        </div>

                                        {
                                            state.errors.description.length > 0 ? (
                                                <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                    {state.errors.description}
                                                </span>
                                            ) : null
                                        }
                                    </>
                                ) : null
                            }
                        </div>
                    </>
                }
            />


        </React.Fragment>
    )
}