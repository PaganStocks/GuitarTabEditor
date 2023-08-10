import React from "react";
import { render, act } from "@testing-library/react";
import SongComponent from "../SongComponent";
import "@testing-library/jest-dom";
import { Piece } from "../../model/note";
import { test, describe } from "@jest/globals";

describe("SongComponent", () => {
  test("renders a song", () => {
    const song: Piece = Piece.standardGuitar();
    render(<SongComponent song={song} />);
  });
});
