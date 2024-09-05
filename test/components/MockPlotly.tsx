import React from "react";

interface Props {
    data: any[],
    useResizeHandler: boolean
    style: any
    layout: any
}

export default function MockPlotly({
                                       data,
                                       layout,
                                       useResizeHandler,
                                       style
                                   }: Props) {
    return <div>
        <div data-testid={"data"}>{data.map(d => <span>{JSON.stringify(d)}</span>)}</div>
        <div data-testid={"layout"}> {JSON.stringify(layout)}</div>
        <div data-testid={"resize"}> {useResizeHandler} </div>
        <div data-testid={"style"}>{JSON.stringify(style)}</div>
    </div>
}
