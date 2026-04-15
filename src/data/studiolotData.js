export const AMBIENT_CUE_SECONDS = 270;

export const sceneList = [
  {
    id: "home",
    glyph: "00",
    navLabel: "StudioLot",
    eyebrow: "Integrated real-time creative collaboration",
    title: "STUDIOLOT",
    description:
      "One intuitive platform for artists working across film and television. Shared cloud media, direct messaging, InstantSync review moments, searchable references, and clear creative context in one place.",
    features: [
      "Central cloud media files with creative tags and share permissions",
      "Frame-aware review with comments stored to exact moments",
      "Direct communication, notifications, and project visibility",
    ],
    footerNote: "Still a concept demo, now reframed as a cleaner product story.",
    asset: "/assets/image1.png",
    backdrop: "/assets/image1.png",
    accent: "sage",
  },
  {
    id: "library",
    glyph: "01",
    navLabel: "Cloud Library",
    eyebrow: "Reference import and discovery",
    title: "Cloud Library",
    description:
      "Upload sound, video, music, image, and text. Organize with relational tags, team permissions, searchable metadata, and web reference intake that supports the creative process instead of interrupting it.",
    features: [
      "Fast reference intake from the web",
      "Creative tagging and filter-ready structure",
      "Team-wide visibility with project-aware context",
    ],
    footerNote: "Live YouTube search stays in the demo, but the API key now belongs in environment config.",
    asset: "/assets/image4.png",
    backdrop: "/assets/image4.png",
    accent: "brass",
  },
  {
    id: "player",
    glyph: "02",
    navLabel: "Online Player",
    eyebrow: "InstantSync review and playback",
    title: "Online Player",
    description:
      "Play, pause, locate, comment, and share a review state instantly. The player is still demo-scale, but it preserves the original idea: creative decisions anchored to media timelines and shareable as a moment, not just a file.",
    features: [
      "Timeline markers and cue-based comment surfacing",
      "Independent dialogue and music control",
      "Shareable InstantSync modal with labeled creative notes",
    ],
    footerNote: "This scene carries the most legacy behavior and should remain the fidelity anchor for the redesign.",
    asset: "/assets/examplevideo.mp4",
    backdrop: "/assets/image3.png",
    accent: "sage",
  },
  {
    id: "messages",
    glyph: "03",
    navLabel: "Messages",
    eyebrow: "Notifications and communication",
    title: "Messages & Notifications",
    description:
      "Private or group threads tied to real creative work. Media uploads, InstantSync shares, review requests, and project updates all stay connected to the content they refer to.",
    features: [
      "Context-rich media conversations",
      "Upload and review notifications in one stream",
      "A team dashboard feel without losing creative warmth",
    ],
    footerNote: "The concept remains communication around the work, not disconnected chat for its own sake.",
    asset: "/assets/image2.png",
    backdrop: "/assets/image2.png",
    accent: "brass",
  },
];

export const playerMarkers = [
  {
    id: "grade",
    time: 100,
    label: "1 Grade",
    comment: "Love the color grade.",
  },
  {
    id: "music",
    time: 270,
    label: "2 Music",
    comment: "Music in here. Agree?",
  },
  {
    id: "boat",
    time: 460,
    label: "3 Boat",
    comment: "The boat should be blue.",
  },
];

export const shareTargets = [
  "Editor",
  "Composer",
  "Sound Designer",
];

export const searchSuggestions = [
  "cinematic river scene sound design",
  "film editor workflow",
  "dark moody title sequence references",
  "boat sequence music cues",
];

export const demoReferenceResults = [
  {
    id: "demo-1",
    title: "Cinematic river sequence references",
    thumbnail: "/assets/image3.png",
    url: "https://www.youtube.com/results?search_query=cinematic+river+sequence+references",
    source: "Curated fallback",
  },
  {
    id: "demo-2",
    title: "Editorial pacing and mood montage inspiration",
    thumbnail: "/assets/image4.png",
    url: "https://www.youtube.com/results?search_query=editorial+pacing+mood+montage",
    source: "Curated fallback",
  },
  {
    id: "demo-3",
    title: "Production design and palette reference search",
    thumbnail: "/assets/image1.png",
    url: "https://www.youtube.com/results?search_query=production+design+palette+reference",
    source: "Curated fallback",
  },
  {
    id: "demo-4",
    title: "Ambient score and dialogue balance examples",
    thumbnail: "/assets/image2.png",
    url: "https://www.youtube.com/results?search_query=ambient+score+dialogue+balance",
    source: "Curated fallback",
  },
];

export const messageThreads = [
  {
    id: "thread-1",
    title: "Editor",
    timestamp: "17:42",
    message: "InstantSync #153 feels ready for the next pass. The grade note lands well.",
  },
  {
    id: "thread-2",
    title: "Composer",
    timestamp: "17:18",
    message: "If the river cue starts earlier, I can build a gentler lead-in under the boat beat.",
  },
  {
    id: "thread-3",
    title: "Production",
    timestamp: "16:50",
    message: "New stills uploaded to the board. Tagging them against the same sequence.",
  },
];

export const notificationFeed = [
  "InstantSync #153 shared with Editor and Composer",
  "Boat sequence video uploaded to Cloud Library",
  "Three new comments added to Online Player markers",
  "Reference search saved to project inspiration board",
];
