/*
* 本地存储封装模块
*/

export const getItem = (key) => {
  const data = localStorage.getItem(key)
  // 为什么把 JSON.parse 放到 try-catch 中？
  // 因为data可能不是 JSON 格式字符串
  try {
    // 如果data是 JSON格式字符串 则返回，否则报错进入catch
    return JSON.parse(data)
  } catch (err) {
    // data不是 JSON格式字符串，返回原数据
    return data
  }
}

export const setItem = (key, value) => {
  // 如果 value 是对象，就把 value 转为 JSON 格式字符串再存储
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  localStorage.setItem(key, value)
}

export const remove = (key) => {
  localStorage.removeItem(key)
}
