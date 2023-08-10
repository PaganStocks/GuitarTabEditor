import React, { MouseEvent, useState, useRef, useEffect } from "react";
import { Piece, GuitarString, Note } from "../model/note";
import GuitarStringComponent from "./GuitarString";
import SelectionComponent from "./SelectionComponent";
import { useAuth0 } from "@auth0/auth0-react";

export enum SnapInterval {
  WHOLE,
  HALF,
  QUARTER,
}

type SongComponentProps = {
  /**
   * The song to display
   */
  song: Piece;

  /**
   * The height of all staves
   * @default 100
   */
  staveHeight?: number;

  /**
   * The interval to snap to; this is the smallest note that can be placed
   * @default SnapInterval.HALF
   */
  snapInterval?: number;

  /**
   * The number of beats per bar
   * @default 4
   */
  beatsPerBar?: number;
};

type Selection = {
  beat: number;
  string: GuitarString;
};

function isKeypressForFret(e: KeyboardEvent): boolean {
  return e.key === "0" ||
    e.key === "1" ||
    e.key === "2" ||
    e.key === "3" ||
    e.key === "4" ||
    e.key === "5" ||
    e.key === "6" ||
    e.key === "7" ||
    e.key === "8" ||
    e.key === "9";
}

function pressedFret(e: KeyboardEvent): number {
  switch (e.key) {
    case "0":
      return 0;
    case "1":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "5":
      return 5;
    case "6":
      return 6;
    case "7":
      return 7;
    case "8":
      return 8;
    case "9":
      return 9;
  }
}
/**
 * A react component to display a song; this is responsible for any cross-stave
 * concerns like drawing the bar line.
 * @param props {@link SongComponentProps} to use to display the song
 * @returns a react component to display a song
 */
const SongComponent: React.FC<SongComponentProps> = ({
  song,
  staveHeight = 100,
  snapInterval = SnapInterval.HALF,
  beatsPerBar = 4,
}: SongComponentProps) => {
  const staveOffset = staveHeight / 5;
  const svgRef = useRef<SVGSVGElement>(null);

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getUserMetadata = async () => {
      const domain = "dev-an5ttq516gzjcpox.eu.auth0.com";

      try {
        const accessToken = await getAccessTokenSilently({
          authorizationParams: {
            audience: `https://${domain}/api/v2/`,
            scope: "read:current_user",
            prompt: "consent",
          },
        });

        const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

        const metadataResponse = await fetch(userDetailsByIdUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { user_metadata } = await metadataResponse.json();

        console.log(user_metadata);
      } catch (e) {
        console.log(e.message);
      }
    };

    getUserMetadata();
  }, [getAccessTokenSilently, user?.sub]);

  const pxPerBeat = svgRef.current
    ? svgRef.current.clientWidth / beatsPerBar
    : 0;

  const [barLineX, setBarLineX] = useState<number>(0);
  const [showBarLine, setShowBarLine] = useState<boolean>(false);
  const [selection, setSelection] = useState<Selection | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selection && isKeypressForFret(e)) {
        console.log("fret key pressed");
        selection.string.addNote(new Note(pressedFret(e)), selection.beat);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const drawBarLine = (e: MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    setShowBarLine(true);

    // Snap to either the nearest whole, half, or quarter beat
    const snapTo = (beat: number) => {
      switch (snapInterval) {
        case SnapInterval.WHOLE:
          return Math.round(beat);
        case SnapInterval.HALF:
          return Math.round(beat * 2) / 2;
        case SnapInterval.QUARTER:
          return Math.round(beat * 4) / 4;
      }
    };

    // Get the x coordinate of the mouse
    const x = e.nativeEvent.offsetX;

    // Get the beat that the mouse is on
    const beat = (x / e.currentTarget.clientWidth) * beatsPerBar;

    // Snap to the nearest beat
    const snappedBeat = snapTo(beat);

    // Set the bar line x coordinate
    setBarLineX((snappedBeat / beatsPerBar) * e.currentTarget.clientWidth);
  };

  const stringClicked = (string: GuitarString) => {
    const ind = Array.from(song.guitarStrings.values()).indexOf(string);

    if (ind === -1) {
      throw new Error("String not found in song");
    }

    if (!svgRef.current) {
      return;
    }

    const beat = (barLineX / svgRef.current.clientWidth) * beatsPerBar;

    setSelection({
      beat,
      string,
    });
  };

  return (
    <svg ref={svgRef} onMouseMove={drawBarLine}>
      {Array.from(song.guitarStrings.values()).map((string, index) => (
        <GuitarStringComponent
          key={index}
          onClick={stringClicked}
          guitarString={string}
          beatPixels={pxPerBeat}
          offset={[0, staveOffset * index]}
        />
      ))}

      {selection && (
        <SelectionComponent
          x={selection.beat * pxPerBeat - 8 / 2}
          y={Array.from(song.guitarStrings.values()).indexOf(selection.string) *
            staveOffset -
            8 / 2}
        />
      )}

      {showBarLine && (
        <line
          data-testid="bar-line"
          x1={barLineX}
          x2={barLineX}
          y1={0}
          y2={staveHeight}
          stroke="black"
          strokeWidth="1"
        />
      )}
    </svg>
  );
};

export default SongComponent;
