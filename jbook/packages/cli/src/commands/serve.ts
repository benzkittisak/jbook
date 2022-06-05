import path from "path";
import { Command } from "commander";
import { serve } from "@jsnote-kp/local-api";

const isProduction = process.env.NODE_ENV === "production";

export const serveCommand = new Command()
  .command("serve [filename]")
  .description("Open a file for editing")
  .option("-p , --port <number>", "port to run the server on ", "4005")
  .action(async (filename = "notebook.js", options: { port: string }) => {
    try {
      const dir = path.join(process.cwd(), path.dirname(filename));
      await serve(
        parseInt(options.port),
        path.basename(filename),
        dir,
        !isProduction
      );
      console.log(
        `Opened ${filename}. Navigate to http://localhost:${options.port} to edit`
      );
    } catch (error) {
      // console.log(error.messsage);
      if (error instanceof Error) {
        if (error.name === "EADDRINUSE") {
          console.error("Port is in use. Try running on a different port");
        }
      } else {
        console.log("Here is the error message", error);
      }
      process.exit(1);
    }
  });
