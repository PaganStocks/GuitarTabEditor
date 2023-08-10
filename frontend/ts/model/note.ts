export enum Modifier {
    HammerOn,
    PullOff,
    Vibrato,
    Muted,
    Ghost,
    NaturalHarmonic,
    Tap,
    PalmMute,
}

// Note represents a single note, denoted by a fret and a list of modifiers
export class Note {
    constructor(public fret: number, public modifiers?: Modifier[]) {
        if (fret < 0 || fret > 24) {
            throw new Error("Fret must be between 0 and 24");
        }
    }
}

// String represents a single string on a guitar
export class GuitarString {
    private beatsToNotes: Map<number, Note> = new Map<number, Note>();

    constructor(notes: [Note, number][], public stringName: StringName) {
        for (const note of notes) {
            this.beatsToNotes.set(note[1], note[0]);
        }
    }

    public addNote(note: Note, beat: number) {
        this.beatsToNotes.set(beat, note);
    }

    public notes(): Map<number, Note> {
        return Object.freeze(this.beatsToNotes);
    }
}

export enum StringName {
    E,
    A,
    D,
    G,
    B,
    e,
}

export class Piece {

    private strings: Map<StringName, GuitarString> = new Map<StringName, GuitarString>();

    // This assumes that the strings are in order from E to e
     constructor(strings: GuitarString[]) {
        if (strings.length != 6) {
            throw new Error("Piece must have 6 strings");
        }

        for (let i = 0; i < strings.length; i++) {
            const x: StringName = StringName[StringName[i]];
            this.strings.set(x, strings[i]);
        }
    }

    public static standardGuitar(): Piece {
        const strings: GuitarString[] = [];
        for (let i = 0; i < 6; i++) {
            strings.push(new GuitarString([], StringName[StringName[i]]));
        }

        return new Piece(strings);
    }

    
    public get guitarStrings(): Map<StringName, GuitarString> {
        return Object.freeze(this.strings);
    }
}

// parseNote is a function that accepts a tab string such as 7t and parses it into a Note object
// As of right now, it only accepts a modifier for a single note. Bends with releases for example are not supported.
export function parseNote(note: string): Note {
    let fretNum = "";
    for (const c of note) {
        if (!c.match(/[0-9]/)) {
            break;
        }

        fretNum += c;
    }

    if (fretNum.length == 0) {
        throw new Error("Invalid note");
    }

    const fret: number = parseInt(fretNum);

    const modifiers: Modifier[] = [];
    // We have one or more modifiers
    if (note.length > fretNum.length) {
        const index = fretNum.length;

        for (let i = index; i < note.length; i++) {
            const modifierChar = note[i];
            modifiers.push(parseModifier(modifierChar));
        }
    }

    return new Note(fret, modifiers);
}

function parseModifier(modifierChar: string): Modifier {
    switch (modifierChar) {
        case "h":
            return Modifier.HammerOn;
        case "p":
            return Modifier.PullOff;
        case "v":
            return Modifier.Vibrato;
        case "m":
            return Modifier.Muted;
        case "g":
            return Modifier.Ghost;
        case "n":
            return Modifier.NaturalHarmonic;
        case "t":
            return Modifier.Tap;
        case "x":
            return Modifier.PalmMute;
        default:
            throw new Error("Invalid modifier: " + modifierChar);
    }
}

export function stringToNumber(string: GuitarString): string {
    switch (string.stringName) {
        case StringName.E:  return "1";
        case StringName.A:  return "2";
        case StringName.D:  return "3";
        case StringName.G:  return "4";
        case StringName.B:  return "5";
        case StringName.e:  return "6";
        default: throw new Error("Invalid string name: " + string.stringName);
    }
}

export function numberToString(string: string): StringName {  
    switch (string) {
        case "1":  return StringName.E;
        case "2":  return StringName.A;
        case "3":  return StringName.D;
        case "4":  return StringName.G;
        case "5":  return StringName.B;
        case "6":  return StringName.e;
        default: throw new Error("Invalid string number: " + string);
    }  
}

export function noteToXml(note: Note, string: GuitarString): string {
    let xml = "<note>";
    xml += "<technical>";
    xml += "<string>" + stringToNumber(string) + "</string>";
    xml += "<fret>" + note.fret + "</fret>";
    xml += "</technical>";
    xml += "</note>";
    return xml;
}

export function songToXml(song: Piece): string {
    let xml = "<score-partwise version=\"3.1\">";
    xml += "<part-list>";
    xml += "<score-part id=\"P1\">";
    xml += "<part-name>Music</part-name>";
    xml += "</score-part>";
    xml += "</part-list>";
    xml += "<part id=\"P1\">";
    xml += "<measure number=\"1\">";
    xml += "<attributes>";
    xml += "<divisions>1</divisions>";
    xml += "<key>";
    xml += "<fifths>0</fifths>";
    xml += "</key>";
    xml += "<time>";
    xml += "<beats>4</beats>";
    xml += "<beat-type>4</beat-type>";
    xml += "</time>";
    xml += "<clef>";
    xml += "<sign>TAB</sign>";
    xml += "<line>5</line>";
    xml += "</clef>";
    xml += "</attributes>";

    for (const string of song.guitarStrings.values()) {
        const notes = string.notes();
        const maxKey = Math.max(...Array.from(notes.keys()));

        for (let i = 0; i < maxKey + 1; i=i+0.25) {
            if (notes.has(i)) {
                xml += noteToXml(notes.get(i), string);
            } else {
                xml += "<note><rest/><duration>1</duration></note>";
            }
        }
    }

    xml += "</measure>";
    xml += "</part>";
    xml += "</score-partwise>";
    return xml;
}


export function xmlToSong(xml: string): Piece {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    let beat = 0;

     const strings: GuitarString[] = [];
     for (let i = 1; i < 7; i++) {
         strings.push(new GuitarString([], numberToString(i.toString())));
     }

    const notes = xmlDoc.getElementsByTagName("note");
    for (const note of notes) {
        

        if (note.contains(note.getElementsByTagName("rest")[0])) {
            beat = beat + 0.25;
         } else {
            const technical = note.getElementsByTagName("technical")[0];
            const string = technical.getElementsByTagName("string")[0].innerHTML;
            const fret = technical.getElementsByTagName("fret")[0].innerHTML;
         
         
            const guitarString = strings[parseInt(string) - 1];
            
            const noteObj = new Note(
                parseInt(fret),
                [],
            );

            guitarString.addNote(
                noteObj,
                beat,
            );
            beat = beat + 0.25;
        }
        
        
    }

    return new Piece(strings);
}
