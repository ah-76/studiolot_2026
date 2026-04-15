import { SceneCopyPanel } from "./SceneCopyPanel";

export function MessagesScene({ scene }) {
  return (
    <div className="content-container">
      <SceneCopyPanel section={scene.section} detailsHtml={scene.detailsHtml} />
      <img className="content-image" src={scene.mediaSrc} alt="" />
    </div>
  );
}
