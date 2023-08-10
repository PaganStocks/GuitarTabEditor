'use client';
import React, { FC } from 'react';

type SelectionComponentProps = {
    /**
     * The x position of the selection
     */
    x: number;

    /**
     * The y position of the selection
     */
    y: number;
};

const selectionComponent: FC<SelectionComponentProps> = (props) => {
    return (
        <rect
            width="8"
            height="8"
            x={props.x}
            y={props.y}
            fillOpacity="0.5"
        />
    );
}

export default selectionComponent;