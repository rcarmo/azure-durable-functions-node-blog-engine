/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 */

const storage = require("azure-storage"),
      matter = require("gray-matter"),
      remarkable = require('remarkable'),
      hljs = require('highlight.js'),
      blobService = storage.createBlobService(process.env['AzureWebJobsStorage']);

var md = new remarkable.Remarkable({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) {}
      }
  
      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {}
  
      return ''; // use external default escaping
    },
    typographer: true,
    html: true
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
    //context.log(name);
    const response = await getMarkup(name),
            page = matter(response);
    page.name = name;
    // replace Markdown with rendered HTML
    page.content = md.render(page.content);
    return page;
};