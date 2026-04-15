import { useState } from "react";
import { demoReferenceResults } from "../data/studiolotData";
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
  const [statusMessage, setStatusMessage] = useState("");

  const visibleResults = results.length > 0 ? results : demoReferenceResults;

  async function handleSearch(nextQuery = query) {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery) {
      setResults([]);
      setStatus("idle");
      setStatusMessage("");
      return;
    }

    if (!apiKey) {
      setResults([]);
      setStatus("missing-key");
      setStatusMessage("VITE_YOUTUBE_API_KEY is not set.");
      return;
    }

    setStatus("loading");
    setStatusMessage("Searching...");

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
        setStatusMessage("No results found.");
        return;
      }

      const mappedResults = items
        .filter((item) => item.id?.videoId && item.snippet?.title)
        .map((item) => ({
          id: item.id.videoId,
          title: cleanTitle(item.snippet.title),
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }));

      if (mappedResults.length === 0) {
        setResults([]);
        setStatus("empty");
        setStatusMessage("No usable results returned.");
        return;
      }

      setResults(mappedResults);
      setStatus("ready");
      setStatusMessage("");
    } catch (error) {
      setResults([]);
      setStatus("error");
      setStatusMessage("Search failed.");
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
        <div className="search-panel">
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              className="search-form__input"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="search references"
              spellCheck="false"
              autoComplete="off"
            />
            <button className="search-form__button" type="submit">
              Search
            </button>
          </form>

          {statusMessage ? (
            <p className={`search-panel__message search-panel__message--${status}`}>{statusMessage}</p>
          ) : null}

          <div className="search-results">
            {visibleResults.slice(0, 4).map((result) => (
              <a
                key={result.id}
                className="search-card"
                href={result.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="search-card__body">
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
