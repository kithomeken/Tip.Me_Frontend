import React from "react";

import completed from "../../assets/images/Completed-amico.svg"

export const Identity_00 = () => {

    const reloadWindow = () => {
        window.location.reload();
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
                                <span className="block text-xl">
                                    Your request has been submitted.
                                    <span className="block">Your account will be approved within 3 business days.</span>
                                </span>
                            </div>
                        </div>

                        <div className="mb-3 pt-3 px-3 md:px-0">
                            <button type="button" onClick={reloadWindow} className="bg-amber-600 float-right relative w-40 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white hover:bg-amber-700 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:bg-amber-700">
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