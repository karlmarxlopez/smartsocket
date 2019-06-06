/**
 * @format
 */

import { AppRegistry } from "react-native";
import SmartSocketRemote from "./App";
import { name as appName } from "./app.json";
import firebase from "react-native-firebase";

// firebase
//   .auth()
//   .signInAnonymously()
//   .then(user => {
//     console.log(user.isAnonymous);
//   });
AppRegistry.registerComponent(appName, () => SmartSocketRemote);
