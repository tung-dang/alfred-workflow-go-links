const AlfredNode = require('alfred-workflow-nodejs-next');

const {
    Workflow,
    storage
} = AlfredNode;
const { openLinkExecutor } = require('./executors.js');

const commands = {
    LOAD_ALL_LINKS: 'load_all_links',
    OPEN_LINK: 'open_link',
    CLEAR_CACHE: 'clear_cache'
};
const CommandHandler = require('./command-handler');

(function initWorkflow() {
    const workflow = new Workflow();
    workflow.setName('alfred-go-wf');

    const handler = new CommandHandler({
        workflow
    });

    workflow.onAction(commands.LOAD_ALL_LINKS, handler.loadAllLinks);
    workflow.onAction(commands.CLEAR_CACHE, () => storage.clear());

    workflow.onAction(commands.OPEN_LINK, (arg) => {
        openLinkExecutor.execute(JSON.parse(arg));
    });

    workflow.start();
}());
