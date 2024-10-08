import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function deleteOldFiles(directories) {
  //console.log("Delete old files started");

  const startTime = Date.now();
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  directories.forEach((dir) => {
    //console.log(`Reading directory: ${dir}`);

    fs.readdir(dir, (err, files) => {
      if (err) {
        console.error("Error reading directory:", dir, err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(dir, file);
        //console.log(`Checking file: ${filePath}`);

        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error("Error getting file stat for", filePath, err);
            return;
          }

          if (stats.mtime.getTime() < sevenDaysAgo) {
            //console.log(`File is older than 7 days: ${filePath}`);

            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error deleting file", filePath, err);
              } else {
                //console.log(`Deleted file: ${filePath}`);
              }
            });
          }
        });
      });
    });
  });

  const totalTime = Date.now() - startTime;
  //console.log(`Time taken: ${totalTime}ms`);
  writeTimeStamp(totalTime);
}

function writeTimeStamp(tt) {
  const logMessage = `Cron job completed in ${tt} ms at ${new Date().toISOString()}\n`;

  const logFilePath = path.resolve(__dirname, "../logs/cron.log");

  //console.log(`Writing to log file: ${logFilePath}`);

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Error writing logs:", err);
    } else {
      console.log("Cron log added");
    }
  });
}

cron.schedule("0 0 */7 * *", () => {
  const directoriesToClean = [
    path.resolve(__dirname, "../uploads"),
    path.resolve(__dirname, "../temp"),
  ];

  //console.log(`Directories to clean: ${directoriesToClean}`);

  deleteOldFiles(directoriesToClean);
});
