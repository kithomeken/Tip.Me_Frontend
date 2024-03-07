import React, { FC, useState } from "react"
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

import { Basic_Modal_Props } from "../../lib/modules/Interfaces"
import { DynamicModal } from "../../lib/hooks/DynamicModal"

export const ChangeMsisdn: FC<Basic_Modal_Props> = ({ reload, show, showOrHide }) => {
    const [state, setstate] = useState({
        data: null,
        posting: false,
        status: 'fulfilled',
        input: {
            msisdn: '',
        },
        errors: {
            msisdn: '',
        },
        modal: {
            errorTitle: '',
            errorMessage: '',
        },
    })

    const onPhoneInputChange = (e: any) => {
        let { posting } = state

        if (!posting) {
            let { input } = state
            input.msisdn = e

            setstate({
                ...state, input
            })
        }
    }

    const onPhoneInputBlur = (e: any) => {
        let { posting } = state

        if (!posting) {
            let { errors } = state
            const validPhone = isValidPhoneNumber(e.target.value)

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

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()

    }

    return (
        <React.Fragment>
            <DynamicModal
                show={show}
                size={"sm"}
                status={state.status}
                posting={state.posting}
                title={'Change Phone Number'}
                showOrHideModal={showOrHide}
                actionButton={"Change"}
                error={{
                    title: state.modal.errorTitle,
                    message: state.modal.errorMessage
                }}
                onFormSubmitHandler={onFormSubmitHandler}
                formComponents={
                    <>
                        <span className="text-sm pb-4 block text-stone-600">
                            Please enter your new phone number below to update your contact information.
                        </span>

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
                        </div>




                    </>
                }
            />
        </React.Fragment>
    )
}