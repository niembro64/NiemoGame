import React, { FC } from "react"
import { ViewStyle } from "react-native"
import { Screen } from "../components"
import { BeerPongProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"

export const DemoCommunityScreen: FC<BeerPongProps<"DemoCommunity">> = function DemoCommunityScreen(
  _props,
) {
  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}></Screen>
  )
}

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}
