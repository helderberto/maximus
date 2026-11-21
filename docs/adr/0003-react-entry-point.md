# React modules ship from a separate `mxs/react` entry

React-specific modules live in `src/react/<name>/` and ship from a separate `mxs/react` entry in `exports`, with `react` as an optional peer dependency. The root `mxs` entry never imports React, so Node consumers never load it. The folder is created only when the first React module passes the admission rule; no empty placeholder. Considered putting hooks in the root entry: rejected because it couples Node consumers to React.
