export function SceneCopyPanel({
  eyebrow,
  title,
  description,
  features,
  footerNote,
}) {
  return (
    <section className="copy-panel">
      <p className="copy-panel__eyebrow">{eyebrow}</p>
      <h2 className="copy-panel__title">{title}</h2>
      <p className="copy-panel__description">{description}</p>

      <div className="copy-panel__features">
        {features.map((feature) => (
          <div className="copy-feature" key={feature}>
            <span className="copy-feature__line" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <p className="copy-panel__note">{footerNote}</p>
    </section>
  );
}
