import React, { FC, useState } from "react"
import { BespokePanel } from "../../../lib/hooks/BespokePanel"

interface RequestProps {
    show: boolean,
    showOrHide: any,
}

export const RequestDetails: FC<RequestProps> = ({show, showOrHide}) => {
    const [state, setstate] = useState({
        status: 'pending',
        posting: false,
        data: {

        },
        input: {

        },
        errors: {

        }
    })

    return (
        <React.Fragment>
            <BespokePanel
                show={show}
                showOrHidePanel={showOrHide}
                components={
                    <>

                    </>
                }
            />
        </React.Fragment>
    )
}