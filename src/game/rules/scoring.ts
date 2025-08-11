export type HandResult = {
  makersWonTricks: number;
  defendersWonTricks: number;
  makersWentAlone: boolean;
};

export type HandPoints = {
  makers: number;
  defenders: number;
};

export function scoreHand(result: HandResult): HandPoints {
  const { makersWonTricks, defendersWonTricks, makersWentAlone } = result;
  if (makersWonTricks >= 5) {
    return { makers: makersWentAlone ? 4 : 2, defenders: 0 };
  }
  if (makersWonTricks >= 3) {
    return { makers: 1, defenders: 0 };
  }
  // defenders euchre makers
  if (defendersWonTricks >= 3) {
    return { makers: 0, defenders: 2 };
  }
  throw new Error('Invalid trick totals');
}


