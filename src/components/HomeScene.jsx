import { SceneCopyPanel } from "./SceneCopyPanel";

export function HomeScene({ scene }) {
  return (
    <div className="scene scene--single scene--home">
      <SceneCopyPanel {...scene} />
    </div>
  );
}
