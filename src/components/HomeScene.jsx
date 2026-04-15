import { SceneCopyPanel } from "./SceneCopyPanel";

export function HomeScene({ scene }) {
  return (
    <div className="scene scene--home">
      <SceneCopyPanel {...scene} />

      <section className="media-panel media-panel--hero">
        <div className="hero-visual">
          <img className="hero-visual__image" src={scene.asset} alt="StudioLot concept overview" />

          <div className="floating-card floating-card--upper">
            <p className="floating-card__label">InstantSync</p>
            <p className="floating-card__text">Share the exact creative moment, not just the file.</p>
          </div>

          <div className="floating-card floating-card--lower">
            <p className="floating-card__label">Creative Ops</p>
            <p className="floating-card__text">Cloud media, messaging, playback, and review in one atmospheric workspace.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
