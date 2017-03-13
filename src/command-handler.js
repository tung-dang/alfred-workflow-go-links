const fs = require('fs');

const AlfredNode = require('alfred-workflow-nodejs-next');
const {
    Item,
    storage,
} = AlfredNode;
const executors = require('./executors.js');


const SEPARATOR = ' | ';
const GO_LIST_FILE = './go_list.txt';
const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;

class CommandHandler {
    constructor(options) {
        this.workflow = options.workflow;

        this.loadAllLinks = this.loadAllLinks.bind(this);
        this._processLine = this._processLine.bind(this);

        this.rawData = '';
    }

    _readLinkRepo () {
        this.rawData = storage.get('rawData');

        if (!this.rawData) {
            console.warn('INFO: read go_list.txt file');
            this.rawData = fs.readFileSync(GO_LIST_FILE, 'utf8');
        } else {
            console.warn('INFO: get data from cache');
        }

        if (!this.rawData) {
            this.workflow.error('Error', 'Can not load go_list.txt file');
            return '';
        }

        storage.set('rawData', this.rawData, ONE_DAY);
        return this.rawData;
    }

    loadAllLinks(query) {
        this.query = query ? query.trim() : '';

        const rawData = this._readLinkRepo();

        const lines = rawData.split('\n');
        lines.forEach(this._processLine);

        this.workflow.feedback();
    }

    _processLine(line) {
        line = line.trim();

        const isComment = line.indexOf('#') === 0;
        if (isComment || !line) {
            return;
        }

        const temp = line.split(SEPARATOR);
        const address = temp[0];
        const title = temp[1];
        const subtitle = this._getSubTitleFromAddress(address);
        const finalLink = this._getFinalLink(address, subtitle);
        const searchStr = this._getSearchStr(line);
        const isMatchSearch = title && finalLink &&
                                (!searchStr || line.toLowerCase().indexOf(searchStr) >= 0);

        if (isMatchSearch) {
            const item = new Item({
                uid: address,
                title,
                subtitle,
                hasSubItems: false,
                arg: {
                    actionName: 'open_link',
                    link: finalLink,
                    params: this._getParamFromQuery()
                }
            });

            this.workflow.addItem(item);
        }
    }


    /**
     * After excluding last word, the remaining is search string
     * @return {string} [description]
     */
    _getSearchStr(line) {
        const hasParameter = line.includes('{') && line.includes('}');
        if (!hasParameter) {
            return this.query;
        }

        let searchStr = '';
        const words = this.query.split(' ');

        if (words.length === 1) {
            searchStr = this.query;
        } else if (words.length > 1) {
            // remove last item
            words.pop();
            searchStr = words.join(' ');
        }

        return searchStr.toLowerCase();
    }

    _getFinalLink(address, subtitle) {
        let finalLink = 'https://';

        const isGoAddress = address.indexOf('go/') === 0;
        if (isGoAddress) {
            finalLink += address;
        } else {
            finalLink += subtitle;
        }
        return finalLink;
    }

    /**
     * Last word is param. Now we just support only one param.
     */
    _getParamFromQuery() {
        const params = [];

        const words = this.query.split(' ');
        // remove last item
        const lastWord = words.pop();
        if (lastWord) {
            params.push(lastWord.trim());
        }

        return params;
    }

    _getSubTitleFromAddress(address) {
        let subTitle = address;

        const isGoAddress = address.indexOf('go/') === 0;
        if (isGoAddress) {
            subTitle = address.replace('go/', '');
        }

        // remove 'http://'
        subTitle = subTitle
            .replace('http://', '')
            .replace('https://', '');

        // remove last /
        subTitle = subTitle.replace(/\/$/, '');

        return subTitle;
    }
}


module.exports = CommandHandler;