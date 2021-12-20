import React, { Component } from "react";
import {
  Button,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
// import CButton from './CButton';
import firestore from "@react-native-firebase/firestore";
import index from "../Log";
import auth from "@react-native-firebase/auth";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { height, width } from "../../utils/dimensions";

class ParkingSlots extends Component {
  constructor(props) {
    super(props);

    this.state = {
      floors: [],
      data: [],
      nearest: [],
      loading: true,
      season_parkers: [],
      seasonParketUserIDs: [],
      selectedId: "",
      selectedItem: 0,
      selected: "floor1",
      currentUserSlotId: null,
      currentUserParkerType: "visitor",
      carPosition: 0.5,
    };
  }

  loadData = async () => {
    let array = [];
    let season_parkers = [];
    let Slot = [];
    let floors = [];

    await firestore()
      .collection("Floors")
      .get()
      .then((data) => {
        data.forEach((docs) => {
          floors.push(docs.data());
        });
      });

    await firestore()
      .collection("Users")
      .doc(auth().currentUser.uid)
      .get()
      .then((data) => {
        this.setState({
          currentUserParkerType: data.data().parker_type,
          currentUserSlotId: data.data().slot_id,
        });
      });

    let slots = [];

    let lots = Array.from(floors).filter(
      (x) => x.id_type === this.state.currentUserParkerType
    )[0];

    let other_lot = Array.from(floors).filter(
      (x) => x.id_type !== this.state.currentUserParkerType
    )[0];

    if (lots) {
      slots = await this.filterByFloors(lots.floor_id);
    } else if (other_lot) {
      slots = await this.filterByFloors(other_lot.floor_id);
    }

    let seasonParketIDs = [];
    let seasonParketUserIDs = [];
    await firestore()
      .collection("Users")
      .where("parker_type", "==", "season")
      .get()
      .then((data) => {
        data.forEach((docs) => {
          seasonParketIDs.push(docs.data().slot_id);
        });
      });

    this.setState({
      floors: floors,
      selectedItem: lots.floor_id,
      loading: false,
      season_parkers: seasonParketIDs,
      seasonParketUserIDs,
    });
  };

  componentDidMount() {
    this.props.navigation.addListener("focus", this.loadData);
    this.loadData();
  }

  componentWillUnmount() {
    this.props.navigation.removeListener("focus", this.loadData);
  }

  handleNearestSlot = (array, seasonParketIDs) => {
    return array.filter((x) => x.booked === false)[0];
  };

  filterByFloors = async (floor_id) => {
    this.setState({ floor: floor_id });
    let array = [];
    await firestore()
      .collection("AllSlots")
      .where("floor", "==", floor_id)
      .orderBy("slot", "desc")
      .get()
      .then((data) => {
        data.forEach((docs) => {
          array.push(docs.data());
        });
      });

    let nearest = this.handleNearestSlot(
      Array.from(array).reverse(),
      this.state.season_parkers
    );

    this.setState({
      data: array,
      loading: false,
      nearest,
    });
  };

  handleSelection = (id) => {
    this.setState({ selectedId: id });
  };

  onSlot() {
    firestore()
      .collection("Users")
      .doc(auth().currentUser.uid)
      .get()
      .then((data) => {
        firestore()
          .collection("RegisteredVehicles")
          .where("LicensePlateNo", "==", data.data().LicensePlateNo)
          .get()
          .then((res) => {
            if (res.docs.length > 0) {
              const user = auth().currentUser;
              firestore().collection("Users").doc(user.uid).update({
                slot_id: this.state.selectedId,
              });
              firestore()
                .collection("AllSlots")
                .where("slot_id", "==", this.state.selectedId)
                .get()
                .then((data) => {
                  data.forEach((docs) => {
                    this.props.navigation.navigate("ParkingTime");
                    firestore()
                      .collection("AllSlots")
                      .doc(docs.data().slot_id)
                      .update({
                        booked: true,
                      });
                  });
                });
              this.setState({ selectedId: "" });
            } else {
              Alert.alert(
                "Sorry!",
                "Your car is not inside the parking garage"
              );
              return;
            }
          });
      });
  }

  render() {
    const { currentUserParkerType, carPosition } = this.state;
    if (this.state.loading) {
      return null;
    }
    return (
      <ScrollView
        style={{ backgroundColor: "#fff" }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          paddingTop: getStatusBarHeight() - 40,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 32,
            color: "#000",
          }}
        >
          Parking Slots
        </Text>
        <StatusBar barStyle="dark-content" />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ flexDirection: "row", marginBottom: 20 }}
          >
            {this.state.floors.map((item, index) => (
              <TouchableOpacity
                key={index}
                disabled={
                  currentUserParkerType !== item.id_type &&
                  currentUserParkerType === "visitor"
                }
                key={index}
                onPress={() => {
                  this.filterByFloors(item.floor_id);
                  this.setState({ selectedItem: item.floor_id });
                }}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical:
                    this.state.selectedItem === item.floor_id ? 8 : 4,
                  backgroundColor:
                    this.state.selectedItem === item.floor_id
                      ? "#270a3f"
                      : "#FFD428",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 3,
                  marginTop: 20,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: "white", fontSize: 14 }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View
          style={{
            flex: 1,
            flexWrap: "wrap",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          {this.state.data.map((item, index) => (
            <>
              <TouchableOpacity
                style={{ width: "47%", paddingVertical: 5 }}
                onPress={() => this.handleSelection(item.slot_id)}
                key={index}
                disabled={item.booked ? true : false}
              >
                <View
                  key={index}
                  style={
                    this.state.nearest?.slot_id === item.slot_id
                      ? {
                          borderRadius: 10,
                          width: "100%",
                          height: 100,
                          backgroundColor: "green",
                          opacity: !item.booked ? 1 : 0.5,
                          borderWidth: 1,
                          borderColor: "grey",
                          borderStyle: "dotted",
                          alignItems: "center",
                          justifyContent: "center",
                        }
                      : {
                          borderRadius: 10,
                          width: "100%",
                          height: 100,
                          opacity: !item.booked ? 1 : 0.5,
                          borderWidth: 1,
                          borderStyle: "dotted",
                          borderColor: "grey",
                          backgroundColor: "#270a3f",
                          alignItems: "center",
                          justifyContent: "center",
                        }
                  }
                >
                  {this.state.selectedId === item.slot_id ||
                  item.booked === true ? (
                    <Image
                      style={{
                        width: 120,
                        height: 80,
                        transform:
                          index % 2 === 0
                            ? [{ rotate: "180deg" }]
                            : [{ rotate: "0deg" }],
                        resizeMode: "contain",
                      }}
                      source={
                        this.state.selectedId === item.slot_id ||
                        item.booked === true
                          ? require("../../Images/car.png")
                          : null
                      }
                    />
                  ) : null}
                  {this.state.nearest?.slot_id === item.slot_id &&
                  this.state.selectedId !== item.slot_id ? (
                    <Text style={{ color: "#fff", fontSize: 18 }}>
                      RECOMMENDED
                    </Text>
                  ) : null}
                  <Text key={item.id} style={{ color: "#fff", fontSize: 18 }}>
                    {item.slot}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          ))}
        </View>

        <View
          style={{
            backgroundColor: "green",
            borderRadius: 50,
            padding: 10,
            width: "45%",
            alignItems: "center",
            marginTop: 30,
            zIndex: -100,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              justifyContent: "center",
              alignItems: "center",
              color: "white",
            }}
          >
            Entry Point
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onSlot.bind(this)}
        >
          <Text style={styles.buttonText}>Proceed to Park</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#FFD428",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40,

    // flex: 0.5,
  },
  buttonText: {
    fontSize: 20,
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },
});

export default ParkingSlots;
