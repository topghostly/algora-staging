"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function TrackSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.push(`/tracks?${params.toString()}`);
    },
    [router, searchParams]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query !== (searchParams.get("search") || "")) {
        handleSearch(query);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, handleSearch, searchParams]);

  const clearSearch = () => {
    setQuery("");
    handleSearch("");
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "6rem auto 0rem",
        position: "relative",
      }}
    >
      <div style={{ position: "relative" }}>
        <Search
          size={20}
          color="var(--muted)"
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        <input
          type="text"
          placeholder="Search for tracks"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "1rem 2.5rem",
            borderRadius: "var(--radius-lg)",
            border: "2px solid var(--border)",
            fontSize: "1rem",
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            transition: "all 0.2s ease",
            outline: "none",
            // boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        {query && (
          <button
            onClick={clearSearch}
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              borderRadius: "50%",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--muted-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
