// Renders code pasted in Admin > SEO Settings (Google Analytics, Meta Pixel, Search Console
// verification, chat widgets) as real tags, so scripts run and meta tags reach <head>.
// Server component: the tags are in the page's HTML from the first byte.
import { Fragment, type ReactNode } from "react";

const ATTR_NAMES: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  charset: "charSet",
  crossorigin: "crossOrigin",
  "http-equiv": "httpEquiv",
  referrerpolicy: "referrerPolicy",
  nomodule: "noModule",
  nonce: "nonce",
  fetchpriority: "fetchPriority",
  frameborder: "frameBorder",
  allowfullscreen: "allowFullScreen",
};
const BOOLEAN_ATTRS = new Set(["async", "defer", "noModule", "allowFullScreen", "hidden"]);

function parseAttrs(source: string) {
  const props: Record<string, string | boolean> = {};
  const re = /([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>"']+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) {
    const raw = m[1].toLowerCase();
    if (raw.startsWith("on")) continue; // inline event handlers are not supported by React
    const name = ATTR_NAMES[raw] || raw;
    const value = m[2] ?? m[3] ?? m[4];
    if (name === "style") continue;
    props[name] = BOOLEAN_ATTRS.has(name) ? true : value ?? "";
  }
  return props;
}

const TAG_RE =
  /<(script|noscript|style)\b([^>]*)>([\s\S]*?)<\/\1\s*>|<(meta|link)\b([^>]*?)\/?>|<!--[\s\S]*?-->/gi;

// placement "head": only tags that belong in <head>; anything else is dropped.
// placement "body": other HTML (e.g. a widget container) is kept as-is.
export default function InjectedHtml({ html, placement }: { html?: string; placement: "head" | "body" }) {
  if (!html?.trim()) return null;

  const nodes: ReactNode[] = [];
  let last = 0;
  let i = 0;
  const pushRest = (text: string) => {
    if (placement === "body" && text.trim()) {
      nodes.push(<div key={`h${i++}`} dangerouslySetInnerHTML={{ __html: text }} />);
    }
  };

  let m: RegExpExecArray | null;
  TAG_RE.lastIndex = 0;
  while ((m = TAG_RE.exec(html))) {
    pushRest(html.slice(last, m.index));
    last = TAG_RE.lastIndex;
    const key = `s${i++}`;

    if (m[1]) {
      const tag = m[1].toLowerCase();
      const props = parseAttrs(m[2]);
      const inner = m[3];
      if (tag === "script") {
        nodes.push(
          props.src ? (
            <script key={key} {...props} />
          ) : (
            <script key={key} {...props} dangerouslySetInnerHTML={{ __html: inner }} />
          ),
        );
      } else if (tag === "style") {
        nodes.push(<style key={key} {...props} dangerouslySetInnerHTML={{ __html: inner }} />);
      } else {
        nodes.push(<noscript key={key} dangerouslySetInnerHTML={{ __html: inner }} />);
      }
    } else if (m[4]) {
      const props = parseAttrs(m[5]);
      nodes.push(m[4].toLowerCase() === "meta" ? <meta key={key} {...props} /> : <link key={key} {...props} />);
    }
  }
  pushRest(html.slice(last));

  return <Fragment>{nodes}</Fragment>;
}
