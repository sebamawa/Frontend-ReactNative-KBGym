import AsyncStorage from "@react-native-async-storage/async-storage";

const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value)
      console.log(`${key} guardado en el storage con valor ${value}`);
    } catch (e) {
      console.log(e);
      Alert.alert(`Error al almacenar ${value} en el storage de Android: ${e}`);
    }
  }

  const retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        console.log(`${key} recuperado del storage con valor ${value}`);
        return  value;
      }
    } catch (e) {
        console.log(e);
        return null;
    }
  }; 

  export { storeData, retrieveData }