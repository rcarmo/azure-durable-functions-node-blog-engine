/*
 * This is the starter function, which is triggered by a blob event.
 */

const df = require("durable-functions");

module.exports = async function (context, srcBlob) {
    const client = df.getClient(context),
          name = context.bindingData.name,
          length = srcBlob.length;

    context.log("name:", name, " size:", length);
    
    const instanceId = await client.startNew("renderPipeline", undefined, name);
    context.log("orchestrator:", instanceId);

    return client.createCheckStatusResponse(name, instanceId)
};