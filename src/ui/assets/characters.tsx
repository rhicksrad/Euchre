import type { CharacterId } from '../../game/characters';

export const CharacterAvatar: Record<CharacterId, JSX.Element> = {
  hiker: placeholder('Hiker'),
  canoeist: placeholder('Canoeist'),
  ranger: placeholder('Ranger'),
  chef: placeholder('Chef'),
  flyfisher: placeholder('Fly-Fisher'),
  trailrunner: placeholder('Trail Runner'),
  birdwatcher: placeholder('Birdwatcher'),
  cartographer: placeholder('Cartographer'),
  guitarist: placeholder('Guitarist'),
  painter: placeholder('Painter'),
  stargazer: placeholder('Stargazer'),
  snowshoer: placeholder('Snowshoer'),
};

function placeholder(label: string) {
  return (
    <svg viewBox="0 0 128 128" className="h-16 w-16">
      <circle cx="64" cy="64" r="62" fill="#e5dccd" stroke="#1f4d2e" strokeWidth="4" />
      <text x="64" y="72" textAnchor="middle" fontSize="10" fill="#1f4d2e">{label}</text>
    </svg>
  );
}


