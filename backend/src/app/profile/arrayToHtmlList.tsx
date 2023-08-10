'use client';
import Link from "next/link";
import React from "react";

type SongListProps = {
    listOfSongs: Array<{ id: string, authorName: string, songName: string }>;
}

const SongList: React.FC<SongListProps> = ({ listOfSongs }) => {
    return (
        <ul>
            {listOfSongs.map((song) => (
                <li key={song.id}>
                    <Link href={`/editor?song=${song.id}`}>{song.songName} By {song.authorName}</Link>
                </li >
            ))}
        </ul>
    )

}
export default SongList;