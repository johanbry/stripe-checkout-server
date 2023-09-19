import { readParseJSONFile, saveJSONFile } from ".";
import { IServerUser } from "../interfaces/interfaces";

const USERS_FILE = "data/users.json";

export const saveUsers = async (users: IServerUser[]) => {
  try {
    saveJSONFile(USERS_FILE, users);
  } catch (error) {
    throw error;
  }
};

export const readUsers = async (): Promise<IServerUser[] | null> => {
  try {
    let users: IServerUser[] | null = null;
    users = await readParseJSONFile(USERS_FILE);
    return users;
  } catch (error) {
    throw error;
  }
};
