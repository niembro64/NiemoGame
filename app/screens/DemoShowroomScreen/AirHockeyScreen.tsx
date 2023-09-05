/* eslint-disable react-native/no-single-element-style-arrays */
/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { colors } from "app/theme"
import React, { FC, PureComponent, useEffect, useState } from "react"
import { StatusBar, View, ViewStyle } from "react-native"
import { GameEngine } from "react-native-game-engine"
import { Screen } from "../../components"
import { AirHockeyProps } from "../../navigators/DemoNavigator"
import io, { Socket } from "socket.io-client"

export const FINGER_RADIUS = 20
export const fingerKeys = ["f1", "f2", "f3", "f4", "f5", "f6"]

export const backendIpAddress = "http://192.168.1.5:3000"

export class Finger extends PureComponent {
  render() {
    // @ts-ignore
    const x = this.props.position[0] - FINGER_RADIUS / 2
    // @ts-ignore
    const y = this.props.position[1] - FINGER_RADIUS / 2
    return (
      <View
        style={[
          {
            backgroundColor: "pink",
            borderColor: "#CCC",
            borderRadius: FINGER_RADIUS,
            borderWidth: 4,
            height: FINGER_RADIUS * 2,
            position: "absolute",
            width: FINGER_RADIUS * 2,
            left: x,
            top: y,
          },
        ]}
      />
    )
  }
}

export const MoveFingerPosition = (entities: { [x: string]: any }, { touches }: any) => {
  touches.forEach((t: { id: string | number; event: { pageX: any; pageY: any } }) => {
    const fingerKey = fingerKeys[t.id] // Get the corresponding entity key
    const finger = entities[fingerKey]
    if (finger && finger.position) {
      finger.position = [t.event.pageX, t.event.pageY]
    }
  })

  return entities
}

export const AirHockeyScreen: FC<AirHockeyProps<"AirHockey">> = (_props) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketInstance = io(backendIpAddress)
    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: colors.background,
        }}
      >
        <GameEngine
          style={{
            flex: 1,
            backgroundColor: "#FFF",
          }}
          systems={[MoveFingerPosition]}
          entities={{
            f1: { position: [40, 200], renderer: <Finger /> },
            f2: { position: [100, 200], renderer: <Finger /> },
            f3: { position: [160, 200], renderer: <Finger /> },
            f4: { position: [220, 200], renderer: <Finger /> },
            f5: { position: [280, 200], renderer: <Finger /> },
            f6: { position: [340, 200], renderer: <Finger /> },
          }}
        >
          <StatusBar hidden={true} />
        </GameEngine>
      </View>
    </Screen>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
}
