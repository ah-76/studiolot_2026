import { SceneCopyPanel } from "./SceneCopyPanel";

export function HomeScene({ scene }) {
  return (
    <div className="content-container">
      <SceneCopyPanel section={scene.section} detailsHtml={scene.detailsHtml} />
      <img className="content-image" src={scene.mediaSrc} alt="" />
    </div>
  );
}
