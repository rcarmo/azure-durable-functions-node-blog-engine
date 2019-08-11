---
From: Rui Carmo
Date: 2019-08-11 10:53:00
Title: Templating
---

Markup is rendered to HTML using a [Mustache](http://mustache.github.io) template in the `_assets` folder (`_assets/page_template.html`).

Any static assets should be placed in that folder, and the engine will rewrite links to them (and to inline images) accordingly.
