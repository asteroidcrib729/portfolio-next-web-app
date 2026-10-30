# Shipping Less JavaScript in Next.js 16.4: Start at the Client Boundary

Performance work becomes more useful when it answers a concrete question: what does someone need to download before they can read my work and decide whether to contact me?

For this portfolio, my answer is not "every library the application uses." The publishing studio needs an interactive editor; a recruiter reading an article does not. That distinction shapes the architecture more than a fashionable optimization switch.

## Why this topic matters now

On October 28, 2026, the Next.js team introduced agent-assisted bundle investigation for Next.js 16.4. The tooling helps trace why a module reaches a browser bundle, rather than merely reporting a large file. One useful warning is that lazy-loading a component does not defer it if another path imports it eagerly into the same bundle. That makes import relationships an important part of a performance review. [Next.js announcement](https://nextjs.org/blog/ship-less-javascript-with-ai)

I see this as a good prompt to inspect boundaries before adding more tooling. An analyzer can explain the graph, but it cannot decide which interactions belong in a reader's experience. That remains a product and engineering decision.

## A client boundary is a dependency decision

In React Server Components, a `"use client"` module brings its transitive module dependencies into client evaluation. The boundary follows imports, not simply the visual nesting of JSX. A module can participate in both server and client graphs when different callers import it. [React directive reference](https://react.dev/reference/rsc/use-client)

Here is the kind of boundary I want to avoid in a content-first route:

```tsx
"use client";

import { ArticleBody } from "./ArticleBody";
import { ShareButton } from "./ShareButton";

export function ArticlePage({ content }: { content: string }) {
  return (
    <article>
      <ArticleBody content={content} />
      <ShareButton />
    </article>
  );
}
```

If only sharing requires browser APIs, I would keep the route and body server-rendered and mark the small sharing module as client code instead. This is an illustrative design example, not a claim that removing one directive always reduces a bundle by a particular amount.

Next.js recommends keeping client boundaries close to interactive UI. It also supports passing server-rendered content into a client component through props such as `children`; wrapping content in a client shell does not mean the shell must import its entire implementation. [Server and Client Components guide](https://nextjs.org/docs/app/getting-started/server-and-client-components)

## How I apply the distinction in this portfolio

My public article route loads published records on the server and renders `MarkdownArticle`. The renderer uses `react-markdown` and `remark-gfm`. Its server-side use does not, by itself, require those parser libraries to execute in the reader's browser.

The editorial `PostEditor` deliberately makes a different tradeoff. It manages input state and imports the same renderer for a live preview. That preview is a real authoring feature, so browser-side Markdown processing has a purpose there. I use `useDeferredValue` for the preview content to let urgent typing updates take priority; it is a scheduling choice, not a promise that parsing becomes free or the bundle becomes smaller.

These choices give me a useful review rule: a dependency justified in the private editor is not automatically justified on the public reading route. The studio also needs authentication and database-backed validation. A smaller client graph is not an authorization boundary, and hiding a link would not protect an action.

My navigation follows the same separation. A server component assembles the header, while theme switching and the mobile menu live in dedicated client components. I can inspect those interactive pieces without turning static navigation content into a stateful page component.

## Measure a route, not an impression

Next.js documents its Turbopack analyzer and package-bundling tools for inspecting dependencies and import chains. I would use that evidence to answer which route includes a package and which import brought it there, rather than assuming that an installed dependency is shipped to every visitor. [Package-bundling guide](https://nextjs.org/docs/app/guides/package-bundling)

My measurement process for a proposed change is:

1. Choose one public route and one user task, such as opening an article from the journal.
2. Record a production-build baseline with the same device, network conditions, and cache state.
3. Inspect the client import path of a suspected heavy dependency.
4. Make one bounded change, then rebuild and repeat the observation.
5. Check that reading, keyboard navigation, forms, and reduced-motion behavior still work.

I would record transferred JavaScript separately from parse and execution work, and a cold load separately from a repeat navigation. A warm-cache result is not interchangeable with a first visit. I would also keep the article route separate from the editor: one is a reading experience, the other is an application for authoring.

I have not published before-and-after bundle or Core Web Vitals measurements for this change. The defensible claim here is architectural intent, supported by the current source boundaries. Any future performance number needs its own reproducible baseline and test conditions.

## What I would not optimize away

Small bundles do not compensate for a broken keyboard flow, unclear content, or a failing contact form. My studio still needs labeled controls, associated validation messages, a keyboard-reachable preview, and deliberate focus management. Public pages still need understandable navigation and useful content before decorative effects.

Nor would I turn off necessary security checks to save a request. Publishing and deleting are server-side operations that must authenticate the caller. Performance budgets should make the intended product more efficient, not remove the guarantees that make it trustworthy.

## The takeaway

The first question I ask is not "can this component be lazy-loaded?" It is "why is this component in this visitor's client graph at all?"

Next.js 16.4's newer analysis tooling makes that question easier to investigate. The durable habit is to keep reading routes focused, justify interactive dependencies where they are used, and measure the result without inventing a success metric. That is the kind of frontend work I want this portfolio to demonstrate.

## Sources and scope

Researched October 30, 2026. Framework behavior and tooling references come from the linked official React and Next.js documentation. The portfolio examples are my interpretation of this repository's implementation, not a benchmark or a reproduction of another team's performance results.
