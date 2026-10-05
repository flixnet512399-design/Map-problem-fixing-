import { Project } from '../types';

export const DEFAULT_CHECKLIST = [
  { id: 'chk-1', label: 'Concept & Biome Theme defined', completed: true, category: 'Planning', tips: 'Decide map dimension, player density, and geographical biome.' },
  { id: 'chk-2', label: 'Terrain Heightmap & Erosion sculpted', completed: true, category: 'Terrain', tips: 'Establish valleys, hills, natural cover, and infantry-walkable slopes.' },
  { id: 'chk-3', label: 'Main Roads, Dirt Trails & Bridges connected', completed: true, category: 'Roads', tips: 'Deform terrain beneath roads and place roadside cover obstacles.' },
  { id: 'chk-4', label: 'Major High-Tier POIs & Cities placed', completed: true, category: 'POIs', tips: 'Distribute hot-drops diagonally to spread early-game player landings.' },
  { id: 'chk-5', label: 'Secondary Villages & Rural Compounds placed', completed: false, category: 'POIs', tips: 'Place small clusters every 250-350m along rotation routes.' },
  { id: 'chk-6', label: 'Sightlines & Death Valley Zones audited', completed: false, category: 'Flow', tips: 'Break 800m+ sniper fields with ridges, rock formations, and tree lines.' },
  { id: 'chk-7', label: 'Collision & Physics pass completed', completed: false, category: 'Testing', tips: 'Verify bridge decks, window sills, and rock meshes have simple collision.' },
  { id: 'chk-8', label: 'Interior Light Bounce & Lighting baked/tuned', completed: false, category: 'Lighting', tips: 'Eliminate pitch-black interior camp spots using ambient light bounce.' },
  { id: 'chk-9', label: 'Draw Calls, LODs & HLODs optimized', completed: false, category: 'Performance', tips: 'Convert repeated clutter to HISM and ensure town draw calls < 2,500.' },
  { id: 'chk-10', label: 'Vehicle & Loot Spawn tables calibrated', completed: false, category: 'Spawns', tips: 'Ensure guaranteed vehicle spawns along highways and immediate weapons in houses.' },
  { id: 'chk-11', label: 'Final Circle Simulations & Playtesting finished', completed: false, category: 'Review', tips: 'Confirm no late-game circle pushes players into sheer unclimbable cliffs.' },
];

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-miramar-revival',
    name: 'Oasis Mirage – 4x4 Desert Battleground',
    description: 'A rugged 4x4km desert canyon map featuring a central sunken oasis city, high limestone mesas, abandoned oil derricks, and intense ridge-to-ridge sniper battles with ample gully cover.',
    mapSize: '4x4km',
    theme: 'Arid Desert / Canyons',
    targetPlayers: 64,
    notes: `LEVEL DESIGN BIBLE:
1. Pacing Goal: Mid-tempo tactical combat with high vehicle mobility.
2. Central POI: "Al-Qasir Oasis" – a dense multi-tiered adobe town surrounding natural springs.
3. Choke Points: Two major suspension bridges over "Devil's Chasm" and three subterranean dry-river tunnels.
4. Cover Strategy: Abundant rock outcroppings, dry wash gullies, and rusted oil pipelines offering hard cover across open plains.`,
    checklist: DEFAULT_CHECKLIST,
    mapElements: [
      { id: 'el-1', name: 'Al-Qasir Oasis', type: 'town', x: 50, y: 50, width: 14, height: 14, lootTier: 'High', notes: 'Central hot-drop, high-density buildings with flat roofs.' },
      { id: 'el-2', name: 'Fortress Roca', type: 'military', x: 22, y: 28, width: 12, height: 12, lootTier: 'High', notes: 'Northwest military bunker with sniper towers.' },
      { id: 'el-3', name: 'Oil Refinery', type: 'military', x: 76, y: 32, width: 12, height: 12, lootTier: 'High', notes: 'Industrial complex with shipping containers and catwalks.' },
      { id: 'el-4', name: 'Sunken Village', type: 'compound', x: 30, y: 72, width: 9, height: 9, lootTier: 'Medium', notes: 'Ruined mudbrick homes in a dried-up riverbed.' },
      { id: 'el-5', name: 'Chasm Bridge North', type: 'bridge', x: 42, y: 38, width: 10, height: 4, notes: 'Double-deck bridge with abandoned trucks for cover.' },
      { id: 'el-6', name: 'Devil Canyon Ridge', type: 'hill', x: 65, y: 68, width: 15, height: 8, notes: 'Limestone ridge overlooking southeast rotation corridor.' },
      { id: 'el-7', name: 'Highway Route 1', type: 'road', x: 18, y: 50, width: 64, height: 3, notes: 'Main paved horizontal arterial highway.' },
      { id: 'el-8', name: 'Southern Gas Station', type: 'vehicle', x: 52, y: 84, width: 6, height: 6, notes: 'Guaranteed buggy and pickup truck spawns.' },
    ],
    savedProblems: [
      {
        id: 'sp-1',
        problem: 'Sand texture was stretching on the steep limestone mesa cliffs.',
        solution: 'Implemented World-Aligned triplanar blending on the Landscape Material rock layer with 1024 vector size.',
        date: '2026-10-02',
      },
      {
        id: 'sp-2',
        problem: 'Draw calls exceeded 4,500 in Al-Qasir town center.',
        solution: 'Converted 120 wooden crates and adobe wall props into Hierarchical Instanced Static Meshes (HISM), reducing draw calls to 1,950.',
        date: '2026-10-03',
      },
    ],
    savedTutorials: [
      {
        id: 'st-1',
        title: 'Unreal Engine 5 Desert Landscape & Triplanar Rock Materials',
        url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/landscape-materials',
        date: '2026-10-02',
      },
    ],
    createdAt: '2026-10-01T10:00:00.000Z',
    updatedAt: '2026-10-04T18:30:00.000Z',
  },
];
