import React from "react"

export const ERR_500 = () => {

    return (
        <React.Fragment>
            <div className="flex align-middle items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-red-500 mb-4">500</h1>
                    <p className="text-xl text-gray-700 mb-2">Internal Server Error</p>
                    <p className="text-lg text-gray-600">
                        Sorry, something went wrong on our end.
                    </p>
                </div>
            </div>
        </React.Fragment>
    )
}