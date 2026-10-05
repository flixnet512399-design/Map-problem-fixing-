import { AcademyModule } from '../types';

export const ACADEMY_MODULES: AcademyModule[] = [
  {
    id: 1,
    title: 'Module 1: Map Design Fundamentals',
    subtitle: 'Scale, POI balance, drop vectors, and pacing',
    iconName: 'Compass',
    beginnerExplanation:
      'Battle royale level design is defined by player density and travel time. Unlike traditional arena shooters, a BR map must support 64 to 100 players spreading out across major compounds, looting for 2-5 minutes, and then rotating across varied terrain under the pressure of contracting zones.',
    stepByStepLesson: [
      'Determine Map Grid Scale: 8x8km (Erangel/Miramar style, slow tactical pacing), 4x4km (Sanhok/Vikendi, high action density), 2x2km (Karakin/Nusa, rapid CQC).',
      'Flight Path Coverage: Ensure major POIs are distributed within 1.5km of common diagonal and cardinal flight vectors so no player is forced into a dead zone.',
      'Loot Density Rule: Top-tier military zones should hold 20-30% of total map high-grade loot, with distributed minor compounds (3-4 buildings) every 300 meters for safe looting.',
      'Safe Zone Contraction Timing: Design travel corridors that a player can traverse on foot within the first phase zone closing timer (approx 5 minutes for 2km distance).',
    ],
    practicalTask:
      'Sketch an 8x8 grid on paper or Map Planner. Mark 4 major high-tier POIs diagonally, 8 secondary towns, and connect them with at least 2 distinct natural barriers (e.g. river or mountain range) traversed by bridges or mountain passes.',
    commonMistakes: [
      'Placing all high-tier loot in the dead center, making the edges of the map feel barren and ignored.',
      'Underestimating travel distance: creating steep cliffs that trap players when the circle pushes them.',
      'Over-cluttering with too many identical small compounds, diluting player encounters.',
    ],
    troubleshooting: [
      'If early playtests show 50% of the lobby dead within 90 seconds, space your hot drops further apart and increase loot value in perimeter towns.',
      'If mid-game feels completely empty, add intermediate landmarks (gas stations, ruined watchtowers, bridge outposts) along rotation paths.',
    ],
    quiz: {
      question: 'In a standard 8x8km Battle Royale map, what is the recommended spacing between small compound clusters along rotation routes?',
      options: [
        '50 meters (continuous city)',
        '250 to 350 meters (allowing sprint-cover pacing)',
        '1500 meters (vast barren plains)',
        '5000 meters (single central fortress)',
      ],
      correctIndex: 1,
      explanation: 'Spacing compounds 250-350m apart allows players to sprint between cover points within 30-40 seconds without being trapped in vast open death fields.',
    },
  },
  {
    id: 2,
    title: 'Module 2: Terrain and Landscape',
    subtitle: 'Heightmaps, erosion, ridges, and sightline control',
    iconName: 'Mountain',
    beginnerExplanation:
      'Landscape is not just a backdrop—it is the primary cover system in battle royale. Gentle rolling hills, natural gullies, and ridgelines allow players to maneuver safely even without man-made concrete walls.',
    stepByStepLesson: [
      'Heightmap Sculpting: Use hydraulic and thermal erosion filters (in World Machine, Gaea, or Unreal Engine Landscape brush) to produce natural drainage channels and gullies.',
      'Micro-Terrain Pacing: Never create completely flat plains. Maintain 1-2 meter micro-depressions and undulating berms every 40 meters to provide prone cover.',
      'Sightline Management: Break long 800m+ sniper lines using rolling ridges or staggered tree groves. If a hill provides an overlook, ensure it has multiple blind spots from behind.',
      'Slope Traversal Limits: Ensure pedestrian slopes do not exceed 35-40 degrees. Slopes above 45 degrees should visually indicate non-walkable rock cliffs with sheer vertical rock textures.',
    ],
    practicalTask:
      'In your terrain editor, sculpt a 500m valley flanked by two hills. Form at least 3 natural rock gullies leading down the slopes and carve a sunken dirt ditch through the center.',
    commonMistakes: [
      'Leaving giant flat table-top plateaus with steep drop-offs that trap players during zone shifts.',
      'Uniform slope angles that feel artificial and computer-generated.',
      'Using pure black heightmap values causing ocean holes or extreme vertex spikes.',
    ],
    troubleshooting: [
      'Texture Stretching on Slopes: Set up a World-Aligned (Triplanar) Blend material for rock cliffs so textures do not stretch on steep vertical faces.',
      'Player Sliding / Getting Stuck: Check landscape collision simplification settings and smooth jagged stepped polygons using the Smooth Landscape brush.',
    ],
    quiz: {
      question: 'What is the maximum slope angle recommended for walkable infantry routes before a player begins sliding or getting stuck?',
      options: ['15 degrees', '35 to 40 degrees', '75 degrees', '90 degrees (vertical walls)'],
      correctIndex: 1,
      explanation: 'Most game physics engines set walkable slope limit between 35° and 45°. Beyond 40°, players slip, causing frustrating movement stutters unless stepped.',
    },
  },
  {
    id: 3,
    title: 'Module 3: Roads and Pathways',
    subtitle: 'Spline roads, bridge bottlenecks, and vehicle handling',
    iconName: 'Route',
    beginnerExplanation:
      'Roads direct high-speed vehicular traffic and provide visual navigation across the landscape. Bridges act as the most dramatic choke points where ambush tactics and high-stakes shootouts happen.',
    stepByStepLesson: [
      'Spline Component Workflow: Use Landscape Splines to deform the terrain automatically beneath paved highways, creating flat roadbeds with banked curves.',
      'Road Hierarchy: Primary dual-lane asphalt roads connect major cities; secondary gravel roads lead to rural villages; tertiary dirt trails cut across hills.',
      'Roadside Cover: Place broken-down trucks, guard rails, hay bales, and ditch culverts along highways every 60-80 meters so stranded drivers have immediate cover.',
      'Bridge Architecture: Always include two pedestrian walkways, wrecked vehicle obstacles, and support girder ladders for underneath flanking maneuvers.',
    ],
    practicalTask:
      'Construct a 300-meter bridge spanning a river. Place at least 4 abandoned vehicle wrecks for cover, a roadblock barrier at one end, and underwater pillars with swim-up climbable rocks.',
    commonMistakes: [
      'Completely empty straight bridges that turn into unwinnable sniper slaughterhouses.',
      'Sharp 90-degree road kinks on steep hills that launch driving vehicles into orbit.',
      'Spline roads clipping through the landscape terrain causing vehicle wheel snagging.',
    ],
    troubleshooting: [
      'Vehicle Flipping on Road Seams: Lower spline point tension and enable "Raise / Lower Landscape to Spline" with a 1.5m falloff margin.',
      'Missing Road Collision: Verify that the road mesh asset has a simple box/convex collision mesh and is set to "BlockAllDynamic".',
    ],
    quiz: {
      question: 'Why are abandoned vehicles and concrete barriers placed on long bridges in PUBG-style maps?',
      options: [
        'Purely for decorative aesthetics',
        'To break direct sniper sightlines and create tactical flanking cover during bridge crossings',
        'To stop players from ever crossing the bridge',
        'To increase rendering polygon count',
      ],
      correctIndex: 1,
      explanation: 'Without roadside clutter and wrecks, bridges become impossible kill zones. Obstacles allow tactical bounding and counter-sniping.',
    },
  },
  {
    id: 4,
    title: 'Module 4: Buildings and Structures',
    subtitle: 'Modular kits, window heights, breach paths, and room flow',
    iconName: 'Building2',
    beginnerExplanation:
      'BR building design balances indoor combat clarity with outdoor siege gameplay. Buildings must have multiple entrances, clear sightlines, and predictable room layouts to avoid frustrating dead-ends.',
    stepByStepLesson: [
      'Modular Grid Dimensions: Standardize floor heights to 300cm or 350cm, doorways to 120cm width x 220cm height, and window sills to 90cm height (ideal for crouch-peeking and weapon mounting).',
      'The "Two Exits" Rule: Every building room and compound structure must possess at least two escape or breach routes (doors, breakable windows, or roof access).',
      'Stairwell Combat: Design stairs with 180-degree landings rather than endless spiral climbs, allowing defenders and attackers tactical grenade bounce opportunities.',
      'Roof Access Balance: If a roof is accessible, ensure surrounding buildings or high terrain possess sightline angles into it to prevent un-counterable rooftop camping.',
    ],
    practicalTask:
      'Design a two-story residential compound with a ground floor living/kitchen area, an exterior balcony, a garage with vehicle spawn, and an accessible flat roof reached via an external ladder.',
    commonMistakes: [
      'Window sills placed at 120cm height, blocking character crouch-aim and bullet trajectories.',
      'Dead-end rooms with no windows, creating frustrating camp corners with zero counterplay.',
      'Over-furnishing interiors with high-poly props that snag player collision and tank FPS.',
    ],
    troubleshooting: [
      'Camera Clipping through Walls: In your third-person spring-arm settings, enable probe testing and increase wall thickness collision margins.',
      'Players Jumping out of Windows Getting Stuck: Ensure window frame openings are at least 100cm wide and have their inner collision set to passable.',
    ],
    quiz: {
      question: 'What is the optimal window sill height for standard third-person/first-person shooter crouching weapon clearance?',
      options: ['40cm (shin height)', '85 to 90cm (crouch eye & barrel height)', '140cm (neck height)', '200cm (above head)'],
      correctIndex: 1,
      explanation: 'At 85-90cm, crouching players can peek over the sill, rest their weapon barrel, and aim down sights without bullets hitting invisible windowsill collision.',
    },
  },
  {
    id: 5,
    title: 'Module 5: Object Placement',
    subtitle: 'Hard vs soft cover, rock clusters, and prop performance',
    iconName: 'Box',
    beginnerExplanation:
      'Object placement transforms empty terrain into tactical battlefields. Effective level designers categorize cover into hard cover (bullets cannot penetrate, e.g. boulders, brick walls) and soft cover (visual concealment only, e.g. bushes, wheat fields).',
    stepByStepLesson: [
      'Cover Triangles: Position rock and tree clusters in triangular arrangements so a player under fire from one direction can peel behind an alternate face without exposing themselves.',
      'Berm and Ditch Integration: Pair man-made props (wooden fences, shipping containers) with natural ground depressions to maximize tactical utility.',
      'Instanced Static Meshes (ISM / HISM): Always group repeated outdoor props (fences, rocks, barrels) into instanced meshes to minimize CPU draw call overhead.',
      'Foliage Density Limits: Set foliage culling distance (start cull 100m, end cull 250m) so players cannot hide in bushes that disappear for distant snipers.',
    ],
    practicalTask:
      'Construct a tactical ambush outpost at a crossroads. Place 3 shipping containers, 2 concrete barrier rows, 4 large boulders, and a trench ditch. Test cover angles from 4 directions.',
    commonMistakes: [
      'Floating meshes where prop bottoms do not intersect into the landscape surface.',
      'Allowing bushes to render at 800m while players cull at 400m, causing distant snipers to shoot invisible targets or vice versa.',
      'Placing solitary trees in open fields with zero surrounding micro-cover.',
    ],
    troubleshooting: [
      'Floating Props After Landscape Sculpting: In Unreal Engine Landscape mode, use the "Snap to Landscape" shortcut (End key) to rest selected actors onto the terrain surface.',
      'FPS Drops Near Cluttered Towns: Merge small decorative static meshes (cups, boxes, papers) into single static actors or convert to Nanite/LOD meshes.',
    ],
    quiz: {
      question: 'What happens if grass and bush foliage cull distance is set too short (e.g. 50 meters) on a sniper hill?',
      options: [
        'The game crashes immediately',
        'Prone players believe they are concealed in tall grass, but distant snipers see them completely exposed against bare dirt',
        'Weapons deal double damage',
        'Textures turn pink',
      ],
      correctIndex: 1,
      explanation: 'This is the infamous foliage culling problem: if grass vanishes at 50m, a sniper 150m away sees the player lying in plain view on bare dirt.',
    },
  },
  {
    id: 6,
    title: 'Module 6: Gameplay Flow',
    subtitle: 'Hot drops, zone migration, pinch points, and pacing',
    iconName: 'Activity',
    beginnerExplanation:
      'Gameplay flow dictates how players navigate and interact over the 30-minute span of a match. A well-designed map provides distinct pacing: chaotic hot drops in early game, tense strategic rotations in mid-game, and tactical positional standoffs in late-game circles.',
    stepByStepLesson: [
      'Hot Drop Anatomy: High-density military bases or urban centers must offer high risk vs high reward: instant tier-3 loot, intense verticality, but extreme competition.',
      'Rotational Funnels: Guide players toward natural meeting grounds (valleys, bridges, hill gaps) while always providing at least one stealthy, longer perimeter detour.',
      'Phase 1 to Phase 5 Zone Dynamics: Ensure that no terrain in the playable bounds is completely inaccessible due to sheer cliffs when the blue zone starts shrinking.',
      'Third-Party Mitigation: Prevent high-ground locations from overlooking 3 or more separate POIs simultaneously, which creates oppressive 3rd-party sniping loops.',
    ],
    practicalTask:
      'Trace 3 different theoretical team paths from opposite edges of your map toward a central final circle. Identify at least two potential ambush locations and adjust sightlines to allow counter-play.',
    commonMistakes: [
      'Funneling entire lobbies into a single narrow canyon with zero alternate routes.',
      'Placing all vehicles only in major cities, leaving edge drops stranded without transport.',
      'Symmetric maps that lack unique geographical landmarks, causing disorientation.',
    ],
    troubleshooting: [
      'Players Complaining of Circle Deaths: Increase vehicle spawn density along perimeter coastal roads and flatten mountain pass bottlenecks.',
      'Stagnant Camp-Fests: Add smoke / visual cover opportunities and secondary flank stairwells to high-tier sniper compounds.',
    ],
    quiz: {
      question: 'Why should a high-ground mountain vantage point NOT overlook three adjacent major cities simultaneously?',
      options: [
        'It causes visual engine lag',
        'It allows a single camping squad to dominate multiple independent fights without taking any risk (oppressive third-partying)',
        'It makes the mountain too dark',
        'Vehicles cannot climb mountains',
      ],
      correctIndex: 1,
      explanation: 'Overpowered vantage points break fair play by allowing one squad to punish multiple distant battles with impunity.',
    },
  },
  {
    id: 7,
    title: 'Module 7: Spawn and Encounter Design',
    subtitle: 'Drop timing, compound loot tiers, and vehicle spawns',
    iconName: 'Crosshair',
    beginnerExplanation:
      'Where loot spawns and where vehicles are found determines the player distribution across the entire island. Thoughtful spawn design ensures every landing spot has viable gear for immediate survival.',
    stepByStepLesson: [
      'Loot Spot Hierarchy: Classify spawn points into Military Tier (level 3 armor, sniper rifles), Residential Tier (rifles, shotguns, level 1-2 armor), and Outpost Tier (handguns, basic meds).',
      'The "First 10 Seconds" Weapon Rule: Place a guaranteed weapon spawn within 5 meters of every primary building entrance or roof drop point.',
      'Vehicle Spawn Clustering: Concentrate vehicle spawns (cars, buggies, motorbikes) along primary paved highways and road intersections at 60-70% spawn probability.',
      'Watercraft & Boat Spawns: Place boats near river mouths and coastal docks to enable water rotations around bridge blockades.',
    ],
    practicalTask:
      'Create a loot table layout for a 5-building village: assign 12 primary weapon spawns, 18 medical/utility spawns, 2 vehicle garage spawns, and 1 guaranteed roadside buggy spawn.',
    commonMistakes: [
      'Allowing an entire multi-story building to spawn only pistol ammo and clothing props.',
      'Clustering all vehicles in one parking lot so one team steals all transport.',
      'Placing boat spawns in shallow water where hulls clip into underwater rocks.',
    ],
    troubleshooting: [
      'Loot Falling Through Floors: Set loot spawn marker Z-offset to at least +5cm above the floor mesh collision plane to prevent physics fall-through.',
      'Vehicle Spawning Upside Down: Check vehicle spawn transform orientation; ensure pitch and roll rotation are zeroed and aligned with the road surface normal.',
    ],
    quiz: {
      question: 'What is the "First 10 Seconds" rule in competitive Battle Royale building design?',
      options: [
        'Matches must finish in 10 seconds',
        'A player dropping into a building should locate a viable weapon within 5-10 seconds to defend against an immediate rush',
        'Doors take 10 seconds to open',
        'Loot only spawns 10 seconds after landing',
      ],
      correctIndex: 1,
      explanation: 'Nothing feels worse in a BR than landing on a roof, searching two entire rooms, finding only a smoke grenade, and being punched to death.',
    },
  },
  {
    id: 8,
    title: 'Module 8: Lighting and Environment',
    subtitle: 'Sun angles, atmospheric fog, dynamic shadows, and readability',
    iconName: 'Sun',
    beginnerExplanation:
      'Competitive shooter lighting must achieve aesthetic realism without sacrificing character visibility. Dark gloomy corners and blinding sun glare ruin competitive fairness if not carefully calibrated.',
    stepByStepLesson: [
      'Sun Angle and Orientation: Position the directional sun light at an angle of 35 to 55 degrees with low pitch to create elongated tactical shadows for spotting enemies over ridges.',
      'Exponential Height Fog: Use height fog to establish atmospheric depth and silhouette distant hills, but keep density below 0.02 to avoid obscuring mid-range firefights.',
      'Interior Ambient Fill: Balance interior exposure using Skylight or Lumen indirect bounce so players entering from bright sunlight do not encounter pitch-black interior rooms.',
      'Post-Process Color Grading: Maintain neutral, crisp color contrast with slight desaturation to ensure character models stand out against green grass and brown dirt.',
    ],
    practicalTask:
      'Set up a dynamic Day/Golden Hour lighting scenario in Unreal Engine or your map editor. Adjust Directional Light, SkyLight, Atmospheric Fog, and verify interior brightness inside a windowless garage.',
    commonMistakes: [
      'Pitch-black pitch corners inside buildings where dark skins are 100% invisible.',
      'Setting sun directly on the horizon, blinding any player looking in one cardinal direction.',
      'Heavy volumetric fog that drops frame rates by 30 FPS across the entire map.',
    ],
    troubleshooting: [
      'Black Interior Artifacts with Lumen: Increase Lumen Scene Detail or add an ambient cubemap / local fill light with low intensity (0.5 lux).',
      'Lightmap UV Overlapping Errors: Generate secondary UV channels (Channel 1) with non-overlapping islands and minimum 2-pixel padding at 64/128 resolution.',
    ],
    quiz: {
      question: 'Why is pitch-black interior lighting considered a severe flaw in competitive map design?',
      options: [
        'It saves too much battery life',
        'It enables unfair camouflage where dark player skins cannot be seen even at point-blank range',
        'The game engine refuses to compile',
        'It makes footsteps louder',
      ],
      correctIndex: 1,
      explanation: 'Competitive visual clarity requires adequate ambient bounce light so players can distinguish character silhouettes in any room.',
    },
  },
  {
    id: 9,
    title: 'Module 9: Performance Optimization',
    subtitle: 'Draw calls, Nanite, LODs, HLODs, occlusion culling, and memory',
    iconName: 'Gauge',
    beginnerExplanation:
      'An 8x8km map with thousands of buildings and millions of trees will crash modern PCs and consoles unless aggressive optimization pipelines are in place. Optimization is not an afterthought; it is built into every mesh.',
    stepByStepLesson: [
      'Draw Call Budget: Keep total draw calls under 2,000 to 3,000 per frame. Group repetitive props with Hierarchical Instanced Static Meshes (HISM).',
      'LOD (Level of Detail) Setup: Configure 4 LOD levels per building. LOD 0 (100% polys, 0-25m), LOD 1 (50% polys, 25-60m), LOD 2 (25% polys, 60-150m), LOD 3 (billboard/impostor, 150m+).',
      'HLOD (Hierarchical LOD): Merge entire city blocks and villages into single low-poly proxy meshes when viewed from 300+ meters away.',
      'Texture Streaming Pool: Limit 4K textures strictly to key hero assets. Use 1K-2K packed ORM (Occlusion/Roughness/Metallic) maps to stay under the 2GB streaming pool limit.',
    ],
    practicalTask:
      'Run the `stat rhi` and `stat scene-rendering` profiling commands in your editor. Identify the highest draw-call mesh in your city and configure auto-LOD generation with 50% polygon reduction.',
    commonMistakes: [
      'Importing raw 2-million polygon architectural CAD models with zero LODs.',
      'Using unique material shaders for every single wooden chair and barrel.',
      'Disabling occlusion culling, causing the engine to render the entire underground and back-facing city.',
    ],
    troubleshooting: [
      'Texture Streaming Pool Exceeded by XXX MB: In DefaultEngine.ini increase `r.Streaming.PoolSize=3000` or downsample bulky 4K textures to 2K.',
      'Massive Stutters When Scoping with 8x Scope: Enable HLOD baking and ensure distant mesh LODs have simplified collision and simplified materials.',
    ],
    quiz: {
      question: 'What is the primary function of HLOD (Hierarchical Level of Detail) in a large open-world map?',
      options: [
        'It increases the file size of the map',
        'It combines dozens of individual distant buildings into a single simplified mesh to dramatically cut CPU draw calls',
        'It makes water look more transparent',
        'It gives weapons faster reload speeds',
      ],
      correctIndex: 1,
      explanation: 'HLOD merges an entire distant village into a single draw call, preventing the CPU from choking when rendering 500 separate doors, walls, and roofs.',
    },
  },
  {
    id: 10,
    title: 'Module 10: Testing and Debugging',
    subtitle: 'Collision audits, stuck-spots, navmesh generation, and playtests',
    iconName: 'Bug',
    beginnerExplanation:
      'The difference between an amateur map and a professional level is rigorous QA testing. Players will test every rock seam, try to jump through every attic crawlspace, and wedge vehicles into every stairwell.',
    stepByStepLesson: [
      'Collision View Modes: Switch editor viewport to "Player Collision" wireframe mode. Confirm every walkable floor is cyan/green and walls have simple capsule/box blockers.',
      'The "Crouch-Jump Walkthrough": Walk every building interior, crouch under stairs, jump against corner angles, and verify players never get stuck in geometry.',
      'Vehicle Stress Testing: Drive high-speed vehicles over every bridge seam, road-to-dirt transition, and railroad crossing to verify smooth clearance.',
      'Blue Zone Simulation: Test zone speed and damage timers across the longest water channel to confirm players who manage their time can survive rotations.',
    ],
    practicalTask:
      'Create a formal bug tracker list. Perform a 15-minute sweep of a compound in Player Collision view, document 3 collision defects, and fix them in the mesh editor.',
    commonMistakes: [
      'Leaving complex collision as "Use Complex Collision as Simple" on high-poly meshes, which destroys physics performance.',
      'Invisible collision boxes left behind from deleted decorative props.',
      'Forgetting to build Navigation Mesh (RecastNavMesh) for test bots or audio occlusion.',
    ],
    troubleshooting: [
      'Player Falling Through World Geometry: Verify actor has "Enable Collision" checked, collision preset is "BlockAll" or "Pawn", and physics sub-stepping is enabled.',
      'Players Floating 10cm Above the Floor: Check if the collision box is offset above the visual mesh origin. Re-center simple collision in the Static Mesh Editor.',
    ],
    quiz: {
      question: 'Why should you avoid using "Use Complex Collision as Simple" for every static mesh in a 100-player map?',
      options: [
        'It makes character models turn invisible',
        'It forces the physics engine to calculate raycasts against every individual triangle, causing severe server and client CPU lag',
        'It disables weapon damage completely',
        'It deletes the textures from the level',
      ],
      correctIndex: 1,
      explanation: 'Complex collision calculates physics against tens of thousands of triangles. Simple primitive shapes (boxes, capsules, convex hulls) are dozens of times faster.',
    },
  },
  {
    id: 11,
    title: 'Module 11: Advanced Level Design',
    subtitle: 'Micro-terrain combat, sound propagation, verticality, and psycho-geography',
    iconName: 'Crown',
    beginnerExplanation:
      'Master-tier level design crafts psychological tension. By shaping acoustic sound corridors, designing vertical combat layers, and providing asymmetric compound layouts, you create unforgettable player stories.',
    stepByStepLesson: [
      'Acoustic Design & Audio Occlusion: Ensure concrete walls damp sound propagation by 70%, while wooden floors allow audible footsteps from the floor above to enable sound cues.',
      'Asymmetric King-of-the-Hill Compounds: Design compounds where the strongest fortress has a subtle tactical vulnerability (e.g. blind skylight, climbable exterior pipe, rear cliff vantage).',
      'Vertical Tiering: Incorporate 3 distinct combat layers: subterranean (drainage tunnels / bunkers), ground level (streets / yards), and elevated (rooftops / crane catwalks).',
      'Psycho-Geography & Readability: Use unique architectural color accents (e.g. "The Blue Building", "School Gym", "Water Tower") so teammates can make instantaneous callouts in the heat of combat.',
    ],
    practicalTask:
      'Design an asymmetric factory complex with a high catwalk crane, an underground drainage pipe exit, and a unique rusted silo landmark suitable for instant voice-chat callouts.',
    commonMistakes: [
      'Creating fortress compounds that are 100% impenetrable with only one narrow doorway, leading to boring stalemates.',
      'Ignoring footstep audio surfaces (making metal catwalks sound like dirt).',
      'Identical copy-pasted buildings throughout a 1km town with zero distinct callout landmarks.',
    ],
    troubleshooting: [
      'Audio Reverb Seams: Set up Audio Volume boundaries precisely inside building interior perimeters with crossfade margins.',
      'Unintended Climbing Exploits: Place invisible blocking volumes over extreme crane peaks or radio masts that give unfair view over the entire island.',
    ],
    quiz: {
      question: 'What is the level design term for distinct landmarks (like "Water Tower" or "Red Barn") that allow fast squad tactical callouts?',
      options: ['Poly-mesh anchors', 'Psycho-geographic readability / visual anchors', 'Occlusion portals', 'Skybox proxies'],
      correctIndex: 1,
      explanation: 'Visual anchors and high-contrast landmarks give players intuitive spatial orientation and enable instant verbal tactical coordination.',
    },
  },
];
