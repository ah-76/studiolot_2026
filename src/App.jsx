import { useState } from "react";
import { StudioLotShell } from "./components/StudioLotShell";
import { sceneList } from "./data/studiolotData";

const sceneMap = Object.fromEntries(sceneList.map((scene) => [scene.id, scene]));

export default function App() {
  const [activeSceneId, setActiveSceneId] = useState("home");

  return (
    <div className="app-shell">
      <StudioLotShell
        activeScene={sceneMap[activeSceneId] ?? sceneMap.home}
        scenes={sceneList}
        onSceneChange={setActiveSceneId}
      />
    </div>
  );
}
