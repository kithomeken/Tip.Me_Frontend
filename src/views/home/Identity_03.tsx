import React, { useState } from "react"
import { useDispatch } from "react-redux"
import { Listbox } from "@headlessui/react"

import { AUTH } from "../../api/API_Registry"
import { useAppSelector } from "../../store/hooks"
import HttpServices from "../../services/HttpServices"
import { ListBoxZero } from "../../lib/hooks/ListBoxZero"
import { Loading } from "../../components/modules/Loading"
import { classNames } from "../../lib/modules/HelperFunctions"
import artisticForm from "../../assets/images/9148043_4085061.svg"
import { InputWithLoadingIcon } from "../../components/lib/InputWithLoadingIcon"
import { artistEntityCreation, resetIdentity } from "../../store/identityCheckActions"
import { G_onInputBlurHandler, G_onInputChangeHandler } from "../../components/lib/InputHandlers"

export const Identity_03 = () => {
    const [state, setstate] = useState({
        status: 'pending',
        data: {
            artistTypes: null
        },
        input: {
            entity: '',
            artist_name: '',
            artist_type: 'SOLO',
        },
        errors: {
            entity: '',
            artist_name: '',
            artist_type: '',
        },
        artist_name: {
            checking: false,
            exists: false
        }
    })

    React.useEffect(() => {
        dispatch(resetIdentity())
        fetchArtistTypeData()
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

            switch (e.target.name) {
                case 'artist_name':
                    if (output.error === '') {
                        let { artist_name } = state
                        artist_name.checking = true

                        checkArtistAvailability()
                    } else {
                        let { artist_name } = state
                        artist_name.checking = false
                    }
                    break;

                default:
                    break;
            }

            input[e.target.name] = output.value
            errors[e.target.name] = output.error

            setstate({
                ...state, input, errors
            })
        }
    }



    const onChangeListBoxHandler = (e: any) => {
        let { input } = state
        input.artist_type = e

        setstate({
            ...state, input
        })
    }

    const checkArtistAvailability = async () => {
        let { artist_name } = state
        let { errors } = state

        try {
            let { input } = state

            let formData = new FormData()
            formData.append('artist_name', input.artist_name)

            const responsecheck: any = await HttpServices.httpPost(AUTH.PRE_META_01, formData)

            if (responsecheck.data.available) {
                errors.artist_name = ''
                artist_name.exists = false
            } else {
                errors.artist_name = 'Artist name already exists'
                artist_name.exists = true
            }
        } catch (error) {
            errors.artist_name = 'Artist name already exists'
            artist_name.exists = true
        }

        artist_name.checking = false

        setstate({
            ...state, artist_name, errors
        })
    }

    const artistEntityFormHandler = (e: any) => {
        e.preventDefault()

        if (!idC_State.processing) {
            let entity = state.input.artist_type === 'SOLO' ? state.input.artist_name : state.input.entity

            const identProps = {
                dataDump: {
                    artist: state.input.artist_name,
                    type: state.input.artist_type,
                    entity: entity,
                }
            }

            dispatch(artistEntityCreation(identProps))
        }
    }

    const fetchArtistTypeData = async () => {
        let { status } = state
        let { data } = state

        try {
            const typesResponse: any = await HttpServices.httpGet(AUTH.ARTIST_TYPES)

            if (typesResponse.data.success) {
                status = 'fulfilled'
                data.artistTypes = typesResponse.data.payload.types
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

    return (
        <React.Fragment>
            <div className="w-full border-dashed rounded-md border-2 border-slate-300">
                <div className="flex mb-4 w-full flex-col md:flex-row px-3 gap-4 py-3 align-middle justitfy-center m-auto ">
                    <div className="mx-auto md:basis-1/2 md:px-2 flex-shrink-0 flex items-center justify-center mb-3 sm:mx-0 md:w-64 w-48">
                        <img src={artisticForm} alt={artisticForm} width="auto" className="block text-center m-auto" />
                    </div>

                    <div className="w-full md:basis-1/2">
                        <div className="text-center md:text-start">
                            <span className="text-amber-600 mb-2 py-1 md:px-3 text-right block text-sm">
                                3 OF 4 COMPLETE
                            </span>

                            <span className="text-stone-600 mb-3 text-2xl block">
                                Your Artist Profile
                                <span className="text-sm text-slate-500 block">
                                    The final step
                                </span>
                            </span>

                            <div className="text-sm text-slate-600 pb-4">
                                <span className="block">
                                    Ready to shine? Complete your artist profile and step into a world of possibilities as a registered artist on our platform.
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col mb-3">
                            {
                                state.status === 'rejected' ? (
                                    <>
                                    </>
                                ) : state.status === 'fulfilled' ? (
                                    <form className="space-y-4 shadow-none px- mb-3 w-full md:w-2/3 text-sm" onSubmit={artistEntityFormHandler}>
                                        <div className="w-full pb-2 px-3 md:px-0">
                                            <ListBoxZero
                                                onChangeListBoxHandler={(e: any) => onChangeListBoxHandler(e)}
                                                state={state}
                                                label="Artist Type:"
                                                listButton={
                                                    <>
                                                        {state.data.artistTypes.map((artistType: any, index: any) => (
                                                            <span key={`kP${index}YxL7Zu`}>
                                                                {
                                                                    state.input.artist_type === artistType.key ? (
                                                                        <span className="flex items-center py-1">
                                                                            <span className="ml-2 text-sm text-gray-700 truncate">{artistType.value}</span>
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
                                                        {state.data.artistTypes.map((artistType: any, index: any) => (
                                                            <Listbox.Option
                                                                key={`28LbWz${index}XqFp`}
                                                                className={({ active }) =>
                                                                    classNames(
                                                                        active ? 'text-white bg-gray-100' : 'text-gray-900',
                                                                        'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                    )
                                                                }
                                                                value={artistType.key}
                                                            >
                                                                {({ selected }) => (
                                                                    <>
                                                                        <span className="flex items-center">
                                                                            <span className="ml-2 text-sm text-gray-700 truncate">{artistType.value}</span>
                                                                        </span>

                                                                        {selected ? (
                                                                            <span className="text-amber-600 absolute inset-y-0 right-0 flex items-center pr-4">
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

                                        {
                                            state.input.artist_type !== 'SOLO' ? (
                                                <div className="shadow-none space-y-px mb-4 px-3 md:px-0">
                                                    <label htmlFor="entity" className="block text-sm leading-6 text-stone-600 mb-1">
                                                        {
                                                            (state.data.artistTypes.find(
                                                                (typeValue: any) => typeValue.key === state.input.artist_type
                                                            )
                                                            )?.value
                                                        } Name:
                                                    </label>

                                                    <div className="relative mt-2 rounded shadow-sm">
                                                        <input type="text" name="entity" id="entity" placeholder="Name" autoComplete="off"
                                                            className={classNames(
                                                                state.errors.entity.length > 0 ?
                                                                    'text-red-900 ring-slate-300 placeholder:text-red-400 focus:ring-red-600 border border-red-600 focus:outline-red-500' :
                                                                    'text-stone-900 ring-slate-300 placeholder:text-stone-400 focus:border-0 focus:outline-none focus:ring-amber-600 focus:outline-amber-500 hover:border-stone-400 border border-stone-300',
                                                                'block w-full rounded-md py-2 pl-3 pr-8  text-sm'
                                                            )} onChange={onChangeHandler} value={state.input.entity} onBlur={onInputBlur} required />
                                                        <div className="absolute inset-y-0 right-0 flex items-center w-8">
                                                            {
                                                                state.errors.entity.length > 0 ? (
                                                                    <span className="fa-duotone text-red-500 fa-circle-exclamation fa-lg"></span>
                                                                ) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    {
                                                        state.errors.entity.length > 0 ? (
                                                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                {state.errors.entity}
                                                            </span>
                                                        ) : null
                                                    }
                                                </div>
                                            ) : null
                                        }

                                        <div className="shadow-none space-y-px mb-4 px-3 md:px-0">
                                            <InputWithLoadingIcon
                                                name={'artist_name'}
                                                label={`${state.input.artist_type !== 'SOLO' ? 'My ' : ''} Artist Name`}
                                                placeHolder={'Artist name'}
                                                onInputBlurHandler={onInputBlur}
                                                onChangeHandler={onChangeHandler}
                                                inputValue={state.input.artist_name}
                                                errorsName={state.errors.artist_name}
                                                checkForStatus={state.artist_name.checking}
                                            />
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
                                                            Complete
                                                        </div>
                                                    )
                                                }
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="w-full h-full flex flex-col justify-center">
                                        <div className="flex-grow">
                                            <Loading />
                                        </div>
                                    </div>
                                )
                            }


                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}