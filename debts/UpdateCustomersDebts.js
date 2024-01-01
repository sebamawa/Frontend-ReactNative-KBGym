import { Alert, Button, ScrollView, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useState } from "react";

import { getBaseAPIUrl } from "../endpoints/endpoints";

function UpdateCustomersDebts() {

    const [loading, setLoading] = useState(false);
    const [responseMessages, setResponseMessages] = useState([]);

    const updateCustomersDebts = async () => {
        try {
            setLoading(true);
            const url = await getBaseAPIUrl();
            //const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/UpdateCustomersDebts`);
            const response = await fetch(`${url}/CustomersAPI/UpdateCustomersDebts`);
            const json = await response.json();
            setResponseMessages(json.Messages);
            setLoading(false);
            //console.log(json);
        } catch (error) {
            //console.log(error); 
            Alert.alert(`Error: ${error}`);  
        }
    }

    return (
        <ScrollView>
            <Text style={[{fontWeight: "bold"}, {padding: 10}]}>Verificar pagos y generar si corresponde deudas de clientes</Text>
            <Button
                title="Update Customers Debts"
                onPress={() => updateCustomersDebts()}
            ></Button>
            {loading ? <ActivityIndicator style={{paddingTop:20}} animating={true}/>
            : 
            <View style={{paddingTop: 10}}>
                {responseMessages && responseMessages.map((message, index) => (
                    <Text key={index} style={message.Type === 0 ? { backgroundColor: 'red'} : null}>* {message.Description}</Text>
                ))}
            </View>
            }
        </ScrollView>
    );
}

export default UpdateCustomersDebts;