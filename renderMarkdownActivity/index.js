/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 */

const storage = require("azure-storage"),
      matter = require("gray-matter"),
      marked = require('marked'),
      blobService = storage.createBlobService(process.env['AzureWebJobsStorage']);

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code) {
    return require('highlight.js').highlightAuto(code).value;
  },
  gfm: true,
  breaks: false,
  smartLists: true,
  smartypants: true,
  xhtml: false
});

const getMarkup = async (blobName) => {
    return new Promise((resolve, reject) => {
        blobService.getBlobToText("raw-markup", blobName, (err, data) => {
            if (err) {
                reject(new Error(err)); // fail with runtime error and kill activity
            } else {
                resolve(data);
            }
        });
    });
};

module.exports = async function (context, name) {
    context.log(name);
    const response = await getMarkup(name),
            page = matter(response);
    page.name = name;
    // replace Markdown with rendered HTML
    page.content = marked(page.content);
    return page;
};