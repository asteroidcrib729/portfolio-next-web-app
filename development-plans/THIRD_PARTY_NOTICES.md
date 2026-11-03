# Third-Party Notices

This project depends on third-party software. The lockfile is the authoritative list
of resolved packages and transitive dependencies. Direct runtime packages include:

| Package                                   | Declared license                        |
| ----------------------------------------- | --------------------------------------- |
| `@prisma/adapter-pg` and `@prisma/client` | Apache-2.0                              |
| `@vercel/analytics`                       | MIT                                     |
| `clsx`                                    | MIT                                     |
| `dotenv`                                  | BSD-2-Clause                            |
| `geist`                                   | SIL Open Font License 1.1               |
| `lucide-react`                            | ISC, with applicable Feather MIT notice |
| `motion`                                  | MIT                                     |
| `next`                                    | MIT                                     |
| `next-themes`                             | MIT                                     |
| `react` and `react-dom`                   | MIT                                     |
| `react-icons`                             | MIT                                     |
| `react-markdown`                          | MIT                                     |
| `remark-gfm`                              | MIT                                     |
| `tailwind-merge`                          | MIT                                     |
| `zod`                                     | MIT                                     |

Development dependencies remain subject to their own package notices. This summary
does not replace the license text distributed with each package. Product and company
names are used for identification only; all associated trademarks belong to their
respective owners.

The private build-tooling workspace in `tooling/minimatch-compat` delegates to the
official minimatch 11.0.4 package and its `@isaacs/nonrecursive-glob-match` dependency,
both declared under BlueOak-1.0.0. Their license text remains distributed with the
installed packages. The workspace contains original API adaptation code, not a copy
of a legacy matching engine.
