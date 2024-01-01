import { View, Text, Switch } from "react-native";
import { useState } from "react";
import { storeData } from "../utils/storage";


function SettingComponent() {
    const [isEnabledSwitch, setIsEnabledSwitch] = useState(false);

    const toggleSwitch = () => setIsEnabledSwitch(previousState => !previousState);    

    return (
        <View>
            <Text>Get data from remote source (are obtained locally for default)</Text>
            <Switch 
                onValueChange={async () => {
                    toggleSwitch();
                    if (isEnabledSwitch) {
                        await storeData('remote_data', 'false');
                    } else {
                        await storeData('remote_data', 'true');
                    }
                }}
                value={isEnabledSwitch}            
            />
        </View>
    )
}

export default SettingComponent;