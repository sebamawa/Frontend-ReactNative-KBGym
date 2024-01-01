import { View, Text, Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import Customers from "./Customers";
import CustomerDetails from "./CustomerDetails";
import CustomerInvoices from "./CustomerInvoices";
import CustomerDebts from "./debts/CustomerDebts";
import AddCustomerInvoice from "./AddCustomerInvoice";
import App from "./App";
// import InvoicesPerMonth from "./invoices/InvoicesPerMonth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    logo: {
      width: 300,
      height: 400,
    },
  });

function ErrorCustomersNavigation() {
    return (
        <View style={styles.container}>
            <Image
              source={ require('./assets/error-system.png') }
              style={{width: 200, height: 200,}}
            /> 
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>
                El servidor no responde. Por favor, inténtelo más tarde.
            </Text>    
        </View>
    );
}

const Stack = createNativeStackNavigator();

function CustomersNavigation() {

    return (
      <NavigationContainer independent={true}>
          <Stack.Navigator id='stack-navigator'>   
              <Stack.Screen 
                name="Customers"
                component={Customers}
              />
              <Stack.Screen 
                  name="Customer Details" 
                  component={CustomerDetails} 
              />
              <Stack.Screen 
                  name="Add Invoice" 
                  component={AddCustomerInvoice} 
              />             
              <Stack.Screen 
                  name="Customer Invoices" 
                  component={CustomerInvoices} 
                  options={({navigation, route}) => ({
                      
                      headerRight: () => (
                          <Button 
                              icon={'plus'}
                              onPress={() => {
                                  //console.log(route.params.customer);
                                  navigation.navigate('Add Invoice', {customer: route.params.customer})
                              }}>
                              ADD
                          </Button>
                      )
                  })}
              /> 
              <Stack.Screen 
                  name="Customer Debts" 
                  component={CustomerDebts} 
              /> 
              <Stack.Screen 
                  name="Home" 
                  component={App} 
              />  
              <Stack.Screen 
                  name="ErrorCustomersNavigation" 
                  component={ErrorCustomersNavigation} 
              />                           
          </Stack.Navigator>
      </NavigationContainer>
      );    
}

export default CustomersNavigation;