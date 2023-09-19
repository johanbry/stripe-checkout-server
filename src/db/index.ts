import fs from "fs/promises";

export const readParseJSONFile = async (filepath: string) => {
  let data;
  try {
    const fileBuffer = await fs.readFile(filepath);
    if (fileBuffer.length > 1) data = JSON.parse(fileBuffer.toString());
  } catch (error) {
    console.error("Error open/read file: ", error);
    throw error;
  }

  return data || null;
};

export const saveJSONFile = async (filepath: string, contents: any) => {
  try {
    await fs.writeFile(filepath, JSON.stringify(contents, null, 2));
  } catch (error) {
    console.error("Error writing file: ", error);
    throw error;
  }
};
