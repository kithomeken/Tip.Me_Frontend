import React from "react"

export const Loading = () => {

    return(
        <React.Fragment>
            <div className="flex flex-col align-middle h-16">
                <span className="fad text-amber-500 fa-spinner-third fa-2x m-auto block fa-spin"></span>
            </div>
        </React.Fragment>
    )
}