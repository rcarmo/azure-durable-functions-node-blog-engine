/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 */

const storage = require("azure-storage"),
      matter = require("gray-matter"),
      textile = require('textile'),
      blobService = storage.createBlobService(process.env['AzureWebJobsStorage']);

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
    // context.log(name);

    const response = await getMarkup(name),
            page = matter(response);
    page.name = name;

    // replace Textile with rendered HTML
    page.content = textile(page.content);
    return page;
};