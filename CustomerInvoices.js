import { Alert, Text, ScrollView, Button } from "react-native";
import { DataTable, ActivityIndicator } from "react-native-paper";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

import { getBaseAPIUrl } from "./endpoints/endpoints";


function CustomerInvoices({route, navigation}) {

    // Get parms
    const {customer, updateInvoicesChange} = route.params;

    //console.log(route);

    // to render the month name
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const getMonth = (dateString) => { // dateString: "YYYY-MM-DD"
        const monthString = months[parseInt(dateString.substring(5, 7)) - 1];
        return monthString;
    }     

    const [currentInvoices, setCurrentInvoices] = useState([]);
    const [loadingInvoices, setLoadingInvoices] = useState(false);

    const [loadingSendInvoiceEmail, setLoadingSendInvoiceEmail] = useState(false);

    const [inv_id, setInv_id] = useState(0); // invoice id selected to send by email

    const paymentMethodDescription = (label) => {
        switch (label) {
            case 'E': return 'Efectivo';
            case 'T': return 'Transf. Bancaria';
            case 'M': return 'Mercado Pago';
        }
    } 

    const sendInvoiceInPDFByEmail = async (inv_id) => {
        try {
            setLoadingSendInvoiceEmail(true);
            
            const url = await getBaseAPIUrl();
            // const response =  await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/InvoicesAPI/SendInvoicePDF?inv_id=${inv_id}`);
            const response =  await fetch(`${url}/InvoicesAPI/SendInvoicePDF?inv_id=${inv_id}`);
    
            const json = await response.json();
            // console.log(json);
        
            // client has not associated email or there was a problem retrieving the invoice
            if (json.SDTInvoice === undefined) {
                // alert(json.Messages[0].Description);
                // setLoadingCountInvoiceEmailSent(false);
                Alert.alert(json.Messages[0].Description);
                return;
            } 
    
            const newCurrentInvoices = currentInvoices.map((e) => {
                if (e.inv_id === inv_id) {
                    return json.SDTInvoice;
                } else {
                    return e;
                }  
            });
            setCurrentInvoices(newCurrentInvoices);
            setLoadingSendInvoiceEmail(false);
            Alert.alert(json.Messages[0].Description);
        } catch (error) {
            console.log(error);
            Alert.alert(`Error: ${error}`);
        }
    }    

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
        
            try {
                const fetchInvoices = async () => {
                    setLoadingInvoices(true);
                    const url = await getBaseAPIUrl();
                    // const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/InvoicesAPI/List?cust_id=${customer.cust_id}&page_number=1&page_size=10`);
                    const response = await fetch(`${url}/InvoicesAPI/List?cust_id=${customer.cust_id}&page_number=1&page_size=10`);
                    const json = await response.json();
                    setCurrentInvoices(json.SDTInvoices);
                    setLoadingInvoices(false);
                }
                fetchInvoices();
                
            } catch (error) {
                console.log(error);
                Alert.alert(`Error: ${error}`);
                //navigation.navigate('ErrorCustomersNavigation');
            }  
      
            return () => {
                isActive = false;
          };
        }, [])
      );     
 
    return (
        <ScrollView>
           
          {loadingInvoices ? <ActivityIndicator style={{paddingTop:20}} animating={true}/>
          :
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Date</DataTable.Title>
                    <DataTable.Title>Month</DataTable.Title>
                    <DataTable.Title>F. pago</DataTable.Title>
                    <DataTable.Title>Total</DataTable.Title>
                    <DataTable.Title>Emails sent</DataTable.Title>
                </DataTable.Header>

                {currentInvoices && currentInvoices.map((invoice, index) => 
                
                    <DataTable.Row 
                        key={index} onPress={() => Alert.alert('Invoice details not implemented yet')}
                        style={{borderWidth: 1, borderColor: 'black'}}
                    >
                        <DataTable.Cell>{invoice.inv_date}</DataTable.Cell>
                        <DataTable.Cell>{getMonth(invoice.inv_date)}</DataTable.Cell>
                        <DataTable.Cell>{paymentMethodDescription(invoice.inv_payment_method)}</DataTable.Cell>
                        <DataTable.Cell>{invoice.inv_total}</DataTable.Cell>
                        <DataTable.Cell>
                            {loadingSendInvoiceEmail && invoice.inv_id === inv_id ? <ActivityIndicator animating={true}/> 
                            : 
                            <>
                            <Button 
                            icon={'plus'}
                            title="+"
                            onPress={() => {
                                Alert.alert(`Are you sure you want to send an email to the client ${customer.cust_fullname}?`, 
                                `The invoice corresponding to the payment made on ${invoice.inv_date} will be sent.`,
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            setInv_id(invoice.inv_id);
                                            sendInvoiceInPDFByEmail(invoice.inv_id);
                                        }
                                    },
                                    {
                                        text: 'Cancel'
                                    }
                                ]
                                
                            )                                
                            }}>
                            </Button>  {invoice.inv_count_pdf_send}
                           </>}
                           </DataTable.Cell>
                    </DataTable.Row>                     
                                  
                )}
            </DataTable>
            }
        </ScrollView>
    );    
}

export default CustomerInvoices;