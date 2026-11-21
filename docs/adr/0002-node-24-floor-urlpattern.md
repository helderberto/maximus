# Node 24 floor; matchPath built on native URLPattern

mxs 1.0 requires Node >=24 so `matchPath` can wrap the native `URLPattern` instead of reimplementing pattern matching, per the platform-first rule. mxs adds what `URLPattern` lacks: params inferred from the path pattern, decoding, trailing-slash tolerance and `null` on no match. Node 22 was rejected: it lacks `URLPattern` and reaches end of life in April 2027.
