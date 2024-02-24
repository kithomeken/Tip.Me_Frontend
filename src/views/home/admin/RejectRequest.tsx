import React, { FC, useState } from "react"

import HttpServices from "../../../services/HttpServices"
import { ADMINISTRATION } from "../../../api/API_Registry"
import { DynamicModal } from "../../../lib/hooks/DynamicModal"
import { API_RouteReplace, classNames } from "../../../lib/modules/HelperFunctions"
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../../components/lib/InputHandlers"

interface Props {
    uuid: string,
    show: boolean,
    showOrHide: any,
    reloadRequestDetails: any,
}

export const RejectRequest: FC<Props> = ({ show, showOrHide, reloadRequestDetails, uuid }) => {
    const [state, setstate] = useState({
        posting: false,
        input: {
            comment: ''
        },
        errors: {
            comment: ''
        }
    })

    React.useEffect(() => {
        if (show) {
            resetState()
        }
    }, [show])

    const resetState = () => {
        setstate({
            ...state, posting: false, input: { comment: '' }
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

        input[e.target.name] = output.value
        errors[e.target.name] = output.error

        setstate({
            ...state, input, errors
        })
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {
            let isValid = true
            let { input } = state
            let { errors } = state

            if (state.input.comment.length < 1) {
                errors.comment = 'Kindly add a comment'
                isValid = false
            } else if (state.input.comment.length < 5) {
                errors.comment = 'Comment cannot be less than 5 characters'
                isValid = false
            } else if (state.input.comment.length > 30) {
                errors.comment = 'Comment cannot be more than 30 characters'
                isValid = false
            } else {
                errors.comment = ''
            }

            if (isValid) {
                setstate({
                    ...state, posting: true
                })

                declineOnboardingRequest()
            }
        }
    }

    const declineOnboardingRequest = async () => {
        try {
            let requestActionRoute = null
            let apiResponse: any = null

            let formData = new FormData()
            formData.append('comment', state.input.comment)

            requestActionRoute = API_RouteReplace(ADMINISTRATION.DECLINE_REQUETS, ':uuid', uuid)
            apiResponse = await HttpServices.httpPost(requestActionRoute, formData)

            reloadRequestDetails()
        } catch (error) {
            console.log(error);
        }

        setstate({
            ...state, posting: false
        })
    }

    return (
        <React.Fragment>
            <DynamicModal
                size={"lg"}
                title={'Decline Onboarding Request'}
                status={'fulfilled'}
                show={show}
                posting={state.posting}
                formComponents={
                    <>
                        <span className="text-sm mb-3">
                            Kindly add reason for declining request:
                        </span>

                        <div className="mb-2 flex flex-col md:flex-row md:space-x-4 border-b border-amber-300">
                            <div className="w-12/12 rounded shadow-none space-y-px mb-4">
                                <div className="relative mt-2 rounded shadow-sm">
                                    <textarea name="comment" id="comment" placeholder="Add Comment" autoComplete="off" rows={3}
                                        className={classNames(
                                            state.errors.comment.length > 0 ?
                                                'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:outline-none focus:border-0 focus:ring-green-600 focus:outline-green-500 hover:border-gray-400',
                                            'block w-full rounded py-2 resize-none pl-3 pr-8 border border-gray-300 text-sm'
                                        )} onChange={onChangeHandler} onBlur={onInputBlur} required={true} value={state.input.comment}></textarea>
                                    <div className="absolute inset-y-0 right-0 top-0 pt-4 flex items-enter w-8">
                                        {
                                            state.errors.comment.length > 0 ? (
                                                <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                            ) : null
                                        }
                                    </div>
                                </div>

                                {
                                    state.errors.comment.length > 0 ? (
                                        <span className='invalid-feedback text-xs text-red-600 pl-0 capitalize'>
                                            {state.errors.comment}
                                        </span>
                                    ) : null
                                }
                            </div>
                        </div>
                    </>
                }
                showOrHideModal={showOrHide}
                actionButton={'Decline'}
                onFormSubmitHandler={onFormSubmitHandler}
            />
        </React.Fragment>
    )
}