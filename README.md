## 简介

- `@z-xuanyu/utils` 前端开发常用的工具函数

## 安装

```bash
# npm
$ npm i @z-xuanyu/utils

# yarn
$ yarn add @z-xuanyu/utils

# pnpm
$ pnpm add @z-xuanyu/utils
```

## 使用

```typescript
### 判断数据类型
import {isNumber} from "@z-xuanyu/utils";

const num = 3;
// 判断num是否位number类型
isNumber(num);

API方法：
isNumber -- 是否为数字类型
isDef -- 是否为undefined
isUnDef -- 不是undefined
isObject -- 是否Object
isEmpty -- 是否为空
isDate -- 是否为Date
isNull -- 是否null
isNullAndUnDef -- 是否为null并且undefined
isNullOrUnDef -- 是否为null或者undefined
isPromise -- 是否为Promise
isString -- 是否为String
isFunction -- 是否为Function
isBoolean -- 是否为Boolean
isRegExp -- 是否为RegExp
isArray -- 是否为Array
isWindow -- 是否为Window
isElement -- 是否为Element
isMap -- 是否为Map
isServer -- 是否为Server
isClient -- 是否为Client
isUrl -- 是否为url
isHexColor -- 判断是否 十六进制颜色值. 输入形式可为 #fff000 #f00

### Color 相关 API
rgbToHex -- RGB 颜色值转换为 十六进制颜色值. r, g, 和 b 需要在 [0, 255] 范围内
hexToRGB -- 将HEX颜色转换为RGB
```

## License

- Copyright © 2023-PRESENT [@z-xuanyu](https://github.com/z-xuanyu)
