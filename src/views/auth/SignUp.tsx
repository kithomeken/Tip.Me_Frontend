import { Helmet } from "react-helmet"
import React, { useState } from "react"
import { Listbox } from "@headlessui/react"
import PhoneInput, { isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input'

import '../../assets/css/react_phone_number_input.css'

import { SIGN_UP } from "../../api/API_Registry"
import { useAppSelector } from "../../store/hooks"
import HttpServices from "../../services/HttpServices"
import { ListBoxZero } from "../../lib/hooks/ListBoxZero"
import { APPLICATION } from "../../global/ConstantsRegistry"
import { classNames } from "../../lib/modules/HelperFunctions"
import { G_onInputBlurHandler } from "../../components/lib/InputHandlers"
import { Link } from "react-router-dom"

export const SignUp = () => {
    const [state, setstate] = useState({
        posting: false,
        response: 'x00',
        artists: [
            {
                stage_name: '',
                first_name: '',
                last_name: '',
                email: '',
                identifier: '',
                id_type: 'ID',
                country: '',
                msisdn: '',
                xval: '',
                docPhoto: null,
                docFile: null,
                dataCheck: {
                    stage_name: {
                        checking: false,
                        exists: false,
                    },
                    email: {
                        checking: false,
                        exists: false,
                    },
                    identifier: {
                        checking: false,
                        exists: false,
                    },
                    msisdn: {
                        checking: false,
                        exists: false,
                    },
                }
            }
        ],
        artistErrors: [
            {
                stage_name: '',
                first_name: '',
                last_name: '',
                email: '',
                identifier: '',
                id_type: 'ID',
                msisdn: '',
                docPhoto: '',
            }
        ]
    })

    const authenticationState: any = useAppSelector(state => state.auth);

    const documentTypes = [
        { value: 'ID', name: "ID Number" },
        { value: 'PP', name: "Passport Number" },
    ]

    const onChangeListBoxHandler = (e: any, index: any) => {
        let { artists }: any = state
        artists[index].id_type = e

        setstate({
            ...state, artists
        })
    }

    const onPhoneInputChange = (e: any, index: any) => {
        const { posting } = state

        if (!posting) {
            let { artists }: any = state

            const artistDetailsCollection = state.artists.map((artist, mapIndex) => {
                if (index !== mapIndex) return artist

                if (artist.xval === '') {
                    const setXVAL = { ...artist, xval: e };
                }

                return {
                    ...artist,
                    msisdn: e,
                    // country: parsePhoneNumber(e)?.country
                }
            })

            artists = artistDetailsCollection

            setstate({
                ...state, artists
            })
        }
    }

    const onChangeHandler = (e: any, index: any) => {
        const { posting } = state

        if (!posting) {
            let { artistErrors } = state
            let { artists }: any = state

            const artistDetailsCollection = state.artists.map((artist, mapIndex) => {
                if (index !== mapIndex) return artist

                artistErrors[index][e.target.name] = ''
                return { ...artist, [e.target.name]: e.target.value }
            })

            artists = artistDetailsCollection

            setstate({
                ...state, artists, artistErrors
            })
        }
    }

    const onInputBlur = (e: any, index: any) => {
        let { posting } = state

        if (!posting) {
            let output: any = G_onInputBlurHandler(e, posting, 'Artist', 3)
            let { artists } = state
            let { artistErrors } = state

            /* 
             * Post inputBlur executions
            */
            if (output.error === '') {
                switch (e.target.name) {
                    case 'stage_name':
                        artists[index].dataCheck.stage_name.checking = true
                        artistStageNameCheck(index)
                        break;

                    case 'email':
                        artists[index].dataCheck.email.checking = true
                        artistEmailAddressCheck(index)
                        break;

                    case 'identifier':
                        const identifierType = state.artists[index].id_type
                        output.value = output.value.toUpperCase()

                        if (identifierType === 'ID') {
                            if (!/^\d*$/.test(artists[index].identifier)) {
                                output.error = 'Please provide a valid ID number'
                            }
                        } else {
                            artists[index].dataCheck.identifier.checking = true
                            artistIdentifierCheck(index)
                        }
                        break;

                    default:
                        break;
                }
            }

            artists[index][e.target.name] = output.value
            artistErrors[index][e.target.name] = output.error.replace('_', ' ')

            setstate({
                ...state, artists, artistErrors
            })
        }
    }

    const onPhoneInputBlur = (e: any, index: any) => {
        let { posting } = state

        if (!posting) {
            let { artists } = state
            let { artistErrors } = state

            artists[index].dataCheck.msisdn.checking = true
            // artistEmailAddressCheck(index)
        }
    }

    const artistStageNameCheck = async (index: any) => {
        let { artists } = state
        let { artistErrors } = state

        try {
            let formData = new FormData()
            formData.append("check", artists[index].stage_name)

            const response: any = await HttpServices.httpPost(SIGN_UP.CHECK_STAGE_NAME, formData)
            artists[index].dataCheck.stage_name.checking = false

            if (response.data.available) {
                artists[index].dataCheck.stage_name.exists = false
            } else {
                artistErrors[index].stage_name = 'Stage name already exists'
                artists[index].dataCheck.stage_name.exists = true
            }
        } catch (error) {
            artistErrors[index].stage_name = APPLICATION.ERR_MSG
            artists[index].dataCheck.stage_name.exists = true
            artists[index].dataCheck.stage_name.checking = false
        }

        setstate({
            ...state, artists, artistErrors
        })
    }

    const artistEmailAddressCheck = async (index: any) => {
        let { artists } = state
        let { artistErrors } = state

        try {
            let formData = new FormData()
            formData.append("check", artists[index].email)

            const response: any = await HttpServices.httpPost(SIGN_UP.CHECK_EMAIL, formData)
            artists[index].dataCheck.email.checking = false

            if (response.data.available) {
                artists[index].dataCheck.email.exists = false
            } else {
                artistErrors[index].email = 'Email address already exists'
                artists[index].dataCheck.email.exists = true
            }
        } catch (error) {
            artistErrors[index].email = APPLICATION.ERR_MSG
            artists[index].dataCheck.email.exists = true
            artists[index].dataCheck.email.checking = false
        }

        setstate({
            ...state, artists, artistErrors
        })
    }

    const artistIdentifierCheck = async (index: any) => {
        let { artists } = state
        let { artistErrors } = state

        try {
            let formData = new FormData()
            formData.append("check", artists[index].identifier)

            const response: any = await HttpServices.httpPost(SIGN_UP.CHECK_IDENTIFIER, formData)
            artists[index].dataCheck.identifier.checking = false

            if (response.data.available) {
                artists[index].dataCheck.identifier.exists = false
            } else {
                artistErrors[index].identifier = 'Passport/ID Number already exists'
                artists[index].dataCheck.identifier.exists = true
            }
        } catch (error) {
            artistErrors[index].identifier = APPLICATION.ERR_MSG
            artists[index].dataCheck.identifier.exists = true
            artists[index].dataCheck.identifier.checking = false
        }

        setstate({
            ...state, artists, artistErrors
        })
    }

    const onFileChangeHandler = (e: any, index: any) => {
        let { posting } = state

        if (!posting) {
            let { artists } = state
            let { artistErrors } = state
            let fileSize = (e.target.files[0].size / 1024) / 1024
            let fileType = e.target.files[0].type

            if (fileType !== 'image/png' && fileType !== 'image/jpg' && fileType !== 'image/jpeg') {
                artistErrors[index][e.target.name] = 'Allowed file types are png, jpg and jpeg files'
                artists[index].docPhoto = null
                artists[index].docFile = null

                setstate({
                    ...state, artists, artistErrors
                })
                return
            } else if (fileSize > 1) {
                artistErrors[index][e.target.name] = 'Maximum file upload size is 1MB'
                artists[index].docPhoto = null
                artists[index].docFile = null

                setstate({
                    ...state, artists, artistErrors
                })
                return
            }

            artists[index].docPhoto = e.target.files[0]
            artists[index].docFile = e.target.files[0].name
            artistErrors[index][e.target.name] = ''

            setstate({
                ...state, artists, artistErrors
            })
        }
    }

    function formValidation() {
        let { posting } = state
        let valid = true;

        if (!posting) {
            let { artists }: any = state
            let { artistErrors }: any = state

            Object.keys(artists).forEach(function (key) {
                if (!artists[key].stage_name.trim()) {
                    artistErrors[key].stage_name = 'Artist stage name cannot be empty';
                    valid = false
                }

                if (!artists[key].first_name.trim()) {
                    artistErrors[key].first_name = 'First name cannot be empty';
                    valid = false
                }

                if (!artists[key].last_name.trim()) {
                    artistErrors[key].last_name = 'Last name cannot be empty';
                    valid = false
                }

                if (!artists[key].msisdn.trim() || artists[key].msisdn.length < 5) {
                    artistErrors[key].msisdn = 'Kindly add a valid phone number';
                    valid = false
                }

                if (!artists[key].email.trim()) {
                    artistErrors[key].email = 'Email cannot be empty';
                    valid = false
                }

                if (!artists[key].identifier.trim()) {
                    artistErrors[key].identifier = artistErrors[key].id_type === 'ID' ? 'ID number cannot be empty' : 'Passport number cannot be empty';
                    valid = false
                }

                if (!artists[key].docPhoto === null) {
                    artistErrors[key].docFile = 'Kindly upload ID/Passport photo'
                    valid = false
                }

                if (artists[key].dataCheck.stage_name.exist) {
                    artistErrors[key].stage_name = 'Artist stage name already exists'
                    valid = false
                }

                if (artists[key].dataCheck.email.exist) {
                    artistErrors[key].email = 'Email address already exists'
                    valid = false
                }

                if (artists[key].dataCheck.identifier.exist) {
                    artistErrors[key].identifier = artistErrors[key].id_type === 'ID' ? 'ID number already exists' : 'Passport number already exists';
                    valid = false
                }

                if (artists[key].dataCheck.msisdn.exist) {
                    artistErrors[key].msisdn = 'Phone number already exists'
                    valid = false
                }
            })
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

                requestOnboardingApiCall()
            }
        }
    }

    const requestOnboardingApiCall = async () => {
        let { posting } = state
        let { artists }: any = state
        let { response }: any = state

        try {
            let formData = new FormData()

            Object.keys(artists).forEach(function (key) {
                formData.append("stage_name[]", artists[key].stage_name)
                formData.append("first_name[]", artists[key].first_name)
                formData.append("last_name[]", artists[key].last_name)
                formData.append("email[]", artists[key].email)
                formData.append("identifier[]", artists[key].identifier)
                formData.append("id_type[]", artists[key].id_type)
                formData.append("country[]", artists[key].country)
                formData.append("msisdn[]", artists[key].msisdn)
                formData.append("docPhoto[]", artists[key].docPhoto)
            })

            const apiResponse: any = await HttpServices.httpMultipartForm(SIGN_UP.ONBOARD, formData)

            posting = false
            response = apiResponse.status.toString()

            setstate({
                ...state, posting, response
            })
        } catch (error) {
            response = '500'
            posting = false

            console.log('ERRR', error);


            setstate({
                ...state, posting, response
            })
        }
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Sign Up</title>
            </Helmet>

            <div className="flex flex-col">
                <div className="wrapper flex-grow">
                    <section className="w-144 my-0 mx-auto py-8 z-0">
                        <div className="px-5">
                            <header className="landing-header">
                                <div className="landing pl-3 mb-0 text-left">
                                    <h2 className="odyssey text-left text-purple-500 nunito">{APPLICATION.NAME}</h2>
                                    <span className="text-sm text-left mt-0 mb-3">Account Sign Up</span>
                                </div>
                            </header>

                            {
                                state.response === '200' ? (
                                    <div className="mt-1 flex flex-col md:flex-row md:space-x-4 justify-center px-6 py-4 border-2 border-green-300 border-dashed rounded-md">
                                        <div className="space-y-6 text-center flex flex-col align-middle">
                                            <i className="fa-sharp fa-solid fa-circle-check mx-auto p-5 fa-2xl text-green-400"></i>

                                            <div className="text-sm w-full text-green-600">
                                                <p className="pb-3 text-lg">Your onboarding request has been received.</p>
                                                <p className="text-sm text-gray-500 pb-3">
                                                    Our team will review your details and reach out to you within the next 7 business days.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : state.response === 'x00' ? (
                                    <form className="space-y-3 shadow-none px-2 mb-5" onSubmit={onFormSubmitHandler}>
                                        <div className="shadow-none space-y-px">
                                            {
                                                state.artists.map((persona: any, index: any) => {
                                                    return (
                                                        <div className="w-full" key={index}>
                                                            <div className="mb-2 flex flex-col md:flex-row md:space-x-4 border-b border-purple-300">
                                                                <div className="w-full">
                                                                    <CustomArrayInput
                                                                        index={index}
                                                                        artist={persona}
                                                                        artistErr={state.artistErrors[index]}
                                                                        field_name={'stage_name'}
                                                                        label={'Artist Name'}
                                                                        onChangeHandler={onChangeHandler}
                                                                        onInputBlur={onInputBlur}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="mb-2 pt-1 flex flex-col md:flex-row md:space-x-4">
                                                                <div className="w-full md:w-1/2">
                                                                    <CustomArrayInput
                                                                        index={index}
                                                                        artist={persona}
                                                                        artistErr={state.artistErrors[index]}
                                                                        field_name={'first_name'}
                                                                        label={'First Name'}
                                                                        onChangeHandler={onChangeHandler}
                                                                        onInputBlur={onInputBlur}
                                                                    />
                                                                </div>

                                                                <div className="w-full md:w-1/2">
                                                                    <CustomArrayInput
                                                                        index={index}
                                                                        artist={persona}
                                                                        artistErr={state.artistErrors[index]}
                                                                        field_name={'last_name'}
                                                                        label={'Last Name'}
                                                                        onChangeHandler={onChangeHandler}
                                                                        onInputBlur={onInputBlur}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="mb-2 flex flex-col md:flex-row md:space-x-4 border-b border-purple-300">
                                                                <div className="w-full md:w-1/2">
                                                                    <label htmlFor="msisdn" className="block text-sm leading-6 text-gray-500 mb-2">Phone Number:</label>

                                                                    <PhoneInput
                                                                        international
                                                                        defaultCountry='KE'
                                                                        className="border border-gray-300 px-3 rounded"
                                                                        placeholder="Enter phone number"
                                                                        value={persona.msisdn}
                                                                        onChange={(e) => onPhoneInputChange(e, index)}
                                                                        onBlur={(e) => onPhoneInputBlur(e, index)}
                                                                        error={persona.msisdn ? (isValidPhoneNumber(persona.msisdn) ? undefined : 'Invalid phone number') : 'Phone number required'}
                                                                    />

                                                                    {
                                                                        state.artistErrors[index].msisdn.length > 0 &&
                                                                        <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                            {state.artistErrors[index].msisdn}
                                                                        </span>
                                                                    }
                                                                </div>

                                                                <div className="w-full md:w-1/2">
                                                                    <CustomArrayInput
                                                                        index={index}
                                                                        artist={persona}
                                                                        artistErr={state.artistErrors[index]}
                                                                        field_name={'email'}
                                                                        field_type={'email'}
                                                                        label={'Email Address'}
                                                                        onChangeHandler={onChangeHandler}
                                                                        onInputBlur={onInputBlur}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="mb-2 flex flex-col md:flex-row md:space-x-4 pt-1">
                                                                <div className="w-full md:w-1/2 mb-3">
                                                                    <ListBoxZero
                                                                        onChangeListBoxHandler={(e) => onChangeListBoxHandler(e, index)}
                                                                        state={state}
                                                                        label="Document Type:"
                                                                        listButton={
                                                                            <>
                                                                                {documentTypes.map((document, index) => (
                                                                                    <span key={index}>
                                                                                        {
                                                                                            persona.id_type === document.value ? (
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
                                                                                {documentTypes.map((document, index) => (
                                                                                    <Listbox.Option
                                                                                        key={index}
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
                                                                    <CustomArrayInput
                                                                        index={index}
                                                                        artist={persona}
                                                                        artistErr={state.artistErrors[index]}
                                                                        field_name={'identifier'}
                                                                        label={persona.id_type === 'ID' ? 'ID Number' : 'Passport Number'}
                                                                        onChangeHandler={onChangeHandler}
                                                                        onInputBlur={onInputBlur}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="mt-1 flex flex-col md:flex-row md:space-x-4 justify-center px-6 pt-4 pb-4 mb-3 border-2 border-gray-300 border-dashed rounded-md">
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
                                                                                    persona.id_type === 'ID' ? 'Upload ID Photo' : 'Upload Passport Photo'
                                                                                }
                                                                            </span>
                                                                            <input id="file-upload" name="docPhoto" required type="file" onChange={(e) => onFileChangeHandler(e, index)} className="sr-only" />
                                                                        </label>
                                                                        <p className="pl-1"></p>
                                                                        <p className="text-xs text-gray-500">png, jpg, jpeg up to 1MB</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {
                                                                persona.docPhoto !== null && persona.docPhoto !== undefined ? (
                                                                    <div className="w-full">
                                                                        <span className="text-gray-500 block mb-1 text-xs w-full">
                                                                            File Name:
                                                                        </span>

                                                                        <span className="text-slate-600 block text-xs w-full">
                                                                            <span className="fad fa-file mr-2"></span>
                                                                            {persona.docFile}
                                                                        </span>
                                                                    </div>
                                                                ) : null
                                                            }

                                                            {state.artistErrors[index].docPhoto.length > 0 &&
                                                                <span className='invalid-feedback font-small text-red-600 pl-0'>
                                                                    {state.artistErrors[index].docPhoto}
                                                                </span>
                                                            }
                                                        </div>
                                                    )
                                                })
                                            }

                                            <div className="mb-3 pt-3">
                                                <button className="bg-purple-600 relative w-48 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-purple-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-purple-700" type="submit">
                                                    <span>
                                                        {
                                                            state.posting ? (
                                                                <>
                                                                    <span className="left-0 inset-y-0 flex items-center">
                                                                        <span className="pr-2">
                                                                            {/* Signing In */}
                                                                        </span>

                                                                        <span className="w-5 h-5">
                                                                            <i className="fad fa-spinner-third fa-lg fa-spin"></i>
                                                                        </span>
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Request Onboarding
                                                                </>
                                                            )
                                                        }
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="mt-1 flex flex-col md:flex-row md:space-x-4 justify-center px-6 py-4 border-2 border-red-300 border-dashed rounded-md">
                                        <div className="space-y-6 text-center flex flex-col align-middle">
                                            <i className="fa-sharp fa-solid fa-circle-exclamation mx-auto p-5 fa-2xl text-red-400"></i>

                                            <div className="text-sm w-full text-red-600">
                                                <p className="pb-3 text-lg">Something went wrong.</p>
                                                <p className="text-sm text-gray-500 pb-3">
                                                    We could not submit your onboarding request. <br/>Kindly try again later.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            <div className="pb-4 my-3">
                                <div className="flex items-center justify-center">
                                    <div className="text-sm">
                                        <Link to={'/auth/sign-in'} className="font-medium text-center text-purple-600 hover:text-purple-700">
                                            <span className="font-small">
                                                Back to Sign In
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="bg-purple-600 text-white p-4 fixed bottom-0 w-full">
                    <div className="mx-auto max-w-7xl text-center">
                        <p className="text-sm">
                            © {new Date().getFullYear()}. Elevated Acts of Appreciation, <span className="text-yellow-400">Tip by Tip.</span>
                        </p>
                    </div>
                </footer>
            </div>
        </React.Fragment >
    )
}

const CustomArrayInput = ({ artist, artistErr, field_name, label, index, field_type = 'text', onChangeHandler, onInputBlur, confirmAvaliability = false }) => {

    return (
        <React.Fragment>
            <div className="shadow-none space-y-px mb-4">
                <label htmlFor={field_name} className="block text-sm leading-6 text-gray-500 mb-2">{label}:</label>

                <div className="relative mt-2 rounded shadow-sm">
                    <input type={field_type} name={field_name} id={field_name} placeholder={label} autoComplete="off"
                        className={classNames(
                            artistErr[field_name].length > 0 ?
                                'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                'text-gray-900 ring-slate-300 placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-purple-600 focus:outline-purple-500 hover:border-gray-400',
                            'block w-full rounded-md py-2 pl-3 pr-8 border border-gray-300 text-sm'
                        )} onChange={(e) => onChangeHandler(e, index)} value={artist[field_name]} onBlur={(e) => onInputBlur(e, index)} required />
                    <div className="absolute inset-y-0 right-0 flex items-center w-8">
                        {
                            artist.dataCheck[field_name]?.checking ? (
                                <span className="fa-duotone text-purple-500 fa-spinner-third fa-lg fa-spin"></span>
                            ) : artistErr[field_name].length > 0 ? (
                                <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                            ) : null
                        }
                    </div>
                </div>

                {
                    artistErr[field_name].length > 0 ? (
                        <span className='invalid-feedback text-xs text-red-600 pl-0'>
                            {artistErr[field_name]}
                        </span>
                    ) : null
                }
            </div>
        </React.Fragment>
    )
}