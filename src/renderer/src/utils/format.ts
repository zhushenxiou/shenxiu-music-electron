// 播放量格式化,千，万，亿，单位
export const formatPlayCount = (count: number) => {
  if (typeof count !== 'number' || count < 0) {
    return '加载中...'
  }

  const units = [
    { value: 100000000, suffix: '亿' },
    { value: 10000, suffix: '万' },
    { value: 1000, suffix: '千' }
  ]

  // 查找适用的最大单位
  const matchedUnit = units.find((unit) => count >= unit.value)

  if (matchedUnit) {
    const formattedValue = (count / matchedUnit.value).toFixed(1).replace(/\.0$/, '') // 移除无用的零
    return `${formattedValue}${matchedUnit.suffix}`
  }

  // 处理小于 1000 的情况
  return `${Math.floor(count)}`
}

/**
 * 格式化歌词字符串为数组，包含每行歌词的时间戳、内容和下一句出现时间戳
 * @param lyricStr - 原始歌词字符串，格式为 [mm:ss.xx]歌词内容
 * @returns 格式化后的歌词数组，每项包含 time（毫秒）、lrc（歌词内容）和 next（下一句出现时间戳）
 * 示例：
 * [00:12.34]第一行歌词
 * [00:45.67]第二行歌词
 * 解析后格式：
 * [
 *   { time: 12340, lrc: '第一行歌词', next: 45670 },
 *   { time: 45670, lrc: '第二行歌词', next: 83450 },
 * ]
 */
export const formatLyric = (lyricStr: string): { time: number; lrc: string; next: number }[] => {
  const lyricArr = lyricStr.split(/[(\r\n)\r\n]+/).map((item: string) => {
    const min = item.slice(1, 3) // 分
    const sec = item.slice(4, 6) // 秒
    let mill: number | string = Number(item.slice(7, 10))
    let lrc = item.slice(11, item.length)

    // 处理两位毫秒的情况
    if (isNaN(Number(mill))) {
      mill = Number(item.slice(7, 9)) * 10
      lrc = item.slice(10, item.length)
    }

    // 计算歌词时间戳（毫秒）
    const time = parseInt(min) * 60 * 1000 + parseInt(sec) * 1000 + Number(mill)
    return { time, lrc, next: 0 }
  })

  // 为每个歌词项设置下一句出现时间
  lyricArr.forEach((item, i) => {
    if (i === lyricArr.length - 1 || isNaN(lyricArr[i + 1].time)) {
      item.next = lyricArr[i + 2] ? lyricArr[i + 2].time : item.time + 1500
    } else {
      item.next = lyricArr[i + 1].time
    }
  })

  return lyricArr
}
