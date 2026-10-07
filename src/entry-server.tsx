// Build-time entry: renders the page to HTML for scripts/prerender.mjs.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export { SITE_URL, structuredData } from "./seo";

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
