import { CloudLibraryScene } from "./CloudLibraryScene";
import { HomeScene } from "./HomeScene";
import { MessagesScene } from "./MessagesScene";
import { OnlinePlayerScene } from "./OnlinePlayerScene";
import { footerItems } from "../data/studiolotData";

export function StudioLotShell({
  activeScene,
  isFooterVisible,
  isMainVisible,
  mainTransitionMs,
  onSceneChange,
}) {
  function renderScene() {
    switch (activeScene.id) {
      case "library":
        return <CloudLibraryScene scene={activeScene} />;
      case "player":
        return <OnlinePlayerScene scene={activeScene} isActive={isMainVisible} />;
      case "messages":
        return <MessagesScene scene={activeScene} />;
      case "home":
      default:
        return <HomeScene scene={activeScene} />;
    }
  }

  return (
    <div className="container">
      <main
        className="main"
        style={{
          opacity: isMainVisible ? 1 : 0,
          transition: `opacity ${mainTransitionMs}ms ease-in-out`,
        }}
      >
        {renderScene()}
      </main>

      <footer className="footer">
        <div className={`footer-elements ${isFooterVisible ? "is-visible" : ""}`}>
          <button
            type="button"
            className="title-button"
            onClick={() => onSceneChange("home")}
            aria-label="StudioLot home"
          >
            <div className="title">STUDIOLOT</div>
          </button>

          {footerItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="icon-button"
              onClick={() => onSceneChange(item.id)}
              aria-label={item.tooltip}
            >
              <span className="material-symbols-rounded">{item.icon}</span>
              <div className="tooltip-text">{item.tooltip}</div>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
