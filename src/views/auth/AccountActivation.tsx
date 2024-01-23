import { Helmet } from "react-helmet"
import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

import { SIGN_UP } from "../../api/API_Registry";
import { useAppSelector } from "../../store/hooks";
import HttpServices from "../../services/HttpServices";
import { postAuthRoutes } from "../../routes/authRoutes";
import { Loading } from "../../components/modules/Loading";
import { authActions } from "../../store/auth/authActions";
import { APPLICATION } from "../../global/ConstantsRegistry";
import { G_onInputChangeHandler, G_onInputBlurHandler } from "../../components/lib/InputHandlers";
import { API_RouteReplace, DeviceInfo, capitalizeFirstLetter } from "../../lib/modules/HelperFunctions";

export const AccountActivation = () => {
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch: any = useDispatch()

    const pathname = location.pathname
    const searchParam = location.search
    const authenticationState: any = useAppSelector(state => state.auth);

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [state, setstate] = useState({
        posting: false,
        status: 'pending',
        data: {
            account: null,
        },
        input: {
            password: '',
            password_confirmation: '',
        },
        errors: {
            password: '',
            password_confirmation: '',
        }
    })

    React.useEffect(() => {
        validateActivationLink()
    }, [])

    const validateActivationLink = async () => {
        let { data } = state
        let { status } = state

        try {
            const activationRoute = pathname + searchParam
            const response: any = await HttpServices.httpPostWithoutData(activationRoute)
            const apiStatusCode = response.status

            if (apiStatusCode === 200) {
                const responseStatus = response.data.success

                if (responseStatus) {
                    status = 'fulfilled'
                    data.account = response.data.payload.account
                } else {
                    // Activation failed. Redirect to sign-in
                    const redirectToRoute = '/auth/sign-in'
                    navigate(redirectToRoute, { replace: true });
                }
            } else {
                status = 'rejected'
            }
        } catch (error) {
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
            case 'password':
                if (state.input.password_confirmation.length > 1) {
                    if (state.input.password_confirmation !== e.target.value) {
                        output.error = 'Passwords do not match'
                    }
                }
                break;

            case 'password_confirmation':
                if (state.input.password !== e.target.value) {
                    output.error = 'Passwords do not match'
                }
                break;

            default:
                break;
        }

        input[e.target.name] = output.value
        errors.password = output.error

        setstate({
            ...state, input, errors
        })
    }

    const formValidation = () => {
        let valid = true
        let { input } = state
        let { errors } = state

        if (input.password.length < 1) {
            errors.password = 'Kindly add a password'
            valid = false
        } else if (input.password.length > 30) {
            errors.password = 'Maximum allowable length of password is 30 characters'
            valid = false
        }

        if (input.password_confirmation !== input.password) {
            errors.password = 'Passwords do not match'
            valid = false
        }

        setstate({
            ...state, errors
        })

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

                activateAccount()
            }
        }
    }

    const activateAccount = async () => {
        let { status } = state
        let { posting } = state

        try {
            let { data } = state
            let { input } = state
            let formData = new FormData()

            formData.append("password", input.password)
            formData.append("password_confirmation", input.password_confirmation)

            let activationRoute = API_RouteReplace(SIGN_UP.ACCOUNT_ACTIVATION, ':uuid', params.uuid)
            activationRoute = API_RouteReplace(activationRoute, ':hash', params.hash)
            activationRoute = activationRoute + searchParam

            const response: any = await HttpServices.httpPut(activationRoute, formData)
            const apiStatusCode = response.status
            console.log('RESP:', data);

            if (apiStatusCode === 200) {
                const responseStatus = response.data.success

                if (responseStatus) {
                    // Successfull activation
                    setCredentials({ ...credentials, email: data.account.email })
                    setCredentials({ ...credentials, password: input.password })

                    const props = {
                        auto: false,
                        credentials: {
                            email: data.account.email,
                            password: input.password
                        },
                        deviceInfo: DeviceInfo(),
                    }

                    console.log('RESPCCEC:', response);

                    if (response.data.payload.authenticate) {
                        // Auto authenticate & login
                        console.log('Auto-authenticate');
                        dispatch(authActions(props))
                    } else {
                        // Let user sing themselves in
                        const redirectToRoute = '/auth/sign-in'
                    navigate(redirectToRoute, { replace: true });
                    }
                } else {
                    // Activation failed. Redirect to sign-in
                    const redirectToRoute = '/auth/sign-in'
                    navigate(redirectToRoute, { replace: true });
                }
            } else {
                status = 'rejected'
            }
        } catch (error) {
            console.log(error);
        }

        posting = false

        setstate({
            ...state, status, posting
        })
    }

    if (authenticationState.isAuthenticated) {
        const accountValidationRoute: any = (postAuthRoutes.find((routeName) => routeName.name === 'ACC_CHECK_'))?.path

        return <Navigate state={state} replace to={accountValidationRoute} />;
    }

    return (
        <React.Fragment>
            <Helmet>
                <title>Account Activation</title>
            </Helmet>

            <div className="flex flex-col">
                <div className="wrapper flex-grow">
                    <section className="w-128 my-0 mx-auto py-8 z-0">
                        <div className="px-5">
                            {
                                state.status === 'rejected' ? (
                                    <div>
                                        <header className="landing-header">
                                            <div className="landing pl-3 mb-0 text-left">
                                                <h2 className="odyssey text-left text-purple-500 nunito">{APPLICATION.NAME}</h2>
                                                <span className="text-sm text-left mt-0 mb-3">Account Activation</span>
                                            </div>
                                        </header>

                                        <div className="mt-1 flex flex-col md:flex-row md:space-x-4 justify-center px-6 py-4 border-2 border-red-300 border-dashed rounded-md">
                                            <div className="space-y-6 text-center flex flex-col align-middle">
                                                <i className="fa-sharp fa-solid fa-circle-exclamation mx-auto p-5 fa-2xl text-red-400"></i>

                                                <div className="text-sm w-full text-red-600">
                                                    <p className="pb-3 text-lg">Activation Failed</p>
                                                    <p className="text-sm text-slate-600 pb-3">
                                                        Looks like the activation link is either expired or not valid. Reach out to our administrator for help
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : state.status === 'fulfilled' ? (
                                    <div className="w-full">
                                        <header className="landing-header">
                                            <div className="landing-header__left mb-0">
                                                <h2 className="odyssey text-purple-500 nunito">Hi {state.data.account.last_name},</h2>
                                                <span className="selected mt-0 mb-3 text-slate-800 text-xl">
                                                    Welcome to
                                                    <span className="text-purple-600 ml-2">
                                                        {APPLICATION.NAME}.
                                                    </span>
                                                </span>
                                            </div>
                                        </header>

                                        <div className="w-full mb-4 pb-3">
                                            <div className="text-sm text-slate-600">
                                                <span className="my-3 block">
                                                    We're thrilled to have you join us.
                                                </span>

                                                To complete your registration and activate your account, just key-in your password below, and we'll have you up and running in no time.
                                            </div>
                                        </div>


                                        <form className="space-y-3 shadow-none px-2 my-3 w-full md:w-8/12 m-auto" onSubmit={onFormSubmitHandler}>
                                            <div className="rounded-md shadow-none space-y-px">
                                                <div className="w-full pb-5">
                                                    <label htmlFor="password" className="sr-only">Password</label>
                                                    <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                                        placeholder="Password"
                                                        value={state.input.password}
                                                        onChange={onChangeHandler} onBlur={onInputBlur} />
                                                </div>

                                                <div className="w-full pb-5">
                                                    <label htmlFor="password_confirmation" className="sr-only">Confirm Password</label>
                                                    <input id="password_confirmation" name="password_confirmation" type="password" autoComplete="current-password" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                                        placeholder="Confirm Password"
                                                        value={state.input.password_confirmation}
                                                        onChange={onChangeHandler} onBlur={onInputBlur} />
                                                </div>

                                                {
                                                    state.errors.password.length > 1 ? (
                                                        <span className='invalid-feedback text-center block font-small text-red-600'>
                                                            {capitalizeFirstLetter(state.errors.password)}
                                                        </span>
                                                    ) : null
                                                }

                                                <div className="mb-3 pt-3">
                                                    <button className="bg-purple-600 relative w-36 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-purple-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-purple-700" type="submit">
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
                                                                        Activate
                                                                    </>
                                                                )
                                                            }
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>

                                        <span className="py-4 block text-sm text-slate-600 text-center">
                                            If you have any questions, feel free to reach out.
                                            <br />Happy to have you with us!
                                        </span>
                                    </div>
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