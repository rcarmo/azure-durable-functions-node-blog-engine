/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 * /

module.exports = async function (context) {
    context.log(context.bindings);
    return `${context.bindings}`;
};