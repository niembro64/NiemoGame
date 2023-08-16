/* eslint-disable react-native/no-color-literals */
import React, { PureComponent } from "react"
import { StyleSheet, View } from "react-native"

const RADIUS = 20

export class Finger extends PureComponent {
  render() {
    // @ts-ignore
    const x = this.props.position[0] - RADIUS / 2
    // @ts-ignore
    const y = this.props.position[1] - RADIUS / 2
    return <View style={[styles.finger, { left: x - 80, top: y - 100 }]} />
  }
}

const styles = StyleSheet.create({
  finger: {
    backgroundColor: "pink",
    borderColor: "#CCC",
    borderRadius: RADIUS * 2,
    borderWidth: 4,
    height: RADIUS * 2,
    position: "absolute",
    width: RADIUS * 2,
  },
})
