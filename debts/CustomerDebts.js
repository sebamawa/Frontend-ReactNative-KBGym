import { Text, ScrollView, Alert } from 'react-native'; 
import { DataTable, ActivityIndicator, Switch } from 'react-native-paper';
import { Months, getMonthName } from "../utils/dateManagment";
import { useState, useEffect } from 'react';

import { getBaseAPIUrl } from '../endpoints/endpoints';

function CustomerDebts({route, navigation}) {

    // Get parms
    const {customer} = route.params;

    const [currentDebts, setCurrentDebts] = useState([]);
    const [loadingDebts, setLoadingDebts] = useState(false);
    const [debtToChangeStatus, setDebtToChangeStatus] = useState({});
    const [firstRender, setFirstRender] = useState(false);
    const [loadingDebtUpdated, setLoadingDebtUpdated] = useState(false);

    // to render the month name
    // const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    // const getMonth = (dateString) => { // dateString: "YYYY-MM-DD"
    //     const monthString = months[parseInt(dateString.substring(5, 7)) - 1];
    //     return monthString;
    // }     

    useEffect(() => {

        (async() => {   
         try {
           
              setLoadingDebts(true);
              const url = await getBaseAPIUrl();
              // const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/DebtsAPI/List?cust_id=${customer.cust_id}`);
              const response = await fetch(`${url}/DebtsAPI/List?cust_id=${customer.cust_id}`);
              const json = await response.json();
              setCurrentDebts(json.SDTDebts); 
              setLoadingDebts(false);
         } catch (error) {
           console.log(error);
           Alert.alert(`Error: ${error}`);
           navigation.navigate('ErrorCustomersNavigation');        
         }  
         })(); 
     }, []);    


    useEffect(() => {

        (async() => {   
         try {
           //setLoading(true);
           if (!firstRender) {
               setFirstRender(true);
               return;
           }

           setLoadingDebtUpdated(true);

           const url = await getBaseAPIUrl();
           // const response =  await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/DebtsAPI/UpdateCustomerDebtStatus`, {
            const response =  await fetch(`${url}/DebtsAPI/UpdateCustomerDebtStatus`, {
               method: 'PUT',
               headers: { 
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                   debt_id: debtToChangeStatus.debt_id,
                   debt_cancelled: debtToChangeStatus.debt_cancelled 
               })
           });

           const json = await response.json();
           
           // updateCustomerFromDebtsBool();
           setLoadingDebtUpdated(false);
           
         } catch (error) {
           console.log(error);
           Alert.alert(error);   
           navigation.navigate('ErrorCustomersNavigation');        
         }  
         })(); 
     }, [debtToChangeStatus]);    
     
     return (
        <ScrollView>
           
           {loadingDebts ? <ActivityIndicator style={{paddingTop:20}} animating={true}/>
           :
             <DataTable>
                 <DataTable.Header>
                     <DataTable.Title>Date</DataTable.Title>
                     <DataTable.Title>Month</DataTable.Title>
                     <DataTable.Title>Total</DataTable.Title>
                     <DataTable.Title>Cancelled</DataTable.Title>
                 </DataTable.Header>
 
                 {currentDebts && currentDebts.map((debt, index) => 
                 
                     <DataTable.Row 
                        style={[{backgroundColor: debt.debt_cancelled ? 'lightgreen' : 'red'}, {borderWidth: 1}]}
                        key={index} onPress={() => Alert.alert('Pressed ok')}>
                         <DataTable.Cell>{debt.debt_date}</DataTable.Cell>
                         <DataTable.Cell>{getMonthName(debt.debt_date)}</DataTable.Cell>
                         <DataTable.Cell>{debt.debt_amount_owed}</DataTable.Cell>
                         <DataTable.Cell>
                            <Switch 
                                    style={{alignSelf: "flex-end"}}
                                    value={debt.debt_cancelled}
                                    onValueChange={() => 
                                        Alert.alert('Are you sure you want to change the status?', 
                                            `The status of customer debt will be changed`,
                                            [
                                                {
                                                    text: 'OK',
                                                    onPress: () => {
                                                        // update debt status
                                                        const auxCurrentDebts = currentDebts.map(d => {
                                                            if (d.debt_id === debt.debt_id) {
                                                                const dCopy = {...d, debt_cancelled: !debt.debt_cancelled}
                                                                setDebtToChangeStatus(dCopy);
                                                                return dCopy;
                                                            }
                                                            return d;
                                                        }); 
                                                        setCurrentDebts(auxCurrentDebts);
                                                    }
                                                },
                                                {
                                                    text: 'Cancel'
                                                }
                                            ]
                                            
                                        )
                                    }
                                />
                         </DataTable.Cell>   
                     </DataTable.Row>                     
                                   
                 )}
             </DataTable>
             }
         </ScrollView>
     );
}

export default CustomerDebts;