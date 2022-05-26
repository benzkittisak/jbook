/**
 * ปัญหาใหญ่ ๆ ที่ต้องแก้
 * [*]  ปัญหาเรื่องการโหลด pkg มาตัว plugin ยังไม่รู้ว่ามันต้องทำยังไง
 * [*]  ปัญหาเรื่องถ้ามีการ import หรือ require pkg มาภายใน code มันจะต้องทำยังไง ซึ่งบางที
 *      path ของมันก็เป็น ../ หรือ ./ แต่เราต้องการเป็น /<ชื่อ pkg> (Relative path)
 * [*]  ปัญหาเรื่องถ้าใน pkg มันต้องการ pkg อื่นที่อยู่ในโฟลเดอร์มันจะไม่สามารถไปดึง pkg มาได้
 * [*]   เก็บข้อมูลของ pkg ที่เคยเรียกใช้งานไว้ก่อนหน้าแล้วไว้เพื่อเพิ่มประสิทธิภาพ ถ้ายังไม่เคยเรียกให้เรียกใช้งานก่อน
 *      แล้วก็ค่อยเอามาเก็บไว้ใน cache => indexedDB (localforage)
 * []   รองรับ css
 * 
 * แยกส่วนของการ fetch ข้อมูลไปไฟล์ fetch-plugin
 */

import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
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
    }
  }
};
