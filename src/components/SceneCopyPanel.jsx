export function SceneCopyPanel({ section, detailsHtml }) {
  return (
    <div className="centered-text">
      {section ? <span className="section-heading">{section}</span> : null}
      <span dangerouslySetInnerHTML={{ __html: detailsHtml }} />
    </div>
  );
}
