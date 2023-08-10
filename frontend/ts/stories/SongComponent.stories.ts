import type { Meta, StoryObj } from '@storybook/react';

import SongComponent from '../component/SongComponent';
import { SnapInterval } from '../component/SongComponent';
import {Piece, StringName, parseNote} from '../model/note';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'Song',
  component: SongComponent,
  tags: ['autodocs'],
  argTypes: {
    song: Piece,
    snapInterval: SnapInterval,
  },
} satisfies Meta<typeof SongComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

const song = Piece.standardGuitar();
song.guitarStrings.get(StringName.D)?.addNote(parseNote("7t"), 2);
song.guitarStrings.get(StringName.E)?.addNote(parseNote("9"), 1.5);
song.guitarStrings.get(StringName.D)?.addNote(parseNote("10"), 3.5);
song.guitarStrings.get(StringName.D)?.addNote(parseNote("9"), 3);

export const Primary: Story = {
  args: {
    song: song,
  },
};
