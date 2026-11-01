/* ——— NTU VENUES ———
   Approximate coordinates for places events are usually held. The events map
   matches an event's venue text against these aliases (lowercase substrings),
   so add aliases here when a venue doesn't get a pin. Nudge lat/lon if a pin
   looks off — the map is stylised, so a few metres either way is fine. */
const NTU_CENTRE = { lat: 1.3468, lon: 103.6830 };
const NTU_VENUES = [
  { key: 'north-spine', name: 'North Spine', lat: 1.3473, lon: 103.6800, aliases: ['north spine', 'student activities centre', 'sac', 'ocbc branch', 'koufu', 'one stop'] },
  { key: 'south-spine', name: 'South Spine', lat: 1.3426, lon: 103.6797, aliases: ['south spine', 'canteen b'] },
  { key: 'library', name: 'Lee Wee Nam Library', lat: 1.3479, lon: 103.6812, aliases: ['lee wee nam', 'lwn', 'library'] },
  { key: 'hive', name: 'The Hive', lat: 1.3432, lon: 103.6827, aliases: ['the hive', 'hive', 'learning hub'] },
  { key: 'arc', name: 'The Arc', lat: 1.3449, lon: 103.6837, aliases: ['the arc', 'arc'] },
  { key: 'auditorium', name: 'Nanyang Auditorium', lat: 1.3444, lon: 103.6808, aliases: ['nanyang auditorium', 'auditorium'] },
  { key: 'wcy-plaza', name: 'Wee Cho Yaw Plaza', lat: 1.3441, lon: 103.6815, aliases: ['wee cho yaw', 'wcy plaza', 'lt6'] },
  { key: 'admin', name: 'Administration Building', lat: 1.3443, lon: 103.6822, aliases: ['administration building', 'admin building'] },
  { key: 'adm', name: 'School of Art, Design and Media', lat: 1.3491, lon: 103.6788, aliases: ['school of art, design', 'adm'] },
  { key: 'spms', name: 'SPMS', lat: 1.3424, lon: 103.6810, aliases: ['spms', 'physical and mathematical'] },
  { key: 'gaia', name: 'Gaia (Nanyang Business School)', lat: 1.3417, lon: 103.6843, aliases: ['gaia', 'nanyang business school', 'nbs'] },
  { key: 'src', name: 'Sports & Recreation Centre', lat: 1.3512, lon: 103.6872, aliases: ['sports and recreation', 'sports & recreation', 'src', 'sports hall', 'stadium'] },
  { key: 'canteen-2', name: 'Canteen 2', lat: 1.3488, lon: 103.6857, aliases: ['canteen 2', 'canteen two'] },
  { key: 'chc', name: 'Chinese Heritage Centre', lat: 1.3441, lon: 103.6888, aliases: ['chinese heritage', 'chc'] },
  { key: 'yunnan', name: 'Yunnan Garden', lat: 1.3447, lon: 103.6875, aliases: ['yunnan garden'] },
  { key: 'nanyang-house', name: 'Nanyang House', lat: 1.3432, lon: 103.6868, aliases: ['nanyang house'] },
  { key: 'nch', name: 'Nanyang Crescent Halls', lat: 1.3547, lon: 103.6846, aliases: ['nanyang crescent', 'crescent hall', 'nch'] },
  { key: 'north-hill', name: 'North Hill', lat: 1.3540, lon: 103.6878, aliases: ['north hill'] },
  { key: 'pioneer', name: 'Pioneer & Crescent Halls', lat: 1.3536, lon: 103.6815, aliases: ['pioneer hall', 'pioneer'] },
];
