---
From: Rui Carmo
Date: 2014-10-04 09:17:00
Title: Content Basics
---

## Files and Folders

This simple blog engine expects you to organize your content using _a folder per page_ with an "index" document inside. The folder path determines the URL it's published under (so you get "nice" URLs by default), and this makes it easier to manage media assets on a per-post basis:

![Folders](image.png)

## Markup Languages

This engine supports Markdown, Textile, and HTML, and determines which markup processor to use based on the file extension.

## Front Matter

Your index document must start with some front matter to provide page metadata.

The engine isn't especially picky about anything except that header names should be followed by a colon and that the first blank line separates them from the body text:

    ---
    From: Rui Carmo
    Date: 2014-10-04 09:24:00
    Title: Test post
    ---

    ## Content Heading
    
    Body text

### Recognized Headers

The simple blog engine looks for the following (case-insensitive) headers:

* `Date:` the original publishing date for your post. If missing, the file modification time is used.
* `From:` the author name
* `Last-Modified:` lets you override file modification time explicitly and trumps the date for insertion in RSS feeds
* `Title:` your page/post title
