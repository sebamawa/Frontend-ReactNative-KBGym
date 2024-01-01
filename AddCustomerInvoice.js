import React, { useEffect, useState } from 'react'
import DatePicker from 'react-native-date-picker'
import { Alert, ScrollView, Text, View, TextInput, Image, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Button, ActivityIndicator } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { DataTable } from 'react-native-paper';

import { getBaseAPIUrl } from './endpoints/endpoints';

function AddCustomerInvoice({navigation, route}) {

    const {customer} = route.params;

    const [inv_date, setInv_date] = useState(new Date()); // TODO: set date to today
    const datePlus30Days = (date) => { 
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 30);
        return newDate;
    }
    const [inv_next_expiration_date, setInv_next_expiration_date] = useState(datePlus30Days(inv_date)); 
    const [edit_inv_expiration_date, setInv_edit_expiration_date] = useState(false);
    const [inv_total, setInv_total] = useState(0);

    const [loadingInvoiceInserted, setLoadingInvoiceInserted] = useState(false);    

    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [selectedService, setSelectedService] = useState(null);

    const[invitem_descrip, setInvitem_descrip] = useState('');
    const [invitem_price, setInvitem_price] = useState(0);
    const [payment_method, setPayment_method] = useState('E'); // TODO: payment method
    const payment_methods = [
        {label: 'Efectivo', value: 'E'},
        {label: 'Transferencia', value: 'T'},
        {label: 'Mercado Pago', value: 'M'}
    ];

    const [itemsInvoice, setItemsInvoice] = useState([]);
    const [countItemsInvoice, setCountItemsInvoice] = useState(0);

    const addInvoiceItem = () => {
        setItemsInvoice([...itemsInvoice, {id: countItemsInvoice, invitem_type: 1, invitem_serv_id: selectedService.serv_id, invitem_price: selectedService.serv_price, invitem_quantity: 1, invitem_prod_id: 0, invitem_descrip: invitem_descrip, invitem_price: invitem_price}]);
        setCountItemsInvoice(countItemsInvoice + 1);

        const total = inv_total + parseInt(invitem_price);
        setInv_total(total); // update total TODO: * serv_quantity         
    }

    const removeInvoiceItem = (id) => {
        setCountItemsInvoice(countItemsInvoice - 1); // 1 linea de factura menos
        // update total
        const itemLine = itemsInvoice.find(item => item.id === id); 
        setItemsInvoice(itemsInvoice.filter(item => item.id !== id)); // elimino item de itemsInvoice
        setInv_total(inv_total - parseInt(itemLine.invitem_price));
    } 
    
    const styles = StyleSheet.create({
        container: {
          flex: 1,
          paddingTop: 0,
        },
        centered: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          //backgroundColor: "#ffc2c2",
        },
        border: {
          borderWidth: 1,
          paddingTop: 5,
          paddingBottom: 5
        },
        title: {
          fontSize: 18,
          marginVertical: 2,
        },
        subtitle: {
          fontSize: 14,
          color: "#888",
        },
        roundButton: {
          width: 100,
          height: 100,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 10,
          borderRadius: 40,
          backgroundColor: 'orange',
        }       
      });     

    const submit = async () => {

        //console.log(inv_date.getDate());
        //console.log(inv_date.getTimezoneOffset());
        //return;
        // remuevo id de los objetos del array de items
        const itemsToSend = itemsInvoice.map(({id, ...keepAttrs}) => keepAttrs);
        
         try {
            setLoadingInvoiceInserted(true);
                const url = await getBaseAPIUrl();
            // const response =  await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/InvoicesAPI/Insert`, {
                const response =  await fetch(`${url}/InvoicesAPI/Insert`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    SDTInvoice: {
                        inv_date: new Date(inv_date.getFullYear(), inv_date.getMonth(), inv_date.getDate()),
                        inv_cust_id: customer.cust_id,
                        inv_payment_method: payment_method, 
                        inv_next_expiration_date: inv_next_expiration_date,
                        Items: itemsToSend // Items
                    }
                })
            });

            const json = await response.json();
            // console.log(json);
            const msgTypeResponse = json.Messages[0].Type;
            if (msgTypeResponse === 2) {
                setLoadingInvoiceInserted(false);
                //updateCustomerInvoices(); // update invoices list in CustomerDetailsPage
                //swapInvoicesListAddInvoice(); // swap to invoices list
                //alert(`Invoice inserted successfully for customer ${customer.cust_fullname}`);
                Alert.alert(`Invoice inserted successfully for customer ${customer.cust_fullname}`);
                // navigation.navigate('Customer Invoices', {customer: customer});   
            } else {
                // alert(`Error inserting invoice for customer ${customer.cust_fullname}`);
                Alert.alert(`Error inserting invoice for customer ${customer.cust_fullname}`);   
                // navigation.navigate('Home');    
            }

        } catch (error) {
            console.log(error);
            Alert.alert(`Error: ${error}`);
            // navigation.navigate('ErrorCustomersNavigation');          
        }
    }    

    useEffect(() => {
        (async() => {   
         try {
           setLoadingServices(true);
           
           const url = await getBaseAPIUrl();
           // const response = await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/ServicesAPI/List?serv_type_id=2`);
           const response = await fetch(`${url}/ServicesAPI/List?serv_type_id=2`);
          
           const json = await response.json();
           setServices(json.SDTServices);
           const firstServ = json.SDTServices[0];
           setSelectedService(firstServ);
           setInvitem_descrip(firstServ.serv_descrip);
           setInvitem_price(firstServ.serv_price);
           setLoadingServices(false);
           // console.log(selectedService);
         } catch (error) {
            console.log(error);
            Alert.alert(`Error: ${error}`);
            navigation.navigate('ErrorCustomersNavigation');
         }  
   })(); 
   }, []);       

    return (
        <ScrollView>
            <View>
                <Text style={{fontWeight: "bold"}}>Invoice Date:</Text>
                <DatePicker 
                    style={{ transform: [{scale:0.8}] }} 
                    date={inv_date} 
                    mode="date" 
                    onDateChange={setInv_date} />
                <Text style={{fontWeight: "bold"}}>Customer:</Text>    
                <View style={[{flexDirection: 'row'}, {paddingTop: 5}]}>
                    <Text style={{fontWeight: "bold"}}>{customer.cust_fullname}</Text> 
                    <Image 
                        source={{uri: customer.cust_image}}
                        style={{width: 40, height: 40}}
                    />
                    <View>
                        <View style={[{flexDirection: 'row'}]}>
                        <Text>{" Paga fuera de periodo: "}</Text>
                        <CheckBox
                            value={customer.cust_pay_out_of_period}
                            enabled={false}
                            // onValueChange={(value) => 
                            //     setCust_pay_out_of_period(value)}
                        /> 
                        </View>  
                        <Text>{`Fecha límite pago: ${customer.cust_payday_limit}`}</Text>
                    </View>
                </View>  
            </View>

            <View>
                <Text>Services</Text>
                {loadingServices ? <Text>Loading...</Text> : (
                    <View>
                        <Picker
                            selectedValue={selectedService.serv_id}
                            onValueChange={(itemValue, itemIndex) => {
                                const actualServ = services.find((serv) => serv.serv_id === parseInt(itemValue));
                                setSelectedService(actualServ);
                                setInvitem_descrip(actualServ.serv_descrip);
                                setInvitem_price(actualServ.serv_price);
                            }}
                        >
                            {services.map((service, index) => (
                                <Picker.Item 
                                    key={index} 
                                    label={service.serv_descrip} 
                                    value={service.serv_id}
                                    
                                />
                            ))}
                        </Picker>
                        <View style={[{flexDirection: "row"}]}>
                            <TextInput value={invitem_descrip} />
                            <TextInput value={`$ ${invitem_price}`}/>
                            <Button 
                                icon={'plus'}
                                title="Add Item"
                                onPress={() => {addInvoiceItem();}}
                            >
                            </Button>                                                        
                        </View>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Descrip.</DataTable.Title>
                                <DataTable.Title>Price</DataTable.Title>
                                <DataTable.Title></DataTable.Title>
                            </DataTable.Header>

                            {itemsInvoice.map((invoice, index) => 
                            
                                <DataTable.Row key={index} onPress={() => Alert.alert('Pressed ok')}>
                                    <DataTable.Cell>{invoice.invitem_descrip}</DataTable.Cell>
                                    <DataTable.Cell>{invoice.invitem_price}</DataTable.Cell>
                                    <DataTable.Cell>
                                        <Button 
                                            icon={'delete'}
                                            title="X"
                                            onPress={() => {removeInvoiceItem(invoice.id);}}
                                        >
                                        </Button> 
                                    </DataTable.Cell>
                                </DataTable.Row>                     
                                            
                            )}
                        </DataTable>   

                        <View style={styles.container}>
                            <View style={{flexDirection: "row"}}>
                                {/* <View style={[{flex: 0.6}, {maxHeight: 50}]}> */}
                                    <Picker 
                                        style={[{flex: 0.6}]}
                                        selectedValue={payment_method}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setPayment_method(itemValue);
                                        }}
                                    >
                                        {payment_methods.map((pay_method, index) => (
                                            <Picker.Item 
                                                key={index} 
                                                label={pay_method.label} 
                                                value={pay_method.value}
                                                
                                            />
                                        ))}
                                    </Picker> 
                                    <View style={{flex: 0.4}}>
                                        <Text style={[{alignSelf: 'center'}, {fontSize: 20}, {fontWeight: 'bold'}, {paddingTop: 6}]}>{`Total: $${inv_total}`}</Text>
                                    </View>
                            </View>
                        </View>
                        <View style={{flexDirection: "row"}}>
                            <Text>{`Fecha de vencimiento: ${inv_next_expiration_date.getFullYear()}-${inv_next_expiration_date.getMonth() + 1}-${inv_next_expiration_date.getDate()}`}</Text>
                            <Button 
                                icon={'pencil'}
                                title="Add Item"
                                onPress={() => setInv_edit_expiration_date(!edit_inv_expiration_date)}
                            >
                            </Button> 
                        </View>
                        {edit_inv_expiration_date ? 
                                <DatePicker 
                                style={{ transform: [{scale:0.8}] }} 
                                date={inv_next_expiration_date} 
                                mode="date" 
                                onDateChange={setInv_next_expiration_date} />     
                            : null                               
                        }                        
                    </View>
                )}    
            </View>
            {loadingInvoiceInserted ? <ActivityIndicator style={{paddingTop:20}} animating={true}/> : 
            (
                <Button
                    style={[{backgroundColor: itemsInvoice.length === 0 ? 'gray' : 'green'}, {marginTop: 10}, {borderColor: 'black'}, {borderWidth: 1}]}
                    title="Save"
                    labelStyle={{ color: "black", fontSize: 18 }}
                    disabled={itemsInvoice.length === 0 ? true : false}
                    onPress={() => submit()}
                >Save</Button>
            )}
        </ScrollView>
    );
}

export default AddCustomerInvoice;