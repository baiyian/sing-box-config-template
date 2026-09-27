const { type, name } = $arguments

let config = JSON.parse($files[0])
let proxies = await produceArtifact({
  name,
  type: /^1$|col/i.test(type) ? 'collection' : 'subscription',
  platform: 'sing-box',
  produceType: 'internal',
})

// 1. 将拉取节点追加追加到 outbounds 节点数组中
config.outbounds.push(...proxies)

// 提取全量节点名称数组
const allProxyTags = proxies.map(p => p.tag)

// 正则匹配获取特定地区的节点 Tag
const hkProxyTags = getTags(proxies, /港|hk|hongkong|hong kong|🇭🇰/i)
const sgProxyTags = getTags(proxies, /新|坡|sg|singapore|🇸🇬/i)
const jpProxyTags = getTags(proxies, /日|jp|japan|🇯🇵/i)
const usProxyTags = getTags(proxies, /美|us|unitedstates|united states|🇺🇸/i)

// 2. 遍历模板里的 outbound 组，精准注入节点 Tag
config.outbounds.forEach(i => {
  if (!Array.isArray(i.outbounds)) return

  // 香港地区节点
  if (i.tag === '香港手动') {
    if (hkProxyTags.length > 0) i.outbounds.push(...hkProxyTags)
  }

  // 狮城 (新加坡) 地区节点
  if (i.tag === '狮城手动') {
    if (sgProxyTags.length > 0) i.outbounds.push(...sgProxyTags)
  }

  // 日本地区节点
  if (i.tag === '日本手动') {
    if (jpProxyTags.length > 0) i.outbounds.push(...jpProxyTags)
  }

  // 美国地区节点
  if (i.tag === '美国手动') {
    if (usProxyTags.length > 0) i.outbounds.push(...usProxyTags)
  }

  // 手动选择 / 自动选择：注入全量机场节点
  if (['手动选择', '自动选择'].includes(i.tag)) {
    if (allProxyTags.length > 0) i.outbounds.push(...allProxyTags)
  }
})

// 3. 清理兜底逻辑：如果某个地区组成功匹配并注入了节点，则移除模板自带的 "直连" 占位符
config.outbounds.forEach(outbound => {
  if (
    ['香港手动', '狮城手动', '日本手动', '美国手动', '手动选择', '自动选择'].includes(outbound.tag) &&
    Array.isArray(outbound.outbounds) &&
    outbound.outbounds.length > 1
  ) {
    // 过滤掉预设占位的 "直连"
    outbound.outbounds = outbound.outbounds.filter(tag => tag !== '直连')
  }
})

$content = JSON.stringify(config, null, 2)

// 辅助正则表达式筛选节点标签函数
function getTags(proxies, regex) {
  return proxies.filter(p => regex.test(p.tag)).map(p => p.tag)
}
