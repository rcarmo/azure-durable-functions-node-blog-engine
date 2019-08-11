---
From: Rui Carmo
Date: 2013-07-06 23:33:00
Title: Syntax Highlighting Tests
---

### Git-Flavored Markdown

The standard triple-backquote form.

```clojure
; parallel consumption of perishable resources
(defn foo [bar drinks]
    (pmap (:patrons bar) (lazy-seq drinks)))
```

```python
from bottle import view, request, abort

@view("rss")
def render_feed()
    if not items:
        abort("418", "I'm a teapot")
    else:
        return {"items": items}
```

This should be a plain text line.
