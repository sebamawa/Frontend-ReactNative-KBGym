// import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, FlatList, Alert, TouchableOpacity} from 'react-native';
import { ActivityIndicator, Searchbar} from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

import { getBaseAPIUrl } from './endpoints/endpoints';

function Customers({navigation}) {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [firstRender, setFirstRender] = useState(false);
    const [customerNameFilter, setCustomerNameFilter] = useState('');
    const [cust_active, setCustActive] = useState(true);

    const [loadingCountCustomersWithDebt, setLoadingCountCustomersWithDebt] = useState(false);
    const [customersWithDebt, setCustomersWithDebt] = useState(0);

    //const [expandedListAccordion, setExpandedListAccordion] = useState(false);
  
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        paddingTop: 10,
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

    useFocusEffect(
      React.useCallback(() => {
          let isActive = true;
      
          (async() => {   
            try {
              setLoadingCountCustomersWithDebt(true);
      
              const url = await getBaseAPIUrl();
              const response = await fetch(`${url}/CustomersAPI/CountCustomersWithDebt?cust_active=true`);
      
              const json = await response.json(); 
              setCustomersWithDebt(json.CustomersWithDebt);
              // if (customersWithDebt === 0)
              //   setThereAreCustomersWithDebt(false);
      
              setLoadingCountCustomersWithDebt(false);
            } catch (error) {
                Alert.alert(`Error: ${error}`);
            }   
            })();             
    
          return () => {
              isActive = false;
          };
      }, [])
    );     

    useFocusEffect(
      React.useCallback(() => {
          let isActive = true;
      
          (async() => {   
            try {
              setLoading(true);
      
              const url = await getBaseAPIUrl();
              
              let response = null;
              if (customerNameFilter !== "") { // filter to search by name not empty
                response = await fetch(`${url}/KBGymTemplateJavaMySQL/CustomersAPI/GetByName?cust_fullname=${customerNameFilter}&cust_active=${cust_active}&page_number=1&page_size=20`);
                // response = await fetch(`${baseRemoteUrl}/CustomersAPI/GetByName?cust_fullname=${customerNameFilter}&cust_active=${cust_active}&page_number=1&page_size=25`);
              } else {
                response = await fetch(`${url}/CustomersAPI/List?cust_active=${cust_active}&page_number=1&page_size=25`);
                //response = await fetch(`${baseRemoteUrl}/CustomersAPI/List?cust_active=${cust_active}&page_number=1&page_size=25`);
              }
              const json = await response.json();
              const customers = json.SDTCustomerColl;
              // TODO: sort customers by cust_has_debt
              const customersWithDebts = customers.filter(c => c.cust_has_debt === true);
              const customersWithoutDebts = customers.filter(c => c.cust_has_debt === false);
              setCustomers(customersWithDebts.concat(customersWithoutDebts));
              // setCustomers(json.SDTCustomerColl); 
              //setTotalPages(json.TotalPages);
              setLoading(false);
            } catch (error) {
              console.log(error);
              Alert.alert(`Error: ${error}`);
              // navigation.navigate('ErrorCustomersNavigation');
            }   
            })();             
    
          return () => {
              isActive = false;
          };
      }, [cust_active, customerNameFilter])
    );     
   
    return (
        <View style={styles.container}>
          <View style={{flexDirection: "row"}}>
            <Searchbar style={[{flex: 0.6}, {maxHeight: 50}]}
              placeholder="Search customers"
              value={customerNameFilter}
              onChangeText={text =>setCustomerNameFilter(text)}
              elevation={5}
            />
            <View style={{flex: 0.4}}>
              <Picker
                selectedValue={cust_active}
                onValueChange={(itemValue, itemIndex) => setCustActive(itemValue)}
              >
                <Picker.Item label="Active" value="true" />
                <Picker.Item label="Inactive" value="false" />
              </Picker>
            </View>
            {/* TODO: calculate total customers active or inactive */}
            <View style={{paddingRight: 2, paddingTop: 5}}>
              <Text>Activas: {customers.length}</Text>
              <Text style={{fontWeight: 'bold'}}>Con deuda: {loadingCountCustomersWithDebt ? "*" : customersWithDebt}</Text>
            </View>
          </View>
          {loading ? 
            <>
              <Text>Loading customers...</Text>
              <ActivityIndicator style={{paddingTop:20}} animating={true}/>
            </>
          :
          <FlatList
              style = {{paddingTop: 10}}
              data={customers}
              renderItem={({item}) => 
                <TouchableOpacity 
                    style={{backgroundColor: "blue", padding: 5}} 
                    onPress={() => {
                      navigation.navigate('Customer Details', {customerInit: item});
                    }}  
                >
                  <View style={[styles.centered, styles.border, item.cust_has_debt ? {backgroundColor: "red"} : (item.cust_monthly_serv_pending ? {backgroundColor: "yellow"} : {backgroundColor: "green"})]}>
                    <Text style={{fontWeight: "bold"}}>Name: {item.cust_fullname}</Text> 
                    <Text>CI: {item.cust_identification} - Phone: {item.cust_phone}</Text>
                    <Image
                      source={ item.cust_image !== "" ? {uri: item.cust_image} : {uri: 'https://iili.io/JFh3AFV.png'}} //require('./assets/customer-without-image.png')}
                      style={{width: 50, height: 50,}}
                    />  
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{paddingTop: 5}}>{"Pay out of period: "}</Text>
                      <CheckBox
                          value={item.cust_pay_out_of_period}
                          enabled={false}
                          tintColors={{ true: 'blue', false: 'black' }}
                          // onValueChange={(value) => 
                          //     setCust_pay_out_of_period(value)}
                      />    
                    </View>                  
                    <Text style={{fontWeight: "bold"}}>Payday limit: {item.cust_payday_limit === "0000-00-00" ? "-" : item.cust_payday_limit}</Text> 
                  </View>  
                </TouchableOpacity>
              }
          />
          }
        </View>
    );
  }

  export default Customers;