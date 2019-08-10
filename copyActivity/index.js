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


const copyBlob = async (srcUri, pathname) => {
    return new Promise((resolve, reject) => {
        blobService.startCopyBlob(srcUri, "$web", pathname, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve({ message: data });
            }
        });
    });
}

module.exports = async function (context, name) {
    context.log("copy:", name);
    const srcUri = blobService.getUrl('raw-markup', name),
        result = await copyBlob(srcUri, name);

    context.log(result);
    return result;
};