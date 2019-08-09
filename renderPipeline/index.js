/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by a starter function.
 */

const df = require('durable-functions'),
      stream = require('stream'),
      path = require('path'),
      markdown_files = ['.md', '.mkd', '.markdown'],
      textile_files = ['.textile'],
      html_files = ['.htm', '.html'];

module.exports = df.orchestrator(function* (context) {
    const outputs = [],
          name = context.df.getInput(),
          extension = path.extname(name);

    context.log("pipeline:", name, extension);

    if(markdown_files.includes(extension)) {
        outputs.push(yield context.df.callActivity("renderMarkdownActivity", name))
    }
    else
        outputs.push(yield context.df.callActivity("copyActivity", name))

    return outputs;
});