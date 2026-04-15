import { CloudLibraryScene } from "./CloudLibraryScene";
import { HomeScene } from "./HomeScene";
import { MessagesScene } from "./MessagesScene";
import { OnlinePlayerScene } from "./OnlinePlayerScene";

export function StudioLotShell({ activeScene, scenes, onSceneChange }) {
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
      <header className="shell-header">
        <div className="shell-header__brand">
          <p className="shell-header__kicker">StudioLot / Concept Rebuild</p>
          <h1 className="shell-header__title">A cinematic collaboration floor for film and TV teams.</h1>
        </div>

        <div className="shell-header__status">
          <span className="shell-header__status-label">Active scene</span>
          <span className="shell-header__status-value">{activeScene.navLabel}</span>
        </div>
      </header>

      <main className="shell-stage" key={activeScene.id}>
        {renderScene()}
      </main>

      <nav className="shell-dock" aria-label="StudioLot sections">
        {scenes.map((scene) => (
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
    </div>
  );
}
