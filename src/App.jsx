import { useState } from "react";
import { StudioLotShell } from "./components/StudioLotShell";
import { sceneList } from "./data/studiolotData";

const sceneMap = Object.fromEntries(sceneList.map((scene) => [scene.id, scene]));

export default function App() {
  const [activeSceneId, setActiveSceneId] = useState("home");

  const activeScene = sceneMap[activeSceneId] ?? sceneMap.home;

  return (
    <div
      className="app-shell"
      style={{ "--scene-backdrop": `url(${activeScene.backdrop})` }}
    >
      <StudioLotShell
        activeScene={activeScene}
        scenes={sceneList}
        onSceneChange={setActiveSceneId}
      />
    </div>
  );
}
