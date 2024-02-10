import React, { useState } from "react"
import { useDispatch } from "react-redux"

import { useAppSelector } from "../../store/hooks"
import { classNames } from "../../lib/modules/HelperFunctions"
import smallAsset from "../../assets/images/12704367_5037373.svg"
import { addIdentityToProfile, resetIdentity } from "../../store/identityCheckActions"
import { G_onInputBlurHandler, G_onInputChangeHandler } from "../../components/lib/InputHandlers"

export const Identity_01 = () => {
    const [state, setstate] = useState({
        input: {
            first_name: '',
            last_name: '',
        },
        errors: {
            first_name: '',
            last_name: '',
        },
    })

    React.useEffect(() => {
        dispatch(resetIdentity())
    }, [])

    const dispatch: any = useDispatch();
    const idC_State: any = useAppSelector(state => state.idC)

    const onChangeHandler = (e: any) => {
        if (!idC_State.processing) {
            let output: any = G_onInputChangeHandler(e, idC_State.processing)
            let { input } = state
            let { errors }: any = state

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    const onInputBlur = (e: any) => {
        if (!idC_State.processing) {
            let output: any = G_onInputBlurHandler(e, idC_State.processing, '')
            let { input } = state
            let { errors }: any = state

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()

        if (!idC_State.processing) {
            const identProps = {
                dataDump: {
                    last_name: state.input.last_name,
                    first_name: state.input.first_name,
                }
            }

            dispatch(addIdentityToProfile(identProps))
        }
    }

    return (
        <React.Fragment>
            <div className="w-full border-dashed rounded-md border-2 border-slate-300">
                <div className="flex mb-4 w-full flex-col md:flex-row px-3 gap-4 py-3 align-middle justitfy-center m-auto ">
                    <div className="mx-auto md:basis-1/2 md:px-2 flex-shrink-0 flex items-center justify-center mb-3 sm:mx-0 md:w-64 w-48">
                        <img src={smallAsset} alt={smallAsset} width="auto" className="block text-center m-auto" />
                    </div>

                    <div className="w-full md:basis-1/2">
                        <div className="text-center md:text-start">
                            <span className="text-amber-500 mb-2 py-1 md:px-3 text-right block text-sm">
                                1 OF 4 COMPLETE
                            </span>

                            <span className="text-amber-600 mb-3 text-2xl block">
                                Your Identity
                                <span className="text-sm text-slate-500 block">
                                    Stand out from the crowd!
                                </span>
                            </span>

                            <div className="text-sm text-slate-600 pb-4">
                                <span className="block">
                                    Adding your full name let's the world know who you are.
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col mb-3 md:w-2/3 w-full">
                            <form className="space-y-4 shadow-none px-2 mb-3" onSubmit={onFormSubmitHandler}>
                                <div className="shadow-none space-y-px mb-4 px-3 md:px-0">
                                    <label htmlFor="first_name" className="block text-sm leading-6 text-stone-600 mb-1">First Name:</label>

                                    <div className="relative mt-2 rounded shadow-sm">
                                        <input type="text" name="first_name" id="first_name" placeholder="First Name" autoComplete="off"
                                            className={classNames(
                                                state.errors.first_name.length > 0 ?
                                                    'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                    'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-amber-600 focus:outline-amber-500 hover:border-stone-400 border border-stone-300',
                                                'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                            )} onChange={onChangeHandler} value={state.input.first_name} onBlur={onInputBlur} required />
                                        <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                            {
                                                state.errors.first_name.length > 0 ? (
                                                    <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                ) : null
                                            }
                                        </div>
                                    </div>

                                    {
                                        state.errors.first_name.length > 0 ? (
                                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                {state.errors.first_name}
                                            </span>
                                        ) : null
                                    }
                                </div>

                                <div className="shadow-none space-y-px mb-4 px-3 md:px-0">
                                    <label htmlFor="last_name" className="block text-sm leading-6 text-stone-700 mb-1">Last Name:</label>

                                    <div className="relative mt-2 rounded shadow-sm">
                                        <input type="text" name="last_name" id="last_name" placeholder="Last Name" autoComplete="off"
                                            className={classNames(
                                                state.errors.last_name.length > 0 ?
                                                    'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                    'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-amber-600 focus:outline-amber-500 hover:border-stone-400 border border-stone-300',
                                                'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                            )} onChange={onChangeHandler} value={state.input.last_name} onBlur={onInputBlur} required />
                                        <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                            {
                                                state.errors.last_name.length > 0 ? (
                                                    <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                ) : null
                                            }
                                        </div>
                                    </div>

                                    {
                                        state.errors.last_name.length > 0 ? (
                                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                {state.errors.last_name}
                                            </span>
                                        ) : null
                                    }
                                </div>

                                <div className="mb-3 pt-3 px-3 md:px-0">
                                    <button className="bg-amber-600 float-right relative w-28 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-amber-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-amber-700" type="submit">
                                        {
                                            idC_State.processing ? (
                                                <div className="flex justify-center items-center py-3">
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
            </div>
        </React.Fragment>
    )
}