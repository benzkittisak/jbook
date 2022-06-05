import express from "express";
// file storage manager
import fs from 'fs/promises';

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();

  router.get("/cells", async () => {
    // Make sure the cell storage is exists
    // If it does not exist,  add in a default list of cells
    // Read the file
    // Parse a list of cells out of it
    // Send list of cells back to the browser
  });

  router.post("/cells", async () => {
    // Make sure the file exists
    // If not, create it
    // Take the list of cells from the request object
    // serialize them
    // Write the cells into the file
  });

  return router;
};
