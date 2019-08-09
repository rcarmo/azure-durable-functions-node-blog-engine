/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 */

const fs = require("fs"),
      path = require("path"),
      storage = require("azure-storage"),
      marked = require('marked'),
      mime = require('mime-types'),
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
                reject(err);
            } else {
                resolve({ message: `Downloaded "${data}"`, text: data });
            }
        });
    });
};

const uploadHTML = async (pathname, text) => {
    return new Promise((resolve, reject) => {
        var options = {contentSettings:{contentType: mime.lookup(pathname), cacheControl: 'max-age: 38400'}};
        blobService.createBlockBlobFromText("$web", pathname, text, options, err => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: `Text "${text}" is written to blob storage` });
            }
        });
    });
};

module.exports = async function (context, name) {
    context.log(name);
    
    var response = await getMarkup(name),
        html     = marked(response.text),
        result   = await uploadHTML(name.substr(0, name.lastIndexOf(".")) + ".html", html);

    context.log(html);
    context.log(result);
};