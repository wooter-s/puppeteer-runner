// 去除所有空格
export const trimAll = (str: string) => {
    return str.replace(/\s+/g,"")
}

export const getFunctionName = (fun: Function) => {
    return fun.name || fun.toString().match(/function\s*([^(]*)\(/)
}
