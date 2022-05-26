/**
 * ปัญหาใหญ่ ๆ ที่ต้องแก้
 * [*]  ปัญหาเรื่องการโหลด pkg มาตัว plugin ยังไม่รู้ว่ามันต้องทำยังไง
 * [*]  ปัญหาเรื่องถ้ามีการ import หรือ require pkg มาภายใน code มันจะต้องทำยังไง ซึ่งบางที
 *      path ของมันก็เป็น ../ หรือ ./ แต่เราต้องการเป็น /<ชื่อ pkg> (Relative path)
 * [*]  ปัญหาเรื่องถ้าใน pkg มันต้องการ pkg อื่นที่อยู่ในโฟลเดอร์มันจะไม่สามารถไปดึง pkg มาได้
 * [*]   เก็บข้อมูลของ pkg ที่เคยเรียกใช้งานไว้ก่อนหน้าแล้วไว้เพื่อเพิ่มประสิทธิภาพ ถ้ายังไม่เคยเรียกให้เรียกใช้งานก่อน
 *      แล้วก็ค่อยเอามาเก็บไว้ใน cache => indexedDB (localforage)
 * []   รองรับ css
 */

import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

// initial localForage
const fileCache = localForage.createInstance({
  name: "filecache",
});

export const unpkgPathPlugin = (inputCode: string) => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // #อันเก่าก่อนแก้เรื่องปัญหาไม่รู้ว่าจะไปโหลด pkg มาได้ยังไง
      // build.onResolve({ filter: /.*/ }, async (args: any) => {
      //   console.log("onResolve", args);
      //   return { path: args.path, namespace: "a" };
      // });

      // Handle root entry file of 'index.js'
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      // onResolve ตัวใหม่ที่แก้ปัญหาเรื่องโหลด pkg
      // แก้ปัญหาเรื่อง Relative path
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          //  แก้ปัญหาข้อ 3
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
          namespace: "a",
        };
      });

      // Handle main file of module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return { path: `https://unpkg.com/${args.path}`, namespace: "a" };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            // ปัญหาคือตอนนี้ตัว unpkg ไม่รู้ว่าต้องไปโหลด tiny-path-pkg มาได้ยังไง
            // แก้ตัว onResolve ใหม่นิดหน่อย
            contents: inputCode,
          };
        }

        // ตรวจสอบว่ามีการ fetch ข้อมูลของ pkg นี้แล้วหรือยัง
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        // ถ้ามันมีแล้วใน cache
        if (cachedResult) {
          return cachedResult;
        }

        // แก้ปัญหาเรื่องโหลด pkg
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          // แก้ปัญหาข้อ 3
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        // เก็บข้อมูลไว้ใน cache
        // ใช้ args.path เป็น key เพราะว่ามัน unique อยู่แล้ว
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
