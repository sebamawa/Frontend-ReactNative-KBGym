// customers api

import { retrieveData } from "../utils/storage";

const baseLocalUrl = `http://192.168.1.5:8080/KBGymTemplateJavaMySQL`;
const baseRemoteUrl = `http://bluefitnessgimnasio.dal.togglebox.site`;

const getBaseAPIUrl = async () => {
    const remoteData = await retrieveData('remote_data');
    let url = null;
    remoteData.localeCompare('true') === 0 ? url = baseRemoteUrl : url = baseLocalUrl;
    return url;  
  }

export { getBaseAPIUrl }