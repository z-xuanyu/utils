import {openWindow} from "./common";
import SparkMD5 from "spark-md5";

declare type Nullable<T> = T | null;
declare type TargetContext = "_self" | "_blank";
/**
 * @description: base64 to blob
 */
export function dataURLtoBlob(base64Buf: string): Blob {
  const arr = base64Buf.split(",");
  const typeItem = arr[0];
  const mime = typeItem.match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}

/**
 * img url to base64
 * @param url
 */
export function urlToBase64(url: string, mineType?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement(
      "CANVAS"
    ) as Nullable<HTMLCanvasElement>;
    const ctx = canvas!.getContext("2d");

    const img = new Image();
    img.crossOrigin = "";
    img.onload = function () {
      if (!canvas || !ctx) {
        return reject();
      }
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(mineType || "image/png");
      canvas = null;
      resolve(dataURL);
    };
    img.src = url;
  });
}

/**
 * Download online pictures
 * @param url
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByOnlineUrl(
  url: string,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  urlToBase64(url).then((base64) => {
    downloadByBase64(base64, filename, mime, bom);
  });
}

/**
 * Download pictures based on base64
 * @param buf
 * @param filename
 * @param mime
 * @param bom
 */
export function downloadByBase64(
  buf: string,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  const base64Buf = dataURLtoBlob(buf);
  downloadByData(base64Buf, filename, mime, bom);
}

/**
 * Download according to the background interface file stream
 * @param {*} data
 * @param {*} filename
 * @param {*} mime
 * @param {*} bom
 */
export function downloadByData(
  data: BlobPart,
  filename: string,
  mime?: string,
  bom?: BlobPart
) {
  const blobData = typeof bom !== "undefined" ? [bom, data] : [data];
  const blob = new Blob(blobData, {type: mime || "application/octet-stream"});

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement("a");
  tempLink.style.display = "none";
  tempLink.href = blobURL;
  tempLink.setAttribute("download", filename);
  if (typeof tempLink.download === "undefined") {
    tempLink.setAttribute("target", "_blank");
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
}

/**
 * Download file according to file address
 * @param {*} sUrl
 */
export function downloadByUrl({
  url,
  target = "_blank",
  fileName,
}: {
  url: string;
  target?: TargetContext;
  fileName?: string;
}): boolean {
  const isChrome =
    window.navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
  const isSafari =
    window.navigator.userAgent.toLowerCase().indexOf("safari") > -1;

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error("Your browser does not support download!");
    return false;
  }
  if (isChrome || isSafari) {
    const link = document.createElement("a");
    link.href = url;
    link.target = target;

    if (link.download !== undefined) {
      link.download =
        fileName || url.substring(url.lastIndexOf("/") + 1, url.length);
    }

    if (document.createEvent) {
      const e = document.createEvent("MouseEvents");
      e.initEvent("click", true, true);
      link.dispatchEvent(e);
      return true;
    }
  }
  if (url.indexOf("?") === -1) {
    url += "?download";
  }

  openWindow(url, {target});
  return true;
}

interface HASHFileType {
  buffer: Buffer;

  HASH: string;

  suffix: string;

  filename: string;
}

/**
 *
 * @param file
 * @returns
 * 根据内容生成hash名字
 */
export function generateHashFileBuffer(file: File): Promise<HASHFileType> {
  return new Promise((resolve) => {
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e: any) => {
      let buffer = e.target.result;
      const spark = new SparkMD5.ArrayBuffer();
      spark.append(buffer);
      const HASH = spark.end();
      let suffix: any = /\.([0-9a-zA-Z]+)$/;
      suffix = suffix.exec(file.name)[1];
      resolve({
        buffer,
        HASH,
        suffix,
        filename: `${HASH}.${suffix}`,
      });
    };
  });
}

/**
 *
 * @param file 切片的文件
 * @param size 每个切片的大小，默认 2M
 * @returns
 * 大文件分片
 */
export async function splitFileChunks(_file: File, size = 2) {
  let chunkList = [];
  // let alreadyChunkList = [];
  let maxSize = 1024 * 1024 * size;
  let maxCount = Math.ceil(_file.size / maxSize); // 最大允许分割的切片数量为30
  let index = 0;
  const {HASH, suffix} = await generateHashFileBuffer(_file);
  // // 判断当前文件可以切出多少切片
  // if (maxCount > 10) {
  //   // 如果切片数量大于最大值
  //   maxSize = _file.size / 10; // 则改变切片大小
  //   maxCount = 10;
  // }
  while (index < maxCount) {
    chunkList.push({
      file: _file.slice(index * maxSize, (index + 1) * maxSize),
      filename: `${HASH}_${index + 1}.${suffix}`,
    });
    index++;
  }
  return chunkList;
}
