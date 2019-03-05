const translateFunc = require("./google-translate");

async function wait(millisecond) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, millisecond);
    });
}

function translate(txt, dlList, donecb, client="webapp") {
    let transResults = new Map();
    for(let dl of dlList) {
        translateFunc(txt, {to: dl, client: client}).then(function (res) {
            transResults.set(dl, res.text);
            if (transResults.size === dlList.length && typeof(donecb) ===  "function") {
                donecb(transResults);
            }
        }).catch(function () {
            transResults.set(dl, "");
            if (transResults.size === dlList.length && typeof(donecb) ===  "function") {
                donecb(transResults);
            }
        });
    }
}

async function translateOneByOne(txt, dlList, interval = 1000, client = "webapp") {
    let transResults = new Map();
    for(let dl of dlList) {
        try {
            let res = await translateFunc(txt, {to: dl, client: client});
            transResults.set(dl, res.text);
            if (transResults.size === dlList.length) {
                return transResults;
            }
            await wait(interval);
        }catch (e) {
            transResults.set(dl, "");
            if (transResults.size === dlList.length) {
                return transResults;
            }
        }
    }
}

function translateObj(object, dlList, donecb, client = "webapp") {
    let transResults = new Map();
    for(let dl of dlList) {
        let langObj = {};
        let walkThroughObj = function (objWalk, objLeft) {
            for (let item in objLeft) {
                if(objLeft.hasOwnProperty(item)) {
                    if (typeof objLeft[item] === 'string') {
                        translate(objLeft[item], [dl], function (result) {
                            objWalk[item] = result.get(dl);
                            transResults.set(dl, langObj);
                            if (transResults.size === dlList.length) {
                                donecb(transResults);
                            }
                        }, client);
                    } else if (typeof objLeft[item] === 'object') {
                        objWalk[item] = {};
                        walkThroughObj(objWalk[item], objLeft[item]);
                    }
                }
            }
        };
        walkThroughObj(langObj, object);
    }
}

async function translateObjOneByOne(object, dlList, interval=1000, client="webapp") {
    let transResults = new Map();
    for(let dl of dlList) {
        let langObj = {};
        let walkThroughObj = async function (objWalk, objLeft) {
            for (let item in objLeft) {
                if(objLeft.hasOwnProperty(item)) {
                    if (typeof objLeft[item] === 'string') {
                        let result = await translateOneByOne(objLeft[item], [dl], interval, client);
                        objWalk[item] = result.get(dl);
                        await wait(interval);
                    } else if (typeof objLeft[item] === 'object') {
                        objWalk[item] = {};
                        await walkThroughObj(objWalk[item], objLeft[item]);
                    }
                }
            }
        };
        await walkThroughObj(langObj, object);
        transResults.set(dl, langObj);
        if (transResults.size === dlList.length) {
            return transResults;
        }
    }
}

module.exports.translate = translate;
module.exports.translateOneByOne = translateOneByOne;
module.exports.translateObj = translateObj;
module.exports.translateObjOneByOne = translateObjOneByOne;