import express from "express";
// file storage manager
import fs from "fs/promises";
import path from "path";

interface Cell {
  id: string;
  content: string;
  type: "text" | "code";
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());
  
  const fullPath = path.join(dir, filename);

  router.get("/cells", async (req, res) => {
    try {
      // Make sure the cell storage is exists
      // If it does not exist,  add in a default list of cells
      // Read the file

      const result = await fs.readFile(fullPath, { encoding: "utf8" });
      res.send(JSON.parse(result));
    } catch (error) {
      //  If red throw an error
      // Inspect the error, see if it says that the file doesn't exist'
      // Parse a list of cells out of it
      // Send list of cells back to the browser
      if (error instanceof Error) {
        if (error.name === "ENOENT") {
          await fs.writeFile(fullPath, "[]", "utf-8");
          res.json([]);
        } else {
          throw error;
        }
      }
    }
  });

  router.post("/cells", async (req, res) => {
    // Take the list of cells from the request object
    // serialize them
    // Array of objects
    const { cells }: { cells: Cell[] } = req.body;

    // Write the cells into the file
    await fs.writeFile(fullPath, JSON.stringify(cells), "utf-8");
    res.send({ state: "ok" });
  });

  return router;
};
