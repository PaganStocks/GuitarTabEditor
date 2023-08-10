import {expect, test} from '@jest/globals'; 

import { Modifier, parseNote, Note, noteToXml, stringToNumber, StringName, GuitarString, Piece, songToXml, xmlToSong } from '../note';


test("parseNote should parse a note string with modifiers correctly", () => {
    const noteString = "12hpgvmtxn";
    const expectedNote = new Note(
        12,
        [
            Modifier.HammerOn,
            Modifier.PullOff,
            Modifier.Ghost,
            Modifier.Vibrato,
            Modifier.Muted,
            Modifier.Tap,
            Modifier.PalmMute,
            Modifier.NaturalHarmonic,
        ],
    );

    const parsedNote = parseNote(noteString);

    expect(parsedNote).toEqual(expectedNote);
}); 

test("noteToXml should convert a note to xml correctly", () => {
    const note = new Note(
        12,
        [
            Modifier.HammerOn,
            Modifier.Tap,
            Modifier.PalmMute,
            Modifier.NaturalHarmonic,
        ],
    );
    
    const guitarString = new GuitarString([[note, 4]], StringName.D);
    const stringNo = stringToNumber(guitarString);

    const xml = noteToXml(note, guitarString);

    expect(xml).toEqual("<note><technical><string>3</string><fret>12</fret></technical></note>");
});

test("songToXml should convert a song to xml correctly", () => {
    const song = Piece.standardGuitar();
    song.guitarStrings.get(StringName.E)?.addNote(
        new Note(
            12,
            [
                Modifier.HammerOn,
                Modifier.Tap,
                Modifier.PalmMute,
                Modifier.NaturalHarmonic,
            ],
        ),
        6,
    );
    song.guitarStrings.get(StringName.E)?.addNote(
        new Note(
            5,
            [
                Modifier.HammerOn,
                Modifier.Tap,
                Modifier.PalmMute,
                Modifier.NaturalHarmonic,
            ],
        ),
        4,
    );

    const xml = songToXml(song);

    expect(xml).toEqual("<score-partwise version=\"3.1\">" +
        "<part-list>" +
        "<score-part id=\"P1\">" +
        "<part-name>Music</part-name>" +
        "</score-part>" +
        "</part-list>" +
        "<part id=\"P1\">" +
        "<measure number=\"1\">" +
        "<attributes>" +
        "<divisions>1</divisions>" +
        "<key>" +
        "<fifths>0</fifths>" +
        "</key>" +
        "<time>" +
        "<beats>4</beats>" +
        "<beat-type>4</beat-type>" +
        "</time>" +
        "<clef>" +
        "<sign>TAB</sign>" +
        "<line>5</line>" +
        "</clef>" +
        "</attributes>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><technical><string>1</string><fret>5</fret></technical></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><technical><string>1</string><fret>12</fret></technical></note>"+
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "</measure>" +
        "</part>" +
        "</score-partwise>",
    );
});

test("xmlToSong should convert xml to a song correctly", () => {
    const xml = "<score-partwise version =\"3.1\">" +
        "<part-list>" +
        "<score-part id=\"P1\">" +
        "<part-name>Music</part-name>" +
        "</score-part>" +
        "</part-list>" +
        "<part id=\"P1\">" +
        "<measure number=\"1\">" +
        "<attributes>" +
        "<divisions>1</divisions>" +
        "<key>" +
        "<fifths>0</fifths>" +
        "</key>" +
        "<time>" +
        "<beats>4</beats>" +
        "<beat-type>4</beat-type>" +
        "</time>" +
        "<clef>" +
        "<sign>TAB</sign>" +
        "<line>5</line>" +
        "</clef>" +
        "</attributes>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><technical><string>1</string><fret>5</fret></technical></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><technical><string>1</string><fret>12</fret></technical></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "<note><rest/><duration>1</duration></note>" +
        "</measure>" +
        "</part>" +
        "</score-partwise>";

    const song = Piece.standardGuitar();
    song.guitarStrings.get(StringName.E)?.addNote(
        new Note(
            5,
            [],
        ),
        4,
    );
    song.guitarStrings.get(StringName.E)?.addNote(
        new Note(
            12,
            [],
        ),
        6,
    );

    const parsedSong = xmlToSong(xml);

    expect(parsedSong).toEqual(song);
});