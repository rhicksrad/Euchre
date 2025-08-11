export type CharacterId =
  | 'hiker' | 'canoeist' | 'ranger' | 'chef' | 'flyfisher' | 'trailrunner'
  | 'birdwatcher' | 'cartographer' | 'guitarist' | 'painter' | 'stargazer' | 'snowshoer';

export type CharacterDef = {
  id: CharacterId;
  name: string;
  bio: string;
};

export const CHARACTERS: readonly CharacterDef[] = [
  { id: 'hiker', name: 'The Hiker', bio: 'Boots laced, maps memorized.' },
  { id: 'canoeist', name: 'The Canoeist', bio: 'Calm waters, steady strokes.' },
  { id: 'ranger', name: 'The Ranger', bio: 'Keeper of trails and tales.' },
  { id: 'chef', name: 'The Lodge Chef', bio: 'Hot cocoa and hotter plays.' },
  { id: 'flyfisher', name: 'The Fly-Fisher', bio: 'Casting lines and counting cards.' },
  { id: 'trailrunner', name: 'The Trail Runner', bio: 'Fast feet, faster tricks.' },
  { id: 'birdwatcher', name: 'The Birdwatcher', bio: 'Eagle-eyed partner player.' },
  { id: 'cartographer', name: 'The Cartographer', bio: 'Draws maps, tracks suits.' },
  { id: 'guitarist', name: 'The Guitarist', bio: 'Campfire chords and confident calls.' },
  { id: 'painter', name: 'The Painter', bio: 'Brushstrokes and bold bids.' },
  { id: 'stargazer', name: 'The Stargazer', bio: 'Sees patterns in the night and the deck.' },
  { id: 'snowshoer', name: 'The Snowshoer', bio: 'Quiet steps, strong plays.' },
] as const;

export const CHAR_BY_ID: Readonly<Record<CharacterId, CharacterDef>> = Object.freeze(
  CHARACTERS.reduce((acc, c) => {
    (acc as Record<CharacterId, CharacterDef>)[c.id] = c;
    return acc;
  }, {} as Partial<Record<CharacterId, CharacterDef>>) as Record<CharacterId, CharacterDef>
);


