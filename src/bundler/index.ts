import * as esbuild from "esbuild-wasm";

import { unpkgPathPlugin } from "./plugins/unpkg.plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let service: esbuild.Service;

const bundler = async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.57/esbuild.wasm",
    });
  }

  try {
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        "process.env.NODE_ENV": '"production"',
        global: "window",
      },
    });

    return { code: result.outputFiles[0].text, err: "" };
  } catch (error) {
    if (error instanceof Error) {
      return { code: "", err: error.message };
    }
  }
};

export default bundler;
