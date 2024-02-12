import React, { useState } from "react"
import { useDispatch } from "react-redux"

import { useAppSelector } from "../../store/hooks"
import { classNames } from "../../lib/modules/HelperFunctions"
import smallAsset from "../../assets/images/12704367_5037373.svg"
import { addIdentityToProfile, resetIdentity } from "../../store/identityCheckActions"
import { G_onInputBlurHandler, G_onInputChangeHandler } from "../../components/lib/InputHandlers"
import { Listbox } from "@headlessui/react"
import { ListBoxZero } from "../../lib/hooks/ListBoxZero"

export const Identity_01 = () => {
    const [state, setstate] = useState({
        input: {
            first_name: '',
            last_name: '',
            identifier: '',
            id_type: 'ID',
            docPhoto: null,
            docFile: null,
        },
        errors: {
            first_name: '',
            last_name: '',
            identifier: '',
            id_type: '',
            docPhoto: '',
            docFile: '',
        },
    })

    React.useEffect(() => {
        dispatch(resetIdentity())
    }, [])

    const dispatch: any = useDispatch();
    const idC_State: any = useAppSelector(state => state.idC)

    const documentTypes = [
        { value: 'ID', name: "ID Number" },
        { value: 'PP', name: "Passport Number" },
    ]

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

    const onChangeListBoxHandler = (e: any) => {
        let { input } = state

        if (!idC_State.processing) {
            input.id_type = e

            setstate({
                ...state, input
            })
        }
    }

    const onFileChangeHandler = (e: any) => {
        if (!idC_State.processing) {
            let { input } = state
            let { errors } = state

            let fileSize = (e.target.files[0].size / 1024) / 1024
            let fileType = e.target.files[0].type

            if (fileType !== 'image/png' && fileType !== 'image/jpg' && fileType !== 'image/jpeg') {
                errors[e.target.name] = 'Allowed file types are png, jpg and jpeg files'
                input.docPhoto = null
                input.docFile = null

                setstate({
                    ...state, input, errors
                })

                return
            } else if (fileSize > 1) {
                errors[e.target.name] = 'Maximum file upload size is 1MB'
                input.docPhoto = null
                input.docFile = null

                setstate({
                    ...state, input, errors
                })

                return
            }

            input.docPhoto = e.target.files[0]
            input.docFile = e.target.files[0].name
            errors[e.target.name] = ''

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
                    identifier: state.input.identifier,
                    id_type: state.input.id_type,
                    docPhoto: state.input.docPhoto,
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

                        <div className="flex flex-col mb-3 md:w-4/ w-full">
                            <form className="space-y-4 shadow-none px-2 mb-3" onSubmit={onFormSubmitHandler}>
                                <div className="md:mb-2 flex flex-col md:flex-row md:space-x-4 pt-1 px-3">
                                    <div className="w-full md:w-1/2 mb-3">
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

                                    <div className="w-full md:w-1/2 mb-3">
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
                                </div>

                                <div className="pb-3 flex flex-col md:flex-row md:space-x-4 md:pt-1 px-3">
                                    <div className="w-full md:w-1/2 mb-3">
                                        <ListBoxZero
                                            onChangeListBoxHandler={(e) => onChangeListBoxHandler(e)}
                                            state={state}
                                            label="Document Type:"
                                            listButton={
                                                <>
                                                    {documentTypes.map((document, key) => (
                                                        <span key={key}>
                                                            {
                                                                state.input.id_type === document.value ? (
                                                                    <span className="flex items-center">
                                                                        <span className="ml-2 text-sm text-gray-700 truncate">{document.name}</span>
                                                                    </span>
                                                                ) : null
                                                            }
                                                        </span>
                                                    ))}

                                                    <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                        <i className="far fa-chevron-down text-emerald-500"></i>
                                                    </span>
                                                </>
                                            }
                                            listOptions={
                                                <>
                                                    {documentTypes.map((document, key) => (
                                                        <Listbox.Option
                                                            key={`DES-${key}`}
                                                            className={({ active }) =>
                                                                classNames(
                                                                    active ? 'text-white bg-gray-100' : 'text-gray-900',
                                                                    'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                )
                                                            }
                                                            value={document.value}
                                                        >
                                                            {({ selected }) => (
                                                                <>
                                                                    <span className="flex items-center">
                                                                        <span className="ml-2 text-sm text-gray-700 truncate">{document.name}</span>
                                                                    </span>

                                                                    {selected ? (
                                                                        <span className="text-purple-600 absolute inset-y-0 right-0 flex items-center pr-4">
                                                                            <i className="fad fa-check h-5 w-5"></i>
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </>
                                            }
                                        />
                                    </div>

                                    <div className="w-full md:w-1/2">
                                        <label htmlFor="identifier" className="block text-sm leading-6 text-stone-700 mb-1">
                                            {state.input.id_type === 'ID' ? 'ID Number' : 'Passport Number'}
                                        </label>

                                        <div className="relative mt-2 rounded shadow-sm">
                                            <input type="text" name="identifier" id="identifier" placeholder={state.input.id_type === 'ID' ? 'ID Number' : 'Passport Number'} autoComplete="off"
                                                className={classNames(
                                                    state.errors.identifier.length > 0 ?
                                                        'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                        'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-amber-600 focus:outline-amber-500 hover:border-stone-400 border border-stone-300',
                                                    'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                                )} onChange={onChangeHandler} value={state.input.identifier} onBlur={onInputBlur} required />
                                            <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                {
                                                    state.errors.identifier.length > 0 ? (
                                                        <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                    ) : null
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-3 mx-3 flex flex-col md:flex-row md:space-x-4 justify-center px-6 pt-4 pb-4 mb-3 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center flex align-middle">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="text-sm w-full ml-3 text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded bg-white text-indigo-600 hover:text-indigo-500 focus:outline-none focus-within:outline-none "
                                            >
                                                <span>
                                                    {
                                                        state.input.id_type === 'ID' ? 'Upload ID Photo' : 'Upload Passport Photo'
                                                    }
                                                </span>
                                                <input id="file-upload" name="docPhoto" required type="file" onChange={(e) => onFileChangeHandler(e)} className="sr-only" />
                                            </label>
                                            <p className="pl-1"></p>
                                            <p className="text-xs text-gray-500">png, jpg, jpeg up to 1MB</p>
                                        </div>
                                    </div>
                                </div>

                                {
                                    state.input.docPhoto !== null && state.input.docPhoto !== undefined ? (
                                        <div className="w-full">
                                            <span className="text-gray-500 block mb-1 text-xs w-full">
                                                File Name:
                                            </span>

                                            <span className="text-slate-600 block text-xs w-full">
                                                <span className="fad fa-file mr-2"></span>
                                                {state.input.docFile}
                                            </span>
                                        </div>
                                    ) : null
                                }

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