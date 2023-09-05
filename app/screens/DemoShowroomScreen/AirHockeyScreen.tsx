/* eslint-disable object-shorthand */
/* eslint-disable react-native/no-single-element-style-arrays */
/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { colors } from "app/theme"
import React, { FC, PureComponent, useEffect, useState } from "react"
import * as Crypto from "expo-crypto"
import { Platform, StatusBar, View, ViewStyle } from "react-native"
import { GameEngine } from "react-native-game-engine"
import { Screen, Text } from "../../components"
import { AirHockeyProps } from "../../navigators/DemoNavigator"
import io, { Socket } from "socket.io-client"
import { ScreenHeight, ScreenWidth } from "react-native-elements/dist/helpers"
import * as Device from "expo-device"
import { set } from "date-fns"

export const FINGER_RADIUS = 20
export const fingerKeys = ["f1", "f2", "f3", "f4", "f5", "f6"]
export const backendIpAddress = "http://192.168.1.9:3000"

const socket = io(backendIpAddress) // Initialize the socket at the module level

export const AirHockeyScreen: FC<AirHockeyProps<"AirHockey">> = (_props) => {
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

  const entities = {
    f1: { position: [FINGER_RADIUS, 200], renderer: <Finger /> },
    f2: { position: [FINGER_RADIUS * 3, 200], renderer: <Finger /> },
    f3: { position: [FINGER_RADIUS * 5, 200], renderer: <Finger /> },
    f4: { position: [FINGER_RADIUS * 7, 200], renderer: <Finger /> },
    f5: { position: [FINGER_RADIUS * 9, 200], renderer: <Finger /> },
    // f6: { position: [FINGER_RADIUS * 11, 200], renderer: <Finger /> },
    // f7: { position: [FINGER_RADIUS * 13, 200], renderer: <Finger /> },
  }

  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [allDevices, setAllDevices] = useState(null)

  const MoveFingerPosition = (entities: { [x: string]: any }, { touches }: any) => {
    let positionsChanged = false
    const newPositions: { [key: string]: [number, number] } = {}

    touches.forEach((t: { id: string | number; event: { pageX: any; pageY: any } }) => {
      // @ts-ignore
      const index = Platform.OS === "android" ? t.id : t.id - 1

      const fingerKey = fingerKeys[index]
      const finger = entities[fingerKey]
      if (finger && finger.position) {
        finger.position = [t.event.pageX, t.event.pageY]
        newPositions[fingerKey] = finger.position
        positionsChanged = true
      }
    })

    if (positionsChanged) {
      const locPercent: number[][] = Object.values(newPositions).map((position) => {
        return [position[0] / ScreenWidth, position[1] / ScreenHeight]
      })

      const objectToSend = {
        deviceId: deviceId,
        positions: locPercent,
      }

      socket.emit("send-coordinates", objectToSend)
    }
    return entities
  }

  useEffect(() => {
    ;(async () => {
      const d = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        JSON.stringify(Device),
        { encoding: Crypto.CryptoEncoding.HEX },
      )

      setDeviceId(d)
    })()
  }, [])

  useEffect(() => {
    if (entities === null || deviceId === null) {
      return
    }

    socket.emit("register-device", deviceId)
    socket.on("receive-coordinates", (allCoordinates) => {
      console.log("allCoordinates", JSON.stringify(allCoordinates, null, 2))

      setAllDevices(allCoordinates)
    })

    return () => {
      socket.disconnect()
    }
  }, [deviceId])

  useEffect(() => {
    if (!allDevices || allDevices.length === 0) {
      return
    }

    console.log("allDevices", JSON.stringify(allDevices, null, 2))
  }, [allDevices])

  return (
    <Screen preset="fixed" safeAreaEdges={["bottom"]} contentContainerStyle={{ flex: 1 }}>
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: colors.background,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GameEngine
          style={{
            flex: 1,
            width: "100%",
            // backgroundColor: "#FFF",
            backgroundColor: "#000",
          }}
          systems={[MoveFingerPosition]}
          entities={entities}
        >
          <StatusBar hidden={true} />
        </GameEngine>

        <View
          style={{
            flex: 1,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          {allDevices !== null &&
            Object.entries(allDevices).map(
              ({ 0: deviceId, 1: fingerPositions }, dIndex: number) => {
                // fingerPositions.map((fingerPosition: [number, number], index: number) => { })
                return (
                  <View
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    key={dIndex}
                  >
                    {/* @ts-ignore */}
                    {fingerPositions &&
                      // @ts-ignore
                      fingerPositions.length &&
                      // @ts-ignore
                      fingerPositions.map((fingerPosition: [number, number], fIndex: number) => {
                        return (

                          
                          <Text
                            key={fIndex}
                            style={{
                              // flex: 1,
                              width: "100%",
                              backgroundColor: colors.background,
                              color: colors.text,
                              textAlign: "center",
                              textAlignVertical: "center",
                              fontSize: 10,
                              lineHeight: 10,
                            }}
                          >
                            {JSON.stringify(fingerPosition, null, 2)}
                          </Text>
                        )
                      })}
                  </View>
                )
              },
            )}
        </View>
      </View>
    </Screen>
  )
}
