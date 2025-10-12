// src/components/Meta.jsx
import { useEffect } from "react";

export default function Meta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);

  // Open Graph (lightweight)
  useEffect(() => {
    const set = (name, content) => {
      if (!content) return;
      let t = document.querySelector(`meta[property="${name}"]`);
      if (!t) {
        t = document.createElement("meta");
        t.setAttribute("property", name);
        document.head.appendChild(t);
      }
      t.setAttribute("content", content);
    };
    if (title) set("og:title", title);
    if (description) set("og:description", description);
  }, [title, description]);

  return null;
}