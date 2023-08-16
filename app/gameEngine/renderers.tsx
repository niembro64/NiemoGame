/* eslint-disable react-native/no-color-literals */
import React, { PureComponent } from "react"
import { StyleSheet, View } from "react-native"

export const FINGER_RADIUS = 20
export const PUCK_RADIUS = 30

export class Finger extends PureComponent {
  render() {
    // @ts-ignore
    const x = this.props.position[0] - FINGER_RADIUS / 2
    // @ts-ignore
    const y = this.props.position[1] - FINGER_RADIUS / 2
    return <View style={[styles.finger, { left: x, top: y }]} />
  }
}

export class Puck extends PureComponent {
  render() {
    // @ts-ignore
    const x = this.props.position[0] - PUCK_RADIUS / 2
    // @ts-ignore
    const y = this.props.position[1] - PUCK_RADIUS / 2
    return <View style={[styles.puck, { left: x, top: y }]} />
  }
}

const styles = StyleSheet.create({
  finger: {
    backgroundColor: "pink",
    borderColor: "#CCC",
    borderRadius: FINGER_RADIUS,
    borderWidth: 4,
    height: FINGER_RADIUS * 2,
    position: "absolute",
    width: FINGER_RADIUS * 2,
  },
  puck: {
    backgroundColor: "blue",
    borderColor: "#CCC",
    borderRadius: PUCK_RADIUS,
    borderWidth: 4,
    height: PUCK_RADIUS * 2,
    position: "absolute",
    width: PUCK_RADIUS * 2,
  },
})
