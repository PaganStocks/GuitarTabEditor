import { PieceData } from "@/model/note";
import SongListComponent from "./songListComponent";
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

export default function Home() {

  

  return (
    <div className="main">
      <h1>Profile</h1>
      <SongListComponent />
    </div>

  );
}
