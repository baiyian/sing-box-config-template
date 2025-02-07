// https://github.com/june216/sing-box-sub-merger/blob/main/merge.js
const policy = [
    {
        "tag": "Mode",
        "outbounds": [
            "Auto",
            "HK",
            "Japan",
            "Singapore",
            "US",
            "Others",
            "Download"
        ],
        "type": "selector"
    },
    {
        "tag": "Auto",
        "type": "urltest",
        "regex": "(香港).*(IEPL)"
    },
    {
        "tag": "direct",
        "type": "direct"
    },
    {
        "tag": "HK",
        "type": "selector",
        "regex": "(香港)"
    },
    {
        "tag": "Japan",
        "type": "selector",
        "regex": "^(?=.*日本)(?!.*下载).*$"
    },
    {
        "tag": "Singapore",
        "type": "selector",
        "regex": "(新加坡)"
    },
    {
        "tag": "US",
        "type": "selector",
        "regex": "(美国)"
    },
    {
        "tag": "Others",
        "type": "selector",
        "regex": "^(?!.*(香港|日本|美国|新加坡)).*$"
    },
    {
        "tag": "Download",
        "type": "urltest",
        "regex": "(下载)"
    }
]
let singboxProxies = await produceArtifact({
    type: 'subscription', // type: 'subscription' 或 'collection'
    name: 'ikuuu', // subscription name
    platform: 'sing-box', // target platform
    produceType: 'internal' // 'internal' produces an Array, otherwise produces a String( JSON.parse('JSON String') )
})

const merge = async () => {

    let nodes = singboxProxies;
    let sing_box_config = JSON.parse($content);
    let outbounds = policy;

    //extract tags
    let tags = [];
    for (let i = 0; i < nodes.length; i++) {
        tags.push(nodes[i].tag);
    }

    //filter outbounds
    for (let i = 0; i < outbounds.length; i++) {
        if (outbounds[i].regex) {
            let regex_1 = new RegExp(outbounds[i].regex);
            outbounds[i].outbounds = tags.filter(function (item) { return regex_1.test(item); });
            delete outbounds[i].regex;
        }
    }

    //merge nodes
    outbounds = outbounds.concat(nodes);

    //merge outbounds
    sing_box_config.outbounds = outbounds;

    return sing_box_config
}

// JSON
$content = JSON.stringify(await merge(), null, 2)

// { $content, $files } will be passed to the next operator 
// $content is the final content of the file
