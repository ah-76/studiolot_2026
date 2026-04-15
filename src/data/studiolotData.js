export const AMBIENT_CUE_SECONDS = 270;

export const sceneList = [
  {
    id: "home",
    navLabel: "StudioLot",
    title: "STUDIOLOT",
    description:
      "Shared media, synced review, reference search, and team messaging for film and TV.",
  },
  {
    id: "library",
    navLabel: "Cloud Library",
    title: "Cloud Library",
    description: "Search references and collect media in one place.",
  },
  {
    id: "player",
    navLabel: "Online Player",
    title: "Online Player",
    description: "Play, cue, comment, and share exact moments.",
    asset: "/assets/examplevideo.mp4",
  },
  {
    id: "messages",
    navLabel: "Messages",
    title: "Messages",
    description: "Threads and notifications tied to the work.",
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

export const demoReferenceResults = [
  {
    id: "demo-1",
    title: "Cinematic river sequence references",
    url: "https://www.youtube.com/results?search_query=cinematic+river+sequence+references",
  },
  {
    id: "demo-2",
    title: "Editorial pacing and mood montage inspiration",
    url: "https://www.youtube.com/results?search_query=editorial+pacing+mood+montage",
  },
  {
    id: "demo-3",
    title: "Production design and palette reference search",
    url: "https://www.youtube.com/results?search_query=production+design+palette+reference",
  },
  {
    id: "demo-4",
    title: "Ambient score and dialogue balance examples",
    url: "https://www.youtube.com/results?search_query=ambient+score+dialogue+balance",
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
