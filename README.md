# azure-durable-functions-node-blog-engine

This is an [Azure Functions][azf] sample where I demonstrate how to build a blob storage processing pipeline with durable functions in [NodeJS][n]

## Why

This was originally intended to demonstrate how to process thousands of XML/CSV files in a scalable way and insert them into a database as they were uploaded, but the general principle behind that kind of transformation pipeline is exactly the same as a static site generator, and handling text and image content also provides opportunity to incorporate Azure Cognitive Services.

The current demo site is [here](http://acmeblogenginebfa7.z6.web.core.windows.net) (may be temporarily broken as I build this out).

## Workflow

This set of functions is a simple direct pipeline that converts raw markup from  decomposed into the following steps:

- A blob trigger is invoked whenever a new file is added to the `raw-markup` container, and goes through the following steps:
  - Check the kind of file to handle
    - If it's an image, then copy it across directly to the `$web` container
    - If it's markup, then render it to HTML, apply a template, and place the results in the `$web` container

Right now rendering and saving to blob storage is a single step, but will be decomposed into more atomic, re-usable components as I flesh out the code.

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
- [ ] High-level integration with Application Insights
- [ ] Split blob storage access from rendering (`writeActivity`)
- [ ] Templating
- [ ] Image processing
- [x] Simple rendering
- [x] Sample content tree
- [x] Basic engine


[n]: http://nodejs.org
[azf]: https://docs.microsoft.com/en-us/azure/azure-functions/

