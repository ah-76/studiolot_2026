import { useEffect, useMemo, useRef, useState } from "react";
import { StudioLotShell } from "./components/StudioLotShell";
import { sceneList } from "./data/studiolotData";

const sceneMap = Object.fromEntries(sceneList.map((scene) => [scene.id, scene]));

export default function App() {
  const [displaySceneId, setDisplaySceneId] = useState("home");
  const [isMainVisible, setIsMainVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [transitionMs, setTransitionMs] = useState(2000);
  const timeoutRef = useRef(null);

  const activeScene = useMemo(
    () => sceneMap[displaySceneId] ?? sceneMap.home,
    [displaySceneId],
  );

  useEffect(() => {
    const footerTimer = window.setTimeout(() => {
      setIsFooterVisible(true);
    }, 100);

    const mainTimer = window.setTimeout(() => {
      setIsMainVisible(true);
    }, 0);

    return () => {
      window.clearTimeout(footerTimer);
      window.clearTimeout(mainTimer);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleSceneChange(nextSceneId) {
    if (nextSceneId === displaySceneId) {
      return;
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    setTransitionMs(1000);
    setIsMainVisible(false);

    timeoutRef.current = window.setTimeout(() => {
      setDisplaySceneId(nextSceneId);

      window.requestAnimationFrame(() => {
        setIsMainVisible(true);
      });
    }, 1000);
  }

  return (
    <StudioLotShell
      activeScene={activeScene}
      isFooterVisible={isFooterVisible}
      isMainVisible={isMainVisible}
      mainTransitionMs={transitionMs}
      onSceneChange={handleSceneChange}
    />
  );
}
