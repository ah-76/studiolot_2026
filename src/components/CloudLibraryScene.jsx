import { useState } from "react";
import {
  demoReferenceResults,
  searchSuggestions,
} from "../data/studiolotData";
import { SceneCopyPanel } from "./SceneCopyPanel";

function cleanTitle(title) {
  const asciiTitle = title.replace(/[^\x00-\x7F]/g, "").trim();
  return asciiTitle || title;
}

export function CloudLibraryScene({ scene }) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY?.trim();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState(
    apiKey
      ? "Search live YouTube references directly from the concept workspace."
      : "No API key detected. Curated fallback references are shown so the demo still reads clearly.",
  );

  const visibleResults = results.length > 0 ? results : demoReferenceResults;

  async function handleSearch(nextQuery = query) {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery) {
      setResults([]);
      setStatus("idle");
      setStatusMessage(
        apiKey
          ? "Try a film, sound, pacing, or design reference query."
          : "The search field is live-ready, but fallback references are showing until a key is configured.",
      );
      return;
    }

    if (!apiKey) {
      setResults([]);
      setStatus("missing-key");
      setStatusMessage(
        "VITE_YOUTUBE_API_KEY is not set. Keeping the scene demo-safe with curated reference cards.",
      );
      return;
    }

    setStatus("loading");
    setStatusMessage(`Searching YouTube for “${trimmedQuery}”…`);

    const requestUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    requestUrl.searchParams.set("part", "snippet");
    requestUrl.searchParams.set("type", "video");
    requestUrl.searchParams.set("order", "relevance");
    requestUrl.searchParams.set("maxResults", "4");
    requestUrl.searchParams.set("q", trimmedQuery);
    requestUrl.searchParams.set("key", apiKey);

    try {
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(`Search request failed with ${response.status}`);
      }

      const payload = await response.json();
      const items = payload.items ?? [];

      if (items.length === 0) {
        setResults([]);
        setStatus("empty");
        setStatusMessage("No live results matched that query. Try a broader creative reference search.");
        return;
      }

      const mappedResults = items
        .filter((item) => item.id?.videoId && item.snippet?.thumbnails?.medium?.url)
        .map((item) => ({
          id: item.id.videoId,
          title: cleanTitle(item.snippet.title),
          thumbnail: item.snippet.thumbnails.medium.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          source: "Live YouTube result",
        }));

      if (mappedResults.length === 0) {
        setResults([]);
        setStatus("empty");
        setStatusMessage(
          "The API returned items, but none were usable as video cards. Showing the curated board instead.",
        );
        return;
      }

      setResults(mappedResults);
      setStatus("ready");
      setStatusMessage(`Showing live references for “${trimmedQuery}”.`);
    } catch (error) {
      setResults([]);
      setStatus("error");
      setStatusMessage(
        "Live search hit a network or API issue. Keeping the board visually intact with curated fallback references.",
      );
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    handleSearch();
  }

  return (
    <div className="scene scene--library">
      <SceneCopyPanel {...scene} />

      <section className="search-workspace">
        <div className="search-workspace__art">
          <img src={scene.asset} alt="Cloud library concept art" />
          <div className="search-workspace__overlay-card">
            <p className="search-workspace__overlay-label">Live Reference Intake</p>
            <p className="search-workspace__overlay-text">
              Pull web inspiration into the workspace without leaving the demo.
            </p>
          </div>
        </div>

        <div className="search-panel">
          <div className="search-panel__header">
            <div>
              <p className="search-panel__kicker">Reference Search</p>
              <h3 className="search-panel__title">Import YouTube references.</h3>
            </div>
            <span className={`search-panel__status-pill search-panel__status-pill--${status}`}>
              {apiKey ? "Live mode" : "Fallback mode"}
            </span>
          </div>

          <form className="search-form" onSubmit={handleSubmit}>
            <input
              className="search-form__input"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="eg. dark moody title sequence references"
              spellCheck="false"
              autoComplete="off"
            />
            <button className="search-form__button" type="submit">
              Search
            </button>
          </form>

          <div className="search-suggestions">
            {searchSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="search-suggestions__chip"
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <p className={`search-panel__message search-panel__message--${status}`}>{statusMessage}</p>

          <div className="search-results">
            {visibleResults.slice(0, 4).map((result) => (
              <a
                key={result.id}
                className="search-card"
                href={result.url}
                target="_blank"
                rel="noreferrer"
              >
                <img className="search-card__image" src={result.thumbnail} alt={result.title} />
                <div className="search-card__body">
                  <p className="search-card__source">{result.source}</p>
                  <p className="search-card__title">{result.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
