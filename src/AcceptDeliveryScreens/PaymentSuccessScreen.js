import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {ColorSpace} from 'react-native-reanimated';
import {Colors} from '../../globals/Globals';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PaymentSuccessScreen = () => {
  const [date, setDate] = useState(new Date());
  return (
    <View style={styles.mainContainer}>
      <View>
        <View style={styles.iconStyle}>
          <Ionicons name="checkmark-circle" size={140} color={Colors.primary} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.headerText}>Done!</Text>
          <Text style={styles.successText}>Payment Success</Text>
          <View style={styles.tableView}>
            <View style={styles.detailView}>
              <Text style={styles.titleText}>Payment Type</Text>
              <Text style={styles.bigText}>Debit Card</Text>
            </View>
            <View style={styles.detailView}>
              <Text style={styles.titleText}>Trip Amount</Text>
              <Text style={styles.bigText}>Kshs. 500</Text>
            </View>
            <View style={styles.detailView}>
              <Text style={styles.titleText}>Service Fee & V.A.T</Text>
              <Text style={styles.bigText}>Kshs. 100</Text>
            </View>
            <View style={styles.detailView}>
              <Text style={styles.titleText}>Date</Text>
              <Text style={styles.bigText}>{date.toDateString()}</Text>
            </View>
          </View>

          {[...Array(3).keys()].map(index => {
            return <View key={index} style={styles.dottedLine}></View>;
          })}

          <View style={styles.bottomSection}>
            <Text>You Get</Text>
            <Text style={styles.finalAmount}>Kshs. 400</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.continueButton}
          // onPress ={savePayment} here we can get the amount to add and show to the user wallet and easily get the deductions (our earnings from delivery)
        >
          <Text
            style={{
              color: Colors.background,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            CONTINUE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.8,
  },
  headerText: {},
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    padding: 15,
  },
  tableView: {
    paddingVertical: 5,
    width: Dimensions.get('window').width * 0.7,
  },
  detailView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 14,
  },
  bigText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: 'bold',
  },
  bottomSection: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finalAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.primary,
    padding: 20,
  },
  dottedLine: {
    backgroundColor: Colors.line,
    height: 1,
    width: '100%',
    marginVertical: 2,
    flexDirection: 'row',
  },
  iconStyle: {
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.8,
  },
  continueButton: {
    width: Dimensions.get('window').width * 0.8,
    height: 50,
    backgroundColor: Colors.mainColor,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});
