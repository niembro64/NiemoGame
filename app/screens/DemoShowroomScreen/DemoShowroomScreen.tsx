/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import { RouteProp, useRoute } from "@react-navigation/native"
import React, { FC, useEffect, useRef, useState } from "react"
import { SectionList, StatusBar, View, ViewStyle } from "react-native"
import { DrawerLayout } from "react-native-gesture-handler"
import { Screen } from "../../components"
import { DemoTabParamList, DemoTabScreenProps } from "../../navigators/DemoNavigator"
import * as Demos from "./demos"
import { colors } from "app/theme"
import { GameEngine } from "react-native-game-engine"
import { MoveFinger } from "../../gameEngine/systems"
import { Finger } from "../../gameEngine/renderers"

const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

export const DemoShowroomScreen: FC<DemoTabScreenProps<"DemoShowroom">> =
  function DemoShowroomScreen(_props) {
    const [open, setOpen] = useState(false)
    const timeout = useRef<ReturnType<typeof setTimeout>>()
    const drawerRef = useRef<DrawerLayout>()
    const listRef = useRef<SectionList>()

    const route = useRoute<RouteProp<DemoTabParamList, "DemoShowroom">>()
    const params = route.params

    // handle Web links
    React.useEffect(() => {
      if (route.params) {
        const demoValues = Object.values(Demos)
        const findSectionIndex = demoValues.findIndex(
          (x) => x.name.toLowerCase() === params.queryIndex,
        )
        let findItemIndex = 0
        if (params.itemIndex) {
          try {
            findItemIndex =
              demoValues[findSectionIndex].data.findIndex(
                (u) => slugify(u.props.name) === params.itemIndex,
              ) + 1
          } catch (err) {
            console.error(err)
          }
        }
        handleScroll(findSectionIndex, findItemIndex)
      }
    }, [route])

    const toggleDrawer = () => {
      if (!open) {
        setOpen(true)
        drawerRef.current?.openDrawer({ speed: 2 })
      } else {
        setOpen(false)
        drawerRef.current?.closeDrawer({ speed: 2 })
      }
    }

    const handleScroll = (sectionIndex: number, itemIndex = 0) => {
      listRef.current.scrollToLocation({
        animated: true,
        itemIndex,
        sectionIndex,
      })
      toggleDrawer()
    }

    useEffect(() => {
      return () => timeout.current && clearTimeout(timeout.current)
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
