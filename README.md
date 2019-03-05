# google-translate


# StartUp
`node test.js`

# Usage
const translate = require("./src/translate");

translate.translate("我是一只猪", ["de-DE", "el-GR", "fr-FR", "ja-JP", "ru-RU", "vi-VN", "en-GB"], function (transResults) {
    for(let result of transResults) {
        console.log(result[0], ": ", result[1]);
    }
});

translate.translateOneByOne("你是一只小朋友, 我也是", ["de-DE", "el-GR", "fr-FR", "ja-JP", "ru-RU", "vi-VN", "en-GB"]).then(function (transResults) {
    for(let result of transResults) {
        console.log(result[0], ": ", result[1]);
    }
});

translate.translateObj({test:{test:"SCORE"}}, ["de-DE", "el-GR", "fr-FR", "ja-JP", "ru-RU", "vi-VN", "en-GB", "zh-CN"], function (transResults) {
    for(let result of transResults) {
         console.log(result[0], ": ", JSON.stringify(result[1]));
    }
 });

translate.translateObjOneByOne({test:{test:"BEST SCORE. YES IT IS!
 "}}, ["de-DE", "el-GR", "fr-FR", "ja-JP", "ru-RU", "vi-VN", "en-GB", "zh-CN"]).then(function (transResults) {
    for(let result of transResults) {
        console.log(result[0], ": ", JSON.stringify(result[1]));
    }
 });