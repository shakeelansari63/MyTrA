import AsyncStorage from "@react-native-async-storage/async-storage";

type HasId = {
  id: string;
};

export const saveRowToStore = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getRowFromStore = async (key: string): Promise<any | null> => {
  const storedData = await AsyncStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
};

export const saveRowToListStore = async <T extends HasId>(
  key: string,
  value: T,
) => {
  // Get the Stored LLMs List
  const storedData = await AsyncStorage.getItem(key);

  // LLMs List
  let dataList: T[] = [];

  // Save new LLM if there is none in db
  if (storedData) {
    dataList = JSON.parse(storedData) as T[];
  }

  // Check if input LLM is already there in list
  const dataExist = dataList.find((l) => l.id === value.id);

  // Update or insert new LLM
  if (dataExist) {
    dataList = [value, ...dataList.filter((l) => l.id !== value.id)];
  } else {
    dataList = [value, ...dataList];
  }

  // Save to async storage
  await AsyncStorage.setItem(key, JSON.stringify(dataList));
};

export const getAllRowsFromListStore = async <T extends HasId>(
  key: string,
): Promise<T[]> => {
  const storedData = await AsyncStorage.getItem(key);
  return storedData ? (JSON.parse(storedData) as T[]) : [];
};

export const getRowByIdFromListStore = async <T extends HasId>(
  key: string,
  id: string,
): Promise<T | null> => {
  const storedData = await AsyncStorage.getItem(key);

  // Check if store has value
  if (!storedData) return null;

  // Parse stored data and find item by id
  const dataList = JSON.parse(storedData) as T[];
  return dataList.find((item) => item.id === id) || null;
};
