import { Pressable, Text, View, StyleSheet, Alert, ScrollView } from "react-native";
import { Card, Switch, Snackbar, ActivityIndicator, Button } from "react-native-paper";

import DatePicker from "react-native-date-picker";
import CheckBox from '@react-native-community/checkbox';
import { useState } from "react";
import { getBaseAPIUrl } from "./endpoints/endpoints";

function CustomerDetails({route, navigation}) {

    // Get the param
    const {customerInit} = route.params;

    const [customer, setCustomer] = useState(customerInit);
    //const [isActive, setIsActive] = useState(customerInit.cust_active);
    const [loadingUpdateCustomer, setLoadingUpdateCustomer] = useState(false);
    //const [cust_pay_out_of_period, setCust_pay_out_of_period] = useState(customerInit.cust_pay_out_of_period);
    //const [cust_payday_limit, setCustPaydayLimit] = useState(new Date(customerInit.cust_payday_limit));
    const [openModalDataPicker, setOpenModalDataPicker] = useState(false); 

    const [visibleSnackbar, setVisibleSnackbar] = useState(false);

    const updateCustomer = (customer2) => {
        (async() => {   
            try {
              setLoadingUpdateCustomer(true);
              
              const url = await getBaseAPIUrl();
              // const response =  await fetch(`http://192.168.1.5:8080/KBGymTemplateJavaMySQL/CustomersAPI/UpdateStatus`, {
                const response =  await fetch(`${url}/CustomersAPI/UpdateCustomer`, {
                  method: 'PUT',
                  // crossDomain: true,
                  headers: { 
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({SDTCustomer: {...customer2}})
              });
   
                const json = await response.json();
                //console.log(json);
                setCustomer(json.SDTCustomerOut);
                setLoadingUpdateCustomer(false);
                setVisibleSnackbar(true);
              
            } catch (error) {
              console.log(error);
              Alert.alert(`Error: ${error}`);
              //navigation.navigate('ErrorCustomersNavigation');
            }  
            })();    
    }

    // useEffect(() => {
    //     updateCustomer();
    // }, [customer])

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "column",
            padding: 5,
          },
          centered: {
            justifyContent: "center",
            alignItems: "center",
            //paddingTop: 10
            //backgroundColor: "#ffc2c2",
          }    
    })
    
    return (
        <ScrollView>
        <View style={[styles.container]}>
            <Pressable>

                <Card style={[styles.centered, customer.cust_has_debt ? {backgroundColor: "red"} : (customer.cust_monthly_serv_pending ? {backgroundColor: "yellow"} : {backgroundColor: "lightgreen"})]}>
                    <Card.Title title={customer.cust_fullname}/>
                    <Card.Content>  
                        <Text>CI: {customer.cust_identification}</Text>                 
                        <Text>Phone: {customer.cust_phone}</Text> 
                        
                        <View style={{flexDirection: 'row'}}>
                        <Text style={{paddingTop: 5}}>Pay out of period</Text>
                        {loadingUpdateCustomer ? <ActivityIndicator animating={true} size='small' style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}/>
                        :                        
                            <CheckBox
                                value={customer.cust_pay_out_of_period}
                                tintColors={{ true: 'blue', false: 'black' }}
                                onValueChange={(value) => {
                                    Alert.alert(`Are you sure you want to change the customer's payment period?`, 
                                    ``,
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                // setCustomer({...customer, cust_pay_out_of_period: value}); // no update the state
                                                updateCustomer({...customer, cust_pay_out_of_period: value});
                                            }
                                        },
                                        {
                                            text: 'Cancel',
                                            onPress: () => {
                                                
                                            }
                                        }
                                    ]
                                    
                                )
                                }}
                                
                            />     
                        }
                        </View> 
                        {loadingUpdateCustomer ? <ActivityIndicator animating={true} size='small' style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}/>                       
                        :
                        <View style={{flexDirection: "row"}}>
                            <Text style={{fontWeight: "bold"}}>Payday limit: {customer.cust_payday_limit === "0000-00-00" ? "-" : customer.cust_payday_limit}</Text> 
                            <Button 
                                    icon="pencil"
                                    title="Add Item"
                                    onPress={() => setOpenModalDataPicker(true)}
                            ></Button>
                        </View> 
                        }
                        <View style={{flexDirection: "row"}}>
                            <DatePicker 
                                title={"Select the payment deadline for the client"}
                                timeZoneOffsetInMinutes={60}
                                modal={true}
                                open={openModalDataPicker}
                                style={{ transform: [{scale:0.8}] }} 
                                date = {new Date(customer.cust_payday_limit)
                                }
                                mode="date" 
                                //onDateChange={setCustPaydayLimit}
                                onConfirm={(date) => {
                                    setOpenModalDataPicker(false)
                                    updateCustomer({...customer, cust_payday_limit: date});
                                    // setCustomer({...customer, cust_payday_limit: date}); // no update the state
                                }}
                                    onCancel={() => {
                                    setOpenModalDataPicker(false)}
                                }  
                                ></DatePicker>                       
                            
                        </View>   
                    </Card.Content>
                    <Card.Cover
                      source={ customer.cust_image !== "" ? {uri: customer.cust_image} : {uri: 'https://iili.io/JFh3AFV.png'}} //require('./assets/customer-without-image.png')}
                      style={[{width: 200, height: 200}, {alignSelf: "center"}]}                        
                    />
                    <View style={[{flexDirection: "column"}]}>
                        <Text
                            style={{alignSelf: "center"}}
                        >Is Active?</Text>
                            {/* <ActivityIndicator style={[{paddingTop:20}, {alignSelf: "flex-end"}]} animating={true}/> */}
                            {loadingUpdateCustomer ? <ActivityIndicator animating={true} size='small' style={{ transform: [{ scaleX: 0.5 }, { scaleY: 0.5 }] }}/>
                            :           
                            <Switch 
                                style={{alignSelf: "center"}}
                                value={customer.cust_active}
                                onValueChange={(value) => { 
                                    Alert.alert('Are you sure you want to change the status?', 
                                        `The status of the client ${customer.cust_fullname} will change to: ${!customer.cust_active ? 'Active' : 'Inactive'}`,
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => {
                                                    updateCustomer({...customer, cust_active: value});
                                                }
                                            },
                                            {
                                                text: 'Cancel'
                                            }
                                        ]
                                        
                                    )}
                                }
                            /> 
                        }
                    </View>
                    <View>   
                        <Button 
                            title="Invoices" 
                            style={[{backgroundColor: 'yellow'}, {marginTop: 10}, {borderColor: 'black'}, {borderWidth: 1}]}
                            onPress={() => navigation.navigate('Customer Invoices', {customer})}    
                        >INVOICES</Button>   
                        <View style={{height: 20}} />
                        <Button 
                            title="Debts" 
                            style={[{backgroundColor: 'yellow'}, {marginTop: 10}, {borderColor: 'black'}, {borderWidth: 1}]}
                            onPress={() => navigation.navigate('Customer Debts', {customer})}    
                        >DEBTS</Button>  
                    </View>                      
                </Card>
                
            </Pressable>
            <Snackbar
                visible={visibleSnackbar}
                duration={2000}
                onDismiss={() => setVisibleSnackbar(false)}
                action={{}}>
            Customer updated successfully!!
            </Snackbar> 
        </View>
        </ScrollView>
    );
}

export default CustomerDetails;