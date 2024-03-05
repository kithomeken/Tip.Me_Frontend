import React from "react"
import { Outlet } from "react-router"

export default function GenericRoutesGuard() {
    return (
        <React.Fragment>

            <Outlet />

        </React.Fragment>
    )
}