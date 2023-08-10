import SongComponent from "./component/SongComponent";
import React from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from '@auth0/auth0-react';

import { Piece } from "./model/note";

const song: Piece = Piece.standardGuitar();

const root = createRoot(
  document.getElementById("staveContainer")
)

root.render(
  <Auth0Provider
    domain="dev-an5ttq516gzjcpox.eu.auth0.com"
    clientId="cIXxXPDLF6BiC1G7oX3wbqcxIkOmssuG"
    authorizationParams={{
      redirect_uri: "http://localhost:8080/login/oauth2/code/auth0",
      audience: "https://dev-an5ttq516gzjcpox.eu.auth0.com/api/v2/",
      scope: "profile email openid"
    }}>
    <SongComponent song={song} />
  </Auth0Provider>
)
