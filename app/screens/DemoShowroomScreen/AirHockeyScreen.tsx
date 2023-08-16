/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { FC } from "react"
import { StatusBar, ViewStyle } from "react-native"
import { GameEngine } from "react-native-game-engine"
import { Screen } from "../../components"
import { Finger } from "../../gameEngine/renderers"
import { AirHockeyProps } from "../../navigators/DemoNavigator"

import { ScreenWidth } from "react-native-elements/dist/helpers"
import { MoveFingerOffset } from "../../gameEngine/systems"
export const fingerKeys = ["f1", "f2", "f3", "f4", "f5"]
// export const fingerKeys = ["f1", "f2", "f3", "f4", "f5", "f6"]

export const AirHockeyScreen: FC<AirHockeyProps<"AirHockey">> = (_props) => {
  const numFingers = 5
  const screenDivisions = numFingers + 1
  const divisionSize = ScreenWidth / screenDivisions

  return (
    <Screen preset="fixed" safeAreaEdges={["top"]} contentContainerStyle={$screenContainer}>
      <GameEngine
        style={{
          flex: 1,
          backgroundColor: "#FFF",
        }}
        systems={[MoveFingerOffset]}
        entities={{
          f1: { position: [divisionSize * 1, 300], renderer: <Finger /> },
          f2: { position: [divisionSize * 2, 300], renderer: <Finger /> },
          f3: { position: [divisionSize * 3, 300], renderer: <Finger /> },
          f4: { position: [divisionSize * 4, 300], renderer: <Finger /> },
          f5: { position: [divisionSize * 5, 300], renderer: <Finger /> },
          // f6: { position: [340, 300], renderer: <Finger /> },
        }}
      >
        <StatusBar hidden={true} />
      </GameEngine>
    </Screen>
  )
}

const $screenContainer: ViewStyle = {
  flex: 1,
}
