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
import { MoveMyDots } from "app/gameEngine/systems"

const printLatency = false

export let allDevices = []

export const FINGER_RADIUS = 20
export const fingerKeys = ["f1", "f2", "f3", "f4", "f5", "f6"]
// export const backendIpAddress = "http://54.81.50.118:3000" // AWS
// export const backendIpAddress = "http://192.168.86.25:3000" // WORK : MAC OS
export const backendIpAddress = "http://192.168.1.9:3000" // HOME : BLACK BETTY

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
              // @ts-ignore
              backgroundColor: this.props.color || "blue",
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
  class FingerMe extends PureComponent {
    render() {
      // @ts-ignore
      const x = this.props.position[0] - FINGER_RADIUS / 2
      // @ts-ignore
      const y = this.props.position[1] - FINGER_RADIUS / 2
      return (
        <View
          style={[
            {
              // @ts-ignore
              backgroundColor: this.props.color || "green",
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
  class FingerEnemy extends PureComponent {
    render() {
      // @ts-ignore
      const x = this.props.position[0] - FINGER_RADIUS / 2
      // @ts-ignore
      const y = this.props.position[1] - FINGER_RADIUS / 2
      return (
        <View
          style={[
            {
              // @ts-ignore
              backgroundColor: this.props.color || "red",
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

    me1: { position: [FINGER_RADIUS, 200], renderer: <FingerMe /> },
    me2: { position: [FINGER_RADIUS * 3, 200], renderer: <FingerMe /> },
    me3: { position: [FINGER_RADIUS * 5, 200], renderer: <FingerMe /> },
    me4: { position: [FINGER_RADIUS * 7, 200], renderer: <FingerMe /> },
    me5: { position: [FINGER_RADIUS * 9, 200], renderer: <FingerMe /> },

    enemy1: { position: [FINGER_RADIUS, 200], renderer: <FingerEnemy /> },
    enemy2: { position: [FINGER_RADIUS * 3, 200], renderer: <FingerEnemy /> },
    enemy3: { position: [FINGER_RADIUS * 5, 200], renderer: <FingerEnemy /> },
    enemy4: { position: [FINGER_RADIUS * 7, 200], renderer: <FingerEnemy /> },
    enemy5: { position: [FINGER_RADIUS * 9, 200], renderer: <FingerEnemy /> },
  }

  const [deviceId, setDeviceId] = useState<string | null>(null)
  // const [allDevices, setAllDevices] = useState(null)

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

      //  const locPercent: { x: number; y: number }[] = Object.values(newPositions).map(
      //    (position) => {
      //      return { x: position[0] / ScreenWidth, y: position[1] / ScreenHeight }
      //    },
      //  )

      const positions = Object.values(newPositions)

      // console.log("positions", positions)

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

  const [latency, setLatency] = useState<number | null>(null)
  const [latencyHistory, setLatencyHistory] = useState<number[]>([])
  const [latencyAverage, setLatencyAverage] = useState<number | null>(null)
  const [latencyMin, setLatencyMin] = useState<number>(Infinity)
  const [latencyMax, setLatencyMax] = useState<number>(0)
  const [latencyMedian, setLatencyMedian] = useState<number>(0)

  useEffect(() => {
    if (latency === null) {
      return
    }

    const newLatencyHistory = [...latencyHistory, latency]

    printLatency && setLatencyHistory(newLatencyHistory)

    if (newLatencyHistory.length > 10) {
      const averageLatency = newLatencyHistory.reduce((a, b) => a + b, 0) / newLatencyHistory.length
      console.log("Average Latency is:", averageLatency, "ms")
      printLatency && setLatencyAverage(averageLatency)
    }

    if (latency < latencyMin) {
      printLatency && setLatencyMin(latency)
    }

    if (latency > latencyMax) {
      printLatency && setLatencyMax(latency)
    }

    if (newLatencyHistory.length > 10) {
      const medianLatency = newLatencyHistory.sort()[Math.floor(newLatencyHistory.length / 2)]
      console.log("Median Latency is:", medianLatency, "ms")
      printLatency && setLatencyMedian(medianLatency)
    }
  }, [latency])

  let start = Date.now()
  useEffect(() => {
    if (entities === null || deviceId === null) {
      return
    }

    socket.emit("register-device", deviceId)

    socket.on("receive-coordinates", (allCoordinates) => {
      // setAllDevices(allCoordinates)
      allDevices = allCoordinates
    })

    const pingInterval = setInterval(() => {
      start = Date.now()
      // console.log("ping", start)
      socket.emit("ping")
    }, 500)

    socket.on("pong", () => {
      const latency = Date.now() - start
      printLatency && console.log("Latency is:", latency, "ms")
      printLatency && setLatency(latency)
    })

    return () => {
      clearInterval(pingInterval) // Clear the interval when the component is unmounted
      socket.off("pong") // Remove the pong event listener
      socket.disconnect()
    }
  }, [deviceId])

  useEffect(() => {
    if (!allDevices || allDevices.length === 0) {
      // return
    }

    // console.log("allDevices", JSON.stringify(allDevices, null, 2))
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
          systems={[MoveFingerPosition, MoveMyDots]}
          entities={entities}
        >
          {/* <StatusBar hidden={true} /> */}
        </GameEngine>
      </View>
    </Screen>
  )
}
