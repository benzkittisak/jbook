import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

// initial localForage
const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
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
        // const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
        //   args.path
        // );
        // // ถ้ามันมีแล้วใน cache
        // if (cachedResult) {
        //   return cachedResult;
        // }

        // แก้ปัญหาเรื่องโหลด pkg
        const { data, request } = await axios.get(args.path);

        // ทำให้สามารถเรียกใช้งาน css ได้
        const fileType = args.path.match(/.css$/) ? "css" : "jsx";
        const contents =
          fileType === "css"
            ? `
            const style = document.createElement('style');
            style.innerText = 'body{ background-color:"red"}'
            document.head.appendChild(style)
            `
            : data;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
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
