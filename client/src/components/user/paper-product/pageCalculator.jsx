import JSZip from 'jszip'
import { parseString } from "./xml-parseString"; // Adjust the path as necessary

const pageCalculator = async (files) => {
  const processFile = async (file) => {
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Function to read and process the file
    const readFile = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = async () => {
          const content = reader.result;
          if (fileExtension === "pdf") {
            const pageCount =
              content.match(/\/Type[\s]*\/Page[^s]/g)?.length || 0;
            resolve(pageCount);
          } else {
            resolve(1); // Default to 1 for non-PDF files (e.g., images)
          }
        };
        reader.onerror = (error) =>
          reject(`FileReader error: ${error.message}`);
        reader.readAsBinaryString(file); // Use readAsBinaryString for PDFs
      });
    };

    if (["pdf", "jpg", "jpeg", "png"].includes(fileExtension)) {
      // Handle PDFs and image files
      const pageCount = await readFile(file);
      return {
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        format: fileExtension,
        pages: pageCount,
      };
    } else if (fileExtension === "pptx" || fileExtension === "docx") {
      // Handle .pptx and .docx files
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target.result;
            const zip = new JSZip();
            const contents = await zip.loadAsync(arrayBuffer);
            const appXmlFile = zip.file("docProps/app.xml");

            if (appXmlFile) {
              const appXmlData = await appXmlFile.async("text");
              parseString(appXmlData, (err, result) => {
                if (err) {
                  reject(`Error parsing XML: ${err}`);
                } else {
                  const properties = result["Properties"];
                  let pages;
                  if (fileExtension === "pptx") {
                    pages = properties["Slides"][0];
                  } else if (fileExtension === "docx") {
                    pages = properties["Pages"][0];
                  }
                  resolve({
                    name: file.name,
                    size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
                    format: fileExtension,
                    pages: Number(pages) || 0,
                  });
                }
              });
            } else {
              reject(`app.xml file not found in the ${fileExtension} file`);
            }
          } catch (error) {
            reject(`Error processing file: ${error.message}`);
          }
        };
        reader.onerror = (error) =>
          reject(`FileReader error: ${error.message}`);
        reader.readAsArrayBuffer(file);
      });
    } else {
      throw new Error("Unsupported file type");
    }
  };

  try {
    const filese = await Promise.all(files.map(processFile));
    return { files: filese, success: true };
    // console.log(filese);
  } catch (error) {
    return { error: error.message, success: false };
    // console.error(error.message);
  }
};

export { pageCalculator };
