/* eslint-disable react-native/no-single-element-style-arrays */
/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { colors } from "app/theme"
import React, { FC, PureComponent, useEffect, useState } from "react"
import { Platform, StatusBar, View, ViewStyle } from "react-native"
import { GameEngine } from "react-native-game-engine"
import { Screen, Text } from "../../components"
import { AirHockeyProps } from "../../navigators/DemoNavigator"
import io, { Socket } from "socket.io-client"

export const FINGER_RADIUS = 20
export const fingerKeys = ["f1", "f2", "f3", "f4", "f5", "f6"]
export const backendIpAddress = "http://192.168.1.9:3000"

const socket = io(backendIpAddress) // Initialize the socket at the module level

class Finger extends PureComponent {
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

const MoveFingerPosition = (entities: { [x: string]: any }, { touches }: any) => {
  let positionsChanged = false
  const newPositions: { [key: string]: [number, number] } = {}

  touches.forEach((t: { id: string | number; event: { pageX: any; pageY: any } }) => {
    // console.log("id", t.id)

    // @ts-ignore
    const index = Platform.OS === "android" ? t.id : t.id - 1

    // console.log("index", index)
    const fingerKey = fingerKeys[index]
    const finger = entities[fingerKey]
    if (finger && finger.position) {
      finger.position = [t.event.pageX, t.event.pageY]
      newPositions[fingerKey] = finger.position
      positionsChanged = true
    }
  })

  if (positionsChanged) {
    console.log("Emitting positions:", newPositions)
    socket.emit("finger-positions", newPositions)
  }
  return entities
}

export const AirHockeyScreen: FC<AirHockeyProps<"AirHockey">> = (_props) => {
  const initialEntities = {
    f1: { position: [FINGER_RADIUS, 200], renderer: <Finger /> },
    f2: { position: [FINGER_RADIUS * 3, 200], renderer: <Finger /> },
    f3: { position: [FINGER_RADIUS * 5, 200], renderer: <Finger /> },
    f4: { position: [FINGER_RADIUS * 7, 200], renderer: <Finger /> },
    f5: { position: [FINGER_RADIUS * 9, 200], renderer: <Finger /> },
    // f6: { position: [FINGER_RADIUS * 11, 200], renderer: <Finger /> },
    // f7: { position: [FINGER_RADIUS * 13, 200], renderer: <Finger /> },
  }

  const [entities, setEntities] = useState(initialEntities)

  useEffect(() => {
    socket.on("finger-positions", (positions: { [key: string]: [number, number] }) => {
      setEntities((prevEntities) => {
        const updatedEntities = { ...prevEntities }
        Object.keys(positions).forEach((key) => {
          if (updatedEntities[key]) {
            updatedEntities[key].position = positions[key]
          }
        })
        return updatedEntities
      })
    })

    socket.on("receive-coordinates", (allCoordinates) => {
      console.log("allCoordinates", JSON.stringify(allCoordinates, null, 2))
    })

    return () => {
      socket.disconnect()
    }
  }, [entities])

  return (
    <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} contentContainerStyle={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: colors.background,
        }}
      >
        <Text
          style={{
            width: "100%",
            height: "10%",
            backgroundColor: colors.background,
            color: colors.text,
            alignContent: "center",
            textAlign: "center",
            textAlignVertical: "center",
            fontSize: 20,
          }}
        >
          asdf
        </Text>
        <GameEngine
          style={{
            flex: 1,
            // backgroundColor: "#FFF",
            backgroundColor: "#000",
          }}
          systems={[MoveFingerPosition]}
          entities={entities}
        >
          <StatusBar hidden={true} />
        </GameEngine>
      </View>
    </Screen>
  )
}
