import { toast } from "react-toastify";
import React, { useState } from "react";

import { AUTH } from "../../api/API_Registry";
import HttpServices from "../../services/HttpServices";
import StorageServices from "../../services/StorageServices";
import { STORAGE_KEYS } from "../../global/ConstantsRegistry";
import completed from "../../assets/images/Completed-amico.svg"
import { G_onInputBlurHandler } from "../../components/lib/InputHandlers";

export const Identity_00 = () => {
    const [state, setstate] = useState({
        data: null,
        show: false,
        posting: false,
        status: 'pending',
        entity: [{
            email: '',
        }],
        entityErrors: [{
            email: '',
        }]
    })

    let specificObject: any = StorageServices.getLocalStorage(STORAGE_KEYS.ENTITY_TYPE)
    specificObject = JSON.parse(specificObject)

    const reloadWindow = () => {
        window.location.reload();
    }

    const onChangeHandler = (e: any, index: any) => {
        const { posting } = state

        if (!posting) {
            let { entityErrors } = state
            let { entity }: any = state

            const artistDetailsCollection = state.entity.map((artist, mapIndex) => {
                if (index !== mapIndex) return artist

                entityErrors[index][e.target.name] = ''
                return { ...artist, [e.target.name]: e.target.value }
            })

            entity = artistDetailsCollection

            setstate({
                ...state, entity, entityErrors
            })
        }
    }

    const onInputBlur = (e: any, index: any) => {
        let { posting } = state

        if (!posting) {
            let output: any = G_onInputBlurHandler(e, posting, '', 3)
            let { entity } = state
            let { entityErrors } = state

            entity[index][e.target.name] = output.value
            entityErrors[index][e.target.name] = output.error.replace('_', ' ')

            setstate({
                ...state, entity, entityErrors
            })
        }
    }

    const addPointOfContactHandler = () => {
        let { entity } = state
        let { entityErrors } = state
        const { posting } = state

        if (!posting) {
            if (entity.length < specificObject.max) {
                entity = state.entity.concat([{
                    email: '',
                }])

                entityErrors = state.entityErrors.concat([{
                    email: '',
                }])

                setstate({
                    ...state, entity, entityErrors
                })
            }
        }
    }

    const removePointOfContactHandler = (index: any) => {
        setstate({
            ...state,
            entity: state.entity.filter((s, varIdx) => index !== varIdx),
            entityErrors: state.entityErrors.filter((s, varIdx) => index !== varIdx),
        })
    }

    const showOrHideEntityInv = () => {
        setstate({
            ...state, show: !state.show
        })
    }

    const onFormSubmitHandler = (e: any) => {
        e.preventDefault()
        let { posting } = state

        if (!posting) {
            setstate({
                ...state, posting: true
            })
            addMemeberToEntity()
        }
    }

    const addMemeberToEntity = async () => {
        let { entity } = state
        let { posting } = state
        let formData = new FormData()

        try {
            Object.keys(entity).forEach(function (key) {
                formData.append("email[]", entity[key].email)
            })

            const entityResponse: any = await HttpServices.httpPost(AUTH.ENTITY_EXPANSION, formData)
            console.log('ENFR_3e8', entityResponse);

            if (entityResponse.data.success) {
                let toastText = 'Invites sent out'

                toast.success(toastText, {
                    position: "top-right",
                    autoClose: 7000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                reloadWindow()
            } else {

            }
        } catch (error) {

        }
    }

    return (
        <React.Fragment>
            <div className="w-full border-dashed rounded-md border-2 border-slate-300">
                <div className="flex mb-4 w-full flex-col md:flex-row px-3 gap-4 py-3 align-middle justitfy-center m-auto ">
                    <div className="mx-auto md:basis-1/2 md:px-2 flex-shrink-0 flex items-center justify-center mb-3 sm:mx-0 md:w-64 w-48">
                        <img src={completed} alt={completed} width="auto" className="block text-center m-auto" />
                    </div>

                    <div className="text-center w-full md:basis-1/2 md:text-start flex flex-col align-middle items-center justify-center">
                        <span className="text-amber-600 mb-2 py-1 md:px-3 text-right block text-sm">
                            4 OF 4 COMPLETE
                        </span>

                        <div className="flex-none text-center">
                            <span className="text-amber-600 mb-3 text-2xl block">
                                Welcome aboard!
                            </span>

                            <div className="text-slate-600 pb-4">
                                <span className="block text-sm">
                                    Your request has been submitted.
                                    <span className="block">Your account will be approved within 3 business days.</span>
                                </span>
                            </div>
                        </div>

                        {
                            specificObject && (
                                specificObject.max > 1 ? (
                                    <div className="flex-grow text-center w-full p-3">
                                        {
                                            state.show ? (
                                                <form className="w-full mb-6 md:w-2/3 m-auto" onSubmit={onFormSubmitHandler}>
                                                    {
                                                        state.entity.map((contact: any, index: any) => {
                                                            return (
                                                                <div key={`KDE_${index}`} className="w-full mb-3 flex flex-row align-middle">
                                                                    <div className="mr-5 mb-3 flex-grow">
                                                                        <input type="text" name="email" id="entity-1-email" autoComplete="off" onChange={(e) => onChangeHandler(e, index)} className="focus:ring-1 w-full focus:ring-green-500 p-1-5 lowercase flex-1 block text-sm rounded-md sm:text-sm border border-gray-300 disabled:opacity-50" onBlur={(e) => onInputBlur(e, index)} placeholder="jane.doe@email.com" value={contact.email} />

                                                                        {
                                                                            state.entityErrors[index].email.length > 0 &&
                                                                            <span className='invalid-feedback text-xs text-red-600 pl-0'>
                                                                                {state.entityErrors[index].email}
                                                                            </span>
                                                                        }
                                                                    </div>

                                                                    <div className="mb-3 flex-none w-20">
                                                                        {
                                                                            index !== 0 ? (
                                                                                <p className="text-red-500 p-1-5 flex-1 text-sm cursor-pointer mb-0" onClick={() => removePointOfContactHandler(index)}>
                                                                                    Remove
                                                                                </p>
                                                                            ) : (
                                                                                null
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                    <div className="w-6/12">
                                                        <div className="mb-3" id="poc_extra"></div>

                                                        {
                                                            state.entity.length < (specificObject.max - 1) ? (
                                                                <span className="text-blue-500 text-sm cursor-pointer" onClick={addPointOfContactHandler}>
                                                                    Add another member
                                                                </span>
                                                            ) : (
                                                                null
                                                            )
                                                        }
                                                    </div>

                                                    <div className="mb-3 pt-3 px-3 md:px-0">
                                                        <button className="bg-amber-600 float-right relative w-28 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-amber-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-amber-700" type="submit">
                                                            {
                                                                state.posting ? (
                                                                    <div className="flex justify-center items-center gap-3 py-2">
                                                                        <i className="fad fa-spinner-third fa-xl fa-spin"></i>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex justify-center items-center gap-3">
                                                                        Invite
                                                                    </div>
                                                                )
                                                            }
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <span className="text-amber-600 mb-3 text-sm block cursor-pointer border py-1-5 px-4 border-amber-600 rounded-md" onClick={showOrHideEntityInv}>
                                                    Invite to your members
                                                </span>
                                            )
                                        }
                                    </div>
                                ) : null
                            )
                        }

                        <div className="mb-3 pt-3 px-3 md:px-0">
                            <button type="button" onClick={reloadWindow} disabled={state.posting ? true : false} className="bg-amber-600 float-right relative w-40 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-amber-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-amber-700 disabled:cursor-not-allowed">
                                <div className="flex justify-center items-center gap-3">
                                    Take Me Home
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}