/**
 * ปัญหาใหญ่ ๆ ที่ต้องแก้
 * [*] ปัญหาเรื่องการโหลด pkg มาตัว plugin ยังไม่รู้ว่ามันต้องทำยังไง
 * [*] ปัญหาเรื่องถ้ามีการ import หรือ require pkg มาภายใน code มันจะต้องทำยังไง ซึ่งบางที
 *    path ของมันก็เป็น ../ หรือ ./ แต่เราต้องการเป็น /<ชื่อ pkg> (Relative path)
 * [*] ปัญหาเรื่องถ้าใน pkg มันต้องการ pkg อื่นที่อยู่ในโฟลเดอร์มันจะไม่สามารถไปดึง pkg มาได้
 */

import * as esbuild from "esbuild-wasm";
import axios from "axios";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // #อันเก่าก่อนแก้เรื่องปัญหาไม่รู้ว่าจะไปโหลด pkg มาได้ยังไง
      // build.onResolve({ filter: /.*/ }, async (args: any) => {
      //   console.log("onResolve", args);
      //   return { path: args.path, namespace: "a" };
      // });

      // onResolve ตัวใหม่ที่แก้ปัญหาเรื่องโหลด pkg
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        if (args.path === "index.js") {
          return { path: args.path, namespace: "a" };
        }
        // else if (args.path === "tiny-test-pkg")
        //   return {
        //     path: "https://unpkg.com/tiny-test-pkg@1.0.0/index.js",
        //     namespace: "a",
        //   };
        //  แก้ใหม่จากข้างบนเป็นข้างล่าง

        // แก้ปัญหาเรื่อง Relative path
        if (args.path.includes("./") || args.path.includes("../")) {
          return {
            //  แก้ปัญหาข้อ 3
            path: new URL(
              args.path,
              "https://unpkg.com" + args.resolveDir + "/"
            ).href,
            namespace: "a",
          };
        }

        return { path: `https://unpkg.com/${args.path}`, namespace: "a" };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            // ปัญหาคือตอนนี้ตัว unpkg ไม่รู้ว่าต้องไปโหลด tiny-path-pkg มาได้ยังไง
            // แก้ตัว onResolve ใหม่นิดหน่อย
            contents: `
              const message = require('nested-test-pkg');
              console.log(message);
            `,
          };
        }

        // แก้ปัญหาเรื่องโหลด pkg
        const { data, request } = await axios.get(args.path);
        console.log(request);

        return {
          loader: "jsx",
          contents: data,
          // แก้ปัญหาข้อ 3
          resolveDir: new URL("./", request.responseURL).pathname,
        };
      });
    },
  };
};
