'use client';
import React, { Fragment, use, useEffect, useState } from "react";
import Form from "../editor/Form";
import { Piece, songToXml, xmlToSong } from "@/model/note";
import { xmlToSongName, xmlToAuthorName } from "@/model/note";
import SongList from "./arrayToHtmlList";

type SongListComponentProps = {
    // songList: string[];
};

type Song = {
    id: string;
    authorName: string;
    songName: string;
};

const SongListComponent: React.FC<SongListComponentProps> = ({}) => {
    const [displayName, setDisplayName] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [songs, setSongs] = useState<Array<Song>>([]);


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
    }, []);

    

    useEffect(() => {
        async function getSongs(url: string) {
            const headers = new Headers();
            headers.append("authorization", `Bearer ${accessToken}`);
            headers.append("Content-Type", "application/vnd.recordare.musicxml+xml;charset=UTF-8");
            const response = await fetch(url, {
                method: "GET",
                headers: headers,
                mode: "cors",

            });
            const json = await response.json();
            return json;
        }

        if (accessToken !== "") {
            getSongs("http://localhost:8080/api/scores").then((res) => {
                let newSongs: Array<Song> = [];
                for (const song in res.scores) {
                    newSongs.push({ id: song, authorName: xmlToAuthorName(res.scores[song]), songName: xmlToSongName(res.scores[song]) });
                }

                setSongs(newSongs);
            });
            
        }
    
        
    }, [accessToken]);
    
    return (
        <Fragment>
            <img src="" alt="ProfilePic" />
            <Form label="Display Name:" placeholder="Name" onChange={e => setDisplayName(e.target.value)} />
                
            <SongList listOfSongs={songs}/>
      
        </Fragment>
    );
}

export default SongListComponent;