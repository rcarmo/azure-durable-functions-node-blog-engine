/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 */

const path = require('path'),
      mime = require('mime-types'),
      mustache = require('mustache'),
      storage = require('azure-storage'),
      cheerio = require('cheerio'),
      blobService = storage.createBlobService(process.env['AzureWebJobsStorage']);

const getTemplate = async (blobName) => {
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

const uploadHTML = async (pathname, text) => {
    return new Promise((resolve, reject) => {
        var options = {
            contentSettings:{
                contentType: mime.lookup(pathname) + "; charset=utf-8", // ensure we write as UTF-8
                cacheControl: 'max-age: 38400'
            }
        };
        blobService.createBlockBlobFromText("$web", pathname, text, options, err => {
            if (err) {
                reject(new Error(err)); // fail with runtime error and kill activity
            } else {
                resolve(true);
            }
        });
    });
};

// Polyfill to rebuild an object from key/value pairs
Object.fromEntries = arr => Object.assign({}, ...Array.from(arr, ([k, v]) => ({[k]: v}) ));


module.exports = async function (context, page) {
    // context.log(page.name);

    const template = await getTemplate('_assets/page_template.html');

    // lowercase front matter before applying it to template
    page.data = Object.fromEntries(Object.entries(page.data).map(([k, v]) => [k.toLowerCase(), v]));
    page.data.content = page.content;

    var html = mustache.render(template, page.data),
        $ = cheerio.load(html);

    // rewrite template head links (CSS, etc.)
    ['head > link'].forEach(selector => {
        $(selector).each((i, elem) => {
            const href = $(elem).attr("href");
            if(href) {
                if(!(href.startsWith("http") || (href[0] == '/'))) {
                    $(elem).attr("href", '/_assets/' + href);
                }
            }
        })
    });

    // rewrite script SRC tags to have absolute URLs from site root
    ['script'].forEach(selector => {
        $(selector).each((i, elem) => {
            const src = $(elem).attr("src");
            if(src) {
                if(!(src.startsWith("http") || (src[0] == '/'))) {
                    $(elem).attr("src", '/_assets/' + src);
                }
            }
        })
    });

    // rewrite image tags to have absolute URLs from site root
    ['img'].forEach(selector => {
        $(selector).each((i, elem) => {
            const src = $(elem).attr("src");
            if(src) {
                if(!(src.startsWith("http") || (src[0] == '/'))) {
                    $(elem).attr("src", '/' + path.dirname(page.name) + '/' + src);
                }
            }
        })    
    });
    html = $.html();

    const result = await uploadHTML(page.name.substr(0, page.name.lastIndexOf(".")) + ".html", html);

    // context.log(html);
    // context.log(result);
    return result;
};
