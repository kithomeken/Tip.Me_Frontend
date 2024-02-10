import React, { useState } from "react"
import { useDispatch } from "react-redux"
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

import { useAppSelector } from "../../store/hooks"
import '../../assets/css/react_phone_number_input.css'
import serviceCenter from "../../assets/images/13105982_5146757.jpg"
import { addMSISDN_ToProfile, resetIdentity } from "../../store/identityCheckActions"

export const Identity_02 = () => {
    const [state, setstate] = useState({
        status: 'pending',
        data: {
            artistTypes: null
        },
        input: {
            msisdn: '',
        },
        errors: {
            msisdn: '',
        },
    })

    React.useEffect(() => {
        dispatch(resetIdentity())
    }, [])

    const dispatch: any = useDispatch();
    const idC_State: any = useAppSelector(state => state.idC)

    const onPhoneInputChange = (e: any) => {
        if (!idC_State.processing) {
            let { input } = state
            input.msisdn = e

            setstate({
                ...state, input
            })
        }
    }

    const onPhoneInputBlur = (e: any) => {
        if (!idC_State.processing) {
            let { errors } = state
            const validPhone = isValidPhoneNumber(e.target.value)
            console.log('POEIN', validPhone);

            if (!validPhone) {
                errors.msisdn = 'Kindly add a valid phone number'
            } else {
                errors.msisdn = ''
            }

            setstate({
                ...state, errors
            })
        }
    }

    const msisdnFormHandler = (e: any) => {
        e.preventDefault()

        if (!idC_State.processing) {
            const identProps = {
                dataDump: {
                    msisdn: state.input.msisdn,
                }
            }

            dispatch(addMSISDN_ToProfile(identProps))
        }
    }

    return (
        <React.Fragment>
            <div className="w-full border-dashed rounded-md border-2 border-slate-300">
                <div className="flex mb-4 w-full flex-col md:flex-row px-3 gap-4 py-3 align-middle justitfy-center m-auto ">
                    <div className="mx-auto md:basis-1/2 md:px-2 flex-shrink-0 flex items-center justify-center mb-3 sm:mx-0 md:w-64 w-48">
                        <img src={serviceCenter} alt={serviceCenter} width="auto" className="block text-center m-auto" />
                    </div>

                    <div className="w-full md:basis-1/2">
                        <div className="text-center md:text-start">
                            <span className="text-amber-600 mb-2 py-1 md:px-3 text-right block text-sm">
                                2 OF 4 COMPLETE
                            </span>

                            <span className="text-stone-600 mb-3 text-2xl block">
                                Contact Information
                                <span className="text-sm text-slate-500 block">
                                    {/* Stand out from the crowd! */}
                                </span>
                            </span>

                            <div className="text-sm text-slate-600 pb-4">
                                <span className="block">
                                    Our way of communicating important information such as updates, or security alerts.
                                </span>
                            </div>
                        </div>

                        <form className="space-y-4 shadow-none px- mb-3 w-full md:w-2/3" onSubmit={msisdnFormHandler}>
                            <div className="w-full">
                                <label htmlFor="msisdn" className="block text-sm leading-6 text-gray-500 mb-2">Phone Number:</label>

                                <PhoneInput
                                    international
                                    defaultCountry='KE'
                                    className="border border-gray-300 px-3 py-1.5 rounded"
                                    placeholder="Enter phone number"
                                    value={state.input.msisdn}
                                    onChange={onPhoneInputChange}
                                    onBlur={onPhoneInputBlur}
                                    error={state.input.msisdn ? (isValidPhoneNumber(state.input.msisdn) ? undefined : 'Invalid phone number') : 'Phone number required'}
                                />

                                {
                                    state.errors.msisdn.length > 0 &&
                                    <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                        {state.errors.msisdn}
                                    </span>
                                }

                                {
                                    idC_State.error && (
                                        <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                            {idC_State.error}
                                        </span>
                                    )
                                }
                            </div>

                            <div className="mb-3 pt-3 px-3 md:px-0">
                                <button className="bg-amber-600 float-right relative w-28 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-amber-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-amber-700" type="submit">
                                    {
                                        idC_State.processing ? (
                                            <div className="flex justify-center items-center gap-3 py-2">
                                                <i className="fad fa-spinner-third fa-xl fa-spin"></i>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center items-center gap-3">
                                                Next
                                            </div>
                                        )
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}