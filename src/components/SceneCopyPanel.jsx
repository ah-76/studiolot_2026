export function SceneCopyPanel({
  title,
  description,
}) {
  return (
    <section className="copy-panel">
      <h2 className="copy-panel__title">{title}</h2>
      <p className="copy-panel__description">{description}</p>
    </section>
  );
}
