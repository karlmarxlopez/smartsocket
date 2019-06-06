// @flow
import * as React from "react";
import { Icon, normalize } from "react-native-elements";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import firebase from "react-native-firebase";
import { Reference } from "react-native-firebase";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from "react-native-responsive-screen";
const RELAY_ON = "ON";
const RELAY_OFF = "OFF";
type RelayStatus = typeof RELAY_ON | typeof RELAY_OFF;
type SmartSocketRemoteState = {
  masterRelayStatus: RelayStatus,
  slaveRelayStatus: RelayStatus
};

const RTDB_FIELD_MAP = {
  masterRelayStatus: "MASTER_RELAY_STATUS",
  slaveRelayStatus: "SLAVE_RELAY_STATUS"
};

class SmartSocketRemote extends React.PureComponent<*, SmartSocketRemoteState> {
  DbRef: Reference;
  DbCallback: *;

  constructor() {
    super();
    this.DbRef = firebase.database().ref("/");
    this.state = {
      masterRelayStatus: RELAY_OFF,
      slaveRelayStatus: RELAY_OFF
    };
  }

  componentDidMount() {
    this.DbCallback = this.DbRef.on(
      "value",
      snapShot => {
        const { MASTER_RELAY_STATUS, SLAVE_RELAY_STATUS } = snapShot.val();
        this.setState({
          masterRelayStatus: MASTER_RELAY_STATUS,
          slaveRelayStatus: SLAVE_RELAY_STATUS
        });
      },
      e => {}
    );
  }

  componentWillUnmount() {
    this.DbRef.off("value", this.DbCallback);
  }

  toggleRelayState = (status: RelayStatus) =>
    status === RELAY_ON ? RELAY_OFF : RELAY_ON;

  powerToggle = (relay: $Keys<SmartSocketRemoteState>) => () => {
    this.setState(
      prevState => ({
        [relay]: this.toggleRelayState(prevState[relay])
      }),
      () =>
        this.DbRef.update({
          [RTDB_FIELD_MAP[relay]]: this.state[relay]
        }).catch(() =>
          this.setState(prevState => ({
            [relay]: this.toggleRelayState(prevState[relay])
          }))
        )
    );
  };

  getPowerButtonColor = (relay: $Keys<SmartSocketRemoteState>) =>
    this.state[relay] === RELAY_ON ? "#35e4f3" : "#ddd";

  render() {
    return (
      <View style={styles.container}>
        <Icon
          raised
          size={normalize(75)}
          name="power"
          type="feather"
          color={this.getPowerButtonColor("masterRelayStatus")}
          onPress={this.powerToggle("masterRelayStatus")}
        />

        <Icon
          raised
          size={normalize(75)}
          name="power"
          type="feather"
          color={this.getPowerButtonColor("slaveRelayStatus")}
          onPress={this.powerToggle("slaveRelayStatus")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center"
  }
});

export default SmartSocketRemote;
