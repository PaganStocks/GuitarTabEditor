'use client';
import React, { MouseEvent, useState, useRef, useEffect, Fragment } from "react";
import { Piece, GuitarString, Note, StringName, PieceData, songToXml } from "@/model/note";
import GuitarStringComponent from "@/app/editor/GuitarString";
import SelectionComponent from "@/app/editor/SelectionComponent";
import Button from "./Button";
import Form from "./Form";

import style from "./SongComponent.module.css";

export enum SnapInterval {
    WHOLE,
    HALF,
    QUARTER,
}

type SongComponentProps = {
    /**
     * The song to display
     */
    song: PieceData;

    /**
     * The height of all staves
     * @default 100
     */
    staveHeight?: number;

    /**
     * The interval to snap to; this is the smallest note that can be placed
     * @default SnapInterval.HALF
     */
    snapInterval?: SnapInterval;

    /**
     * The number of beats per bar
     * @default 4
     */
    beatsPerBar?: number;

    /**
     * The number of beats to display
     * @default 10
     */
    beats?: number;
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

    throw new Error("Invalid keypress");
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
    beats = 10,
}: SongComponentProps) => {
    const [piece, setPiece] = useState(Piece.fromData(song));
    const staveOffset = staveHeight / 5;
    const svgRef = useRef<SVGSVGElement>(null);
    const [accessToken, setAccessToken] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [songName, setSongName] = useState("");

    const pxPerBeat = svgRef.current
        ? svgRef.current.clientWidth / (beatsPerBar * beats)
        : 0;

    const [barLineX, setBarLineX] = useState<number>(0);
    const [showBarLine, setShowBarLine] = useState<boolean>(false);
    const [selection, setSelection] = useState<Selection | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selection && isKeypressForFret(e)) {
                selection.string.addNote(new Note(pressedFret(e)), selection.beat);
                const string = selection.string;
                setPiece(piece.withString(string));
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
        const beat = (x / e.currentTarget.clientWidth) * (beatsPerBar * beats);

        // Snap to the nearest beat
        const snappedBeat = snapTo(beat);

        // Set the bar line x coordinate
        setBarLineX((snappedBeat / (beatsPerBar * beats)) * e.currentTarget.clientWidth);
    };

    const stringClicked = (string: GuitarString) => {
        const ind = Array.from(piece.guitarStrings.values()).indexOf(string);

        if (ind === -1) {
            throw new Error("String not found in song");
        }

        if (!svgRef.current) {
            return;
        }

        const beat = (barLineX / svgRef.current.clientWidth) * (beatsPerBar * beats);

        setSelection({
            beat,
            string,
        });
    };

    const stringNumberFromName = (name: StringName): number => {
        switch (name) {
            case StringName.E:
                return 0;
            case StringName.A:
                return 1;
            case StringName.D:
                return 2;
            case StringName.G:
                return 3;
            case StringName.B:
                return 4;
            case StringName.e:
                return 5;
        }
    };

    useEffect(() => {
        const getAccessToken = () => {
            const accessToken = fetch("/api/profile").then((res) => res.json());

            if (!accessToken) {
                throw new Error("No access token found");
            }
            return accessToken;
        };


        getAccessToken().then((accessToken) => {
            setAccessToken(accessToken.accessToken);
        });
    });

    async function postSong(url: string, data: string) {
        const headers = new Headers();
        headers.append("authorization", `Bearer ${accessToken}`);
        headers.append("Content-Type", "application/vnd.recordare.musicxml+xml;charset=UTF-8");
        const response = await fetch(url, {
            method: "POST",
            headers: headers,
            mode: "cors",
            body: data,
        });
        return response;
    }


    return (
        <Fragment>

            <div className={style.editorControls}>
                <h1>Song Editor</h1>

                <Form label="Author:" placeholder="Name" onChange={e => setAuthorName(e.target.value)} />
                <Form label="Song Name:" placeholder="Song" onChange={e => setSongName(e.target.value)} />

                <Button text="Save" onClick={() => postSong("http://localhost:8080/api/scores", songToXml(piece, songName, authorName)).then((data) => { })} />
            </div>
            <svg ref={svgRef} className={style.editor} width="1500px" onMouseMove={drawBarLine}>
                {Array.from(piece.guitarStrings.values()).map((string, index) => (
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
                        y={stringNumberFromName(selection.string.stringName) *
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
        </Fragment>
    );
};

export default SongComponent;
