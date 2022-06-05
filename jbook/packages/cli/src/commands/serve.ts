import { Command } from "commander";

export const serveCommand = new Command()
  .command("serve")
  .description("Open a file for editing")
  .action(() => {
      console.log("Getting read to serve a file");
  });
