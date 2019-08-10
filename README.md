# azure-durable-functions-node-blog-engine

This is an [Azure Functions][azf] sample where I demonstrate how to build a blob storage processing pipeline with [durable functions][azdf] in [NodeJS][n].

## Why

This was originally part of an "ETL" pipeline, and intended to demonstrate how to process thousands of XML/CSV files in a scalable way and insert them into a database as they were uploaded.

But the general principle behind that kind of transformation pipeline is exactly the same as a static site generator, and handling text and image content also provides opportunity to incorporate Azure Cognitive Services and other fun things, so I turned the original pipeline into something of more general interest - i.e., a fully serverless static file generator.

> Incidentally, you can run this completely inside the [Azure Free Tier][azfree]!

The current demo site is [here](http://acmeblogenginebfa7.z6.web.core.windows.net) (may be temporarily broken as I build this out).

## Workflow

This is designed as a multi-step pipeline that converts raw markup into HTML with the following steps:

![diagram](sampleContent/docs/internals/diagram.png)

In short, markup is rendered into HTML and then re-rendered into a template, and everything else is just copied across into the `$web` container for an Azure Website.

## Setup

This sample currently assumes you've performed the following provisioning actions via the Azure Portal:

- Set up a NodeJS Function App (on Windows or Linux - a free tier Function App will do just fine)
- Upgraded the associated storage account to `StorageV2 (general purpose v2)`
- Enabled the `Static website` feature and made sure the `$web` container has public access enabled
- Gone into Function App `Configuration` -> `All Settings` -> `Deployment Center` and activated `Local Git` deployment via Kudu (re-visit that pane after configuration to get the Git URL and credentials)

(An Azure template and/or CLI commands to automate this will be added later)

## To Do

- [ ] Azure Template
- [ ] Integration with Cognitive Services
- [ ] Higher-level integration with Application Insights
- [ ] Update diagram
- [ ] Add `renderPluginActivity` as an example extension
- [ ] List of blog posts (ordered list of everything under `/blog`)
- [ ] Add auxiliary storage table for metadata lookup
- [ ] Flesh out example content and formatting tests
- [x] Reformat asset links (images, stylesheets, etc.)
- [x] Split blob storage access from rendering (`renderTemplateActivity`)
- [x] Templating
- [x] Image processing
- [x] Simple rendering
- [x] Sample content tree
- [x] Basic engine


[n]: http://nodejs.org
[azf]: https://docs.microsoft.com/en-us/azure/azure-functions/
[azdf]: https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview
[azfree]: https://azure.microsoft.com/free/

