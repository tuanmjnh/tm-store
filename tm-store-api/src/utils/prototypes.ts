declare global {
  interface String {
    convertToAscii(): string
    removeChars(): string
    toHtml(): string
    trimChars(char: string): string
  }
  interface Array<T> {
    pushIfNotExist(element: Array<string> | string, key?: string): Array<T>
    pushIfNotExistUpdate(element: Array<string> | string, key?: string): Array<T>
    sum(key: string): number
    distinctArry(): Array<T>
    distinctArrayObject(key: string): Array<T>
    max(): number
    min(): number
  }
}
String.prototype.convertToAscii = function () {
  // let $this = String(this)
  return (
    this.toLowerCase()
      .replace(/[ ]/g, '_')
      // .replace('[', '')
      // .replace(']', '')
      .replace(/[áàãạảâầấậẫẩăằắẵặẳ]/g, 'a')
      .replace(/[èéẹẽẻêếềễểệ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'e')
      .replace(/[òóõọỏôỗộồốổơỡờớợỡở]/g, 'o')
      .replace(/[ùúụũủưừứựữử]/g, 'u')
      .replace(/[ýỳỹỷỵ]/g, 'y')
      .replace(/[đ]/g, 'd')
      .replace(/[~\`!@#$%^&*()--+={}\\|:\'\"<,>.?/”“‘’„‰‾–—]/g, '')
  )
}
String.prototype.removeChars = function () {
  return this.replace(/[~`!@#$%^&*()\[{}\]\\|:\'\",<>./?]/g, '')
}

String.prototype.toHtml = function () {
  if (!this) return this
  const el = document.createElement('div')
  el.innerHTML = this
  return el//el.firstChild.data
}

String.prototype.trimChars = function (char: string) {
  const regx = new RegExp(char + '$', 'g')
  return this.replace(regx, '')
}

Array.prototype.pushIfNotExist = function (element: Array<string> | string, key: string) {
  if (Array.isArray(element)) {
    element.forEach((e) => {
      if (key) {
        if (this.findIndex((x) => x[key] === e[key]) < 0) this.push(e)
      } else {
        if (this.indexOf(e) < 0) this.push(e)
      }
    })
  } else {
    if (key) {
      if (this.findIndex((x) => x[key] === element[key]) < 0) this.push(element)
    } else {
      if (this.indexOf(element) < 0) this.push(element)
    }
  }
  return this
}

Array.prototype.pushIfNotExistUpdate = function (element: Array<string> | string, key: string) {
  if (Array.isArray(element)) {
    element.forEach((e) => {
      if (key) {
        const item = this.find((x) => x[key] === e[key])
        if (item) {
          Object.keys(item).forEach((k) => {
            item[k] = e[k]
          })
        } else this.push(e)
      } else {
        if (this.indexOf(e) < 0) this.push(e)
      }
    })
  } else {
    if (key) {
      const item = this.find((x) => x[key] === element[key])
      if (item) {
        Object.keys(item).forEach((k) => {
          item[k] = element[k]
        })
      } else this.push(element)
      // if (this.findIndex(x => x[key] === element[key]) < 0) this.push(element)
    } else {
      if (this.indexOf(element) < 0) this.push(element)
    }
  }
  return this
}

Array.prototype.sum = function (key: string) {
  let total = 0
  if (key) {
    for (let i = 0, length = this.length; i < length; i++) {
      const number = parseInt(this[i][key])
      if (number) total = total + number
    }
  } else {
    for (let i = 0, length = this.length; i < length; i++) {
      const number = parseInt(this[i])
      if (number) total = total + number
    }
  }
  return total
}

Array.prototype.distinctArry = function () {
  return [...new Set(this)]
}

Array.prototype.distinctArrayObject = function (key: string) {
  return [...new Set(this.map(x => x[key]))]
}

Array.prototype.max = function () {
  return Math.max.apply(null, this)
}

Array.prototype.min = function () {
  return Math.min.apply(null, this)
}

export { };
