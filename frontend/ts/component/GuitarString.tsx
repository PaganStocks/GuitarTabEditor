// A react component to display a guitar string

import React, { Fragment, useRef } from "react";
import { GuitarString } from "../model/note";

type GuitarStringProps = {
  /**
   * The guitar string to display; this also holds the state of the string
   */
  guitarString: GuitarString;

  /**
   * The offset of the string from the top of the svg element
   * @default [0, 0]
   */
  offset?: [number, number];

  /**
   * The number of pixels per beat
   * @default pxPerBeat
   */
  beatPixels: number;
  /**
   * The function to call when the string is clicked
   */
  onClick?: (string: GuitarString) => void;
};

const GuitarStringComponent: React.FC<GuitarStringProps> = ({
  guitarString,
  offset = [0, 0],
  beatPixels,
  onClick,
}: GuitarStringProps) => {
  return (
    <Fragment>
      <line
        onClick={() => onClick && onClick(guitarString)}
        x1={offset[0]}
        x2="100%"
        y1={offset[1]}
        y2={offset[1]}
        stroke="black"
        strokeWidth="2"
      />
      {Array.from(guitarString.notes().entries()).map((noteBeat, i) => {
        return (
          <Fragment key={i}>
            <rect x={noteBeat[0] * beatPixels - 7} y={offset[1] - 7.5} width={20} height={15} fill="white" />
            <text x={noteBeat[0] * beatPixels} y={offset[1] + 5} z-index="2" textLength="15px">{noteBeat[1].fret}</text>
          </Fragment>
        );
      })}
      
    </Fragment>
  );
};

export default GuitarStringComponent;
