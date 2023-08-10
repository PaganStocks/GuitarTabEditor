import { PieceData, songToData, songToXml, xmlToAuthorName, xmlToSong, xmlToSongName } from "@/model/note";
import SongComponent from "./SongComponent";
import { getAccessToken, withPageAuthRequired } from '@auth0/nextjs-auth0';

async function getPieceOrDefault(
    songId: string | undefined, 
    accessToken: string | undefined): Promise<PieceData> {
    if (songId === undefined || accessToken === undefined) {
        return {
            "E": [],
            "A": [],
            "D": [],
            "G": [],
            "B": [],
            "e": [],
        };
    }

    const xmlsong = await getMusicXml(songId, accessToken);
    const loadedSong = xmlToSong(xmlsong);

    return songToData(loadedSong);
}

async function getMusicXml(songId: string, accessToken: string): Promise<string> {
    const xmlsong = await fetch(`http://localhost:8080/api/score/${songId}`, {
        method: "GET",
        headers: {
            "Accept": "application/vnd.recordare.musicxml+xml;charset=UTF-8",
            "Authorization": `Bearer ${accessToken}`,
        },
    });

    if (!xmlsong) {
        throw new Error("No xml song found");
    }
    return await xmlsong.text();
}

export default withPageAuthRequired(async function Editor({ searchParams }: {
    searchParams?: { [key: string]: string | string[] | undefined } | undefined,
}) {
    const accessToken = (await getAccessToken()).accessToken;
    const songId = searchParams?.song as string | undefined;

    const pieceToData = await getPieceOrDefault(songId, accessToken);
    console.log(pieceToData);

    return (
        <main>

            <SongComponent song={pieceToData}/>
        </main>
    );
}, { returnTo: '/editor' });