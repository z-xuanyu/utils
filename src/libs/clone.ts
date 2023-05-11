export function clone<T>(obj: T): T {
  return Object.assign({}, obj);
}

export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    const cloneArr = [];
    for (const item of obj) {
      cloneArr.push(deepClone(item));
    }
    return cloneArr as any;
  }
  const cloneObj: any = {};
  for (const key in obj) {
    if ((obj as Object).hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key]);
    }
  }
  return cloneObj as T;
}
