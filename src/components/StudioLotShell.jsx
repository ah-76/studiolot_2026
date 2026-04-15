import { CloudLibraryScene } from "./CloudLibraryScene";
import { HomeScene } from "./HomeScene";
import { MessagesScene } from "./MessagesScene";
import { OnlinePlayerScene } from "./OnlinePlayerScene";

export function StudioLotShell({ activeScene, scenes, onSceneChange }) {
  const dockScenes = scenes.filter((scene) => scene.id !== "home");

  function renderScene() {
    switch (activeScene.id) {
      case "library":
        return <CloudLibraryScene scene={activeScene} />;
      case "player":
        return <OnlinePlayerScene scene={activeScene} isActive />;
      case "messages":
        return <MessagesScene scene={activeScene} />;
      case "home":
      default:
        return <HomeScene scene={activeScene} />;
    }
  }

  return (
    <div className="studiolot-shell">
      <main className={`shell-stage shell-stage--${activeScene.id}`} key={activeScene.id}>
        {renderScene()}
      </main>

      <footer className="shell-footer">
        <button
          type="button"
          className={`shell-brand ${activeScene.id === "home" ? "is-active" : ""}`}
          onClick={() => onSceneChange("home")}
        >
          STUDIOLOT
        </button>

        <nav className="shell-dock" aria-label="StudioLot sections">
          {dockScenes.map((scene) => (
            <button
              key={scene.id}
              type="button"
              className={`shell-dock__button ${scene.id === activeScene.id ? "is-active" : ""}`}
              onClick={() => onSceneChange(scene.id)}
            >
              <span className="shell-dock__glyph">{scene.glyph}</span>
              <span className="shell-dock__label">{scene.navLabel}</span>
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
}
