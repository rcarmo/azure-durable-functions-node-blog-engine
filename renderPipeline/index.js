/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by a starter function.
 */

const df = require('durable-functions'),
      path = require('path'),
      activityMap = {
            renderMarkdownActivity: {
                extensions: ['.md', '.mkd', '.markdown'],
                pipeline: ['renderMarkdownActivity', 'renderTemplateActivity']
            },
            renderTextileActivity: {
                extensions: ['.text', '.textile'],
                pipeline: ['renderTextileActivity', 'renderTemplateActivity']
            },
            renderTemplateActivity: {
                extensions: ['.htm', '.html'],
                pipeline: ['renderTemplateActivity']
            }
        };

module.exports = df.orchestrator(function* (context) {
    const outputs = [],
          name = context.df.getInput(),
          extension = path.extname(name);

    var pipeline = ["copyActivity"],
        currentItem = name;

    context.log("pipeline:", pipeline, name, extension);

    Object.keys(activityMap).forEach(key => { 
        if(activityMap[key].extensions.includes(extension)) {
            pipeline = activityMap[key].pipeline;
        }
    })

    for(let activity of pipeline) {
        // all activities we build should return a JS object
        context.log("running:", activity);
        currentItem = yield context.df.callActivity(activity, currentItem);
        context.log(currentItem);
        if(currentItem == null) { // the activity has failed
            context.log("error:", activity)
            yield cancel(activity)
            break
        }
        outputs.push(currentItem);
    }
    return outputs;
});