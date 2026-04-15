import { useEffect, useRef, useState } from "react";
import { demoReferenceResults } from "../data/studiolotData";
import { SceneCopyPanel } from "./SceneCopyPanel";

function cleanTitle(title) {
  const asciiTitle = title.replace(/[^\x00-\x7F]/g, "").trim();
  return asciiTitle || title;
}

export function CloudLibraryScene({ scene }) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY?.trim();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setResults([]);
      return;
    }

    if (!apiKey) {
      setResults(demoReferenceResults);
      return;
    }

    const requestUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    requestUrl.searchParams.set("part", "snippet");
    requestUrl.searchParams.set("order", "relevance");
    requestUrl.searchParams.set("maxResults", "6");
    requestUrl.searchParams.set("q", trimmedQuery);
    requestUrl.searchParams.set("key", apiKey);

    try {
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(`Search request failed with ${response.status}`);
      }

      const payload = await response.json();
      const items = payload.items ?? [];

      const mappedResults = items
        .filter((item) => item.id?.videoId && item.snippet?.thumbnails?.medium?.url)
        .map((item) => ({
          id: item.id.videoId,
          title: cleanTitle(item.snippet.title),
          thumbnail: item.snippet.thumbnails.medium.url,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        }));

      setResults(mappedResults.length > 0 ? mappedResults : demoReferenceResults);
    } catch (error) {
      setResults(demoReferenceResults);
    }
  }

  return (
    <div className="content-container content-container--library">
      <SceneCopyPanel section={scene.section} detailsHtml={scene.detailsHtml} />

      <div className="library-search-panel">
        <form className="library-search-form" onSubmit={handleSearch}>
          <input
            ref={inputRef}
            id="youtube-search-input"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="*eg. import youtube references..."
            spellCheck="false"
            autoComplete="off"
          />
          <button
            id="search-button"
            className="material-symbols-rounded"
            type="submit"
            aria-label="Search"
          >
            search
          </button>
        </form>

        <div id="youtube-search-results">
          {results.map((item) => (
            <div key={item.id}>
              <a href={item.url} target="_blank" rel="noreferrer" className="video-link">
                <img className="thumbnail" src={item.thumbnail} alt="" />
                <div className="video-title">{item.title}</div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
