---
From: Rui Carmo
Date: 2014-10-04 09:17:00
Title: Content Basics
---

## Files and Folders

This simple blog engine expects you to organize your content using _a folder per page_ with an "index" document inside. The folder path determines the URL it's published under (so you get "nice" URLs by default), and this makes it easier to manage media assets on a per-post basis:

![Folders](image.png)

## Uploading Content

The easiest way to batch upload content is using `az` (which uses `azcopy sync` under the covers). Just take your Azure Storage connection string and do this:

```bash
export AZURE_STORAGE_CONNECTION_STRING="<taken from Azure Portal>"
az storage blob sync --source sampleContent --container raw-markup
```

It will then only transfer any files you've modified locally, and remove any leftover files on the `raw-markup` container[^1]:

```bash
Azcopy command: ['/usr/local/bin/azcopy', 'sync', 'sampleContent', 'https://<redacted>, '--delete-destination', 'true']

Job cfa91ed8-1aa3-0745-68c5-8ad363d8e540 has started
Log file is located at: /Users/rcarmo/.azcopy/cfa91ed8-1aa3-0745-68c5-8ad363d8e540.log

0 Files Scanned at Source, 0 Files Scanned at Destination

Job cfa91ed8-1aa3-0745-68c5-8ad363d8e540 Summary
Files Scanned at Source: 26
Files Scanned at Destination: 26
Elapsed Time (Minutes): 0.0334
Total Number Of Copy Transfers: 1
Number of Copy Transfers Completed: 1
Number of Copy Transfers Failed: 0
Number of Deletions at Destination: 0
Total Number of Bytes Transferred: 496
Total Number of Bytes Enumerated: 496
Final Job Status: Completed
```

## Markup

This engine supports Markdown and Textile, and determines which markup processor to use based on the file extension.

Syntax highlighting is also supported for fenced Markdown code blocks:

```javascript
const magic = require('leftpad')
```

Since this is performed client-side it can be a little temperamental, but generally works fine.

## Front Matter

Your index document must contain "front matter" to provide page metadata:

```plaintext
---
From: Rui Carmo
Date: 2014-10-04 09:24:00
Title: Test post
---

## Content Heading

Body text
```
 
The engine isn't especially picky about anything except that header names should be followed by a colon and that the first blank line separates them from the body text.

## Recognized Headers

The simple blog engine looks for the following (case-insensitive) headers:

* `Date:` the original publishing date for your post. If missing, the file modification time is used.
* `From:` the author name
* `Last-Modified:` lets you override file modification time explicitly and trumps the date for insertion in RSS feeds
* `Title:` your page/post title


[^1]: Note that any _rendered_ files that are published to `$web` are not removed automatically, since the engine does not (yet) handle blob deletions (that requires [Event Grid integration](https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-event-quickstart), which isn't implemented yet).