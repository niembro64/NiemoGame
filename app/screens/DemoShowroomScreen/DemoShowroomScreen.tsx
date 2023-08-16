/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { colors } from "app/theme"
import React, { FC } from "react"
import { StatusBar, View, ViewStyle } from "react-native"
import { GameEngine } from "react-native-game-engine"
import { Screen } from "../../components"
import { Finger } from "../../gameEngine/renderers"
import { MoveFinger } from "../../gameEngine/systems"
import { DemoTabScreenProps } from "../../navigators/DemoNavigator"

export const DemoShowroomScreen: FC<DemoTabScreenProps<"DemoShowroom">> =
  function DemoShowroomScreen(_props) {
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
            systems={[MoveFinger]}
            entities={{
              1: { position: [40, 200], renderer: <Finger /> },
              2: { position: [100, 200], renderer: <Finger /> },
              3: { position: [160, 200], renderer: <Finger /> },
              4: { position: [220, 200], renderer: <Finger /> },
              5: { position: [280, 200], renderer: <Finger /> },
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
