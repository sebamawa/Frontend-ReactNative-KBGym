import { View, ScrollView, Alert} from "react-native";
import { DataTable, ActivityIndicator, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

import { useState, useEffect } from "react";

import { Months, YearsOfWork } from "../utils/dateManagment";

import { getBaseAPIUrl } from "../endpoints/endpoints";

function InvoicesPerMonth({navigation}) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [totalForTheMonth, setTotalForTheMonth] = useState(0);

    const [currentInvoices, setCurrentInvoices] = useState([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);

    useEffect(() => {

        try {
            const fetchInvoices = async () => {
              setLoadingInvoices(true);
              const url = await getBaseAPIUrl();
              // const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/InvoicesAPI/List?Year=${selectedYear}&Month=${selectedMonth+1}&page_number=1&page_size=20`);
              const response = await fetch(`${url}/InvoicesAPI/List?Year=${selectedYear}&Month=${selectedMonth+1}&page_number=1&page_size=20`);
              const json = await response.json();
              
              let total = 0;

              if (json.SDTInvoices !== undefined) {
                setCurrentInvoices(json.SDTInvoices); 
                    
                for (let i = 0; i < json.SDTInvoices.length; i++) {
                    total = total + parseInt(json.SDTInvoices[i].inv_total);
                }
              } else {
                setCurrentInvoices([]);
              }
              
              setTotalForTheMonth(total);
              setLoadingInvoices(false);
           }
            fetchInvoices();
          } catch (error) {
            console.log(error);
            Alert.alert(`Error: ${error}`);
            navigation.navigate('Home');
          }
    }, [selectedMonth, selectedYear]);    

    return (
        <ScrollView>
            <View>
                <Picker
                    selectedValue={selectedMonth}
                    onValueChange={(itemValue, itemIndex) => setSelectedMonth(itemValue)}
                    style={{backgroundColor: '#66B2FF'}}
                >
                    {Months.map((month, index) => (
                        <Picker.Item 
                            key={index}
                            label={month}
                            value={index}
                        />
                    ))}
                </Picker>
                <Picker
                    selectedValue={selectedYear}
                    onValueChange={(itemValue, itemIndex) => setSelectedYear(itemValue)}
                    style={{backgroundColor: '#99FFFF'}}
                >
                    {YearsOfWork.map((year, index) => (
                        <Picker.Item 
                            key={index}
                            label={year.toString()}
                            value={year}
                        />
                    ))}
                </Picker>   
            </View> 
            <View>
                {loadingInvoices ? <ActivityIndicator style={{paddingTop:20}} animating={true}/>
                :
                <>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>#</DataTable.Title>
                            <DataTable.Title>Date</DataTable.Title>
                            <DataTable.Title>Customer</DataTable.Title>
                            <DataTable.Title>Total</DataTable.Title>
                        </DataTable.Header>

                        {currentInvoices && currentInvoices.map((invoice, index) => 
                        
                            <DataTable.Row key={index} onPress={() => Alert.alert('Invoice details still not visible')}>
                                <DataTable.Cell style={{flex: 0.2}}>{index+1}:</DataTable.Cell>
                                <DataTable.Cell style={{flex: 0.8}}>{invoice.inv_date}</DataTable.Cell>
                                <DataTable.Cell>{invoice.inv_cust_fullname}</DataTable.Cell>
                                <DataTable.Cell>${invoice.inv_total}</DataTable.Cell>
                            </DataTable.Row>                     
                                        
                        )}
                    </DataTable>
                    <Text style={{paddingTop:20, textAlign:'center', fontSize:16, fontWeight:'bold'}}>Total for the month: ${totalForTheMonth}</Text> 
                </>
            }                
            </View>        
        </ScrollView>
    );
}

export default InvoicesPerMonth;