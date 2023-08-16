import { fingerKeys } from "app/screens/DemoShowroomScreen/AirHockeyScreen"
import { FINGER_RADIUS, PUCK_RADIUS } from "./renderers"
import { ScreenWidth } from "react-native-elements/dist/helpers"
import { ScreenStackHeaderRightView } from "react-native-screens"

export const MoveFingerOffset = (entities: { [x: string]: any }, { touches }: any) => {
  touches
    .filter((t: { type: string }) => t.type === "move" || t.type === "start")
    .forEach((t: { id: string | number; delta: { pageX: any; pageY: any } }) => {
      const fingerKey = fingerKeys[t.id]
      const finger = entities[fingerKey]
      if (finger && finger.position) {
        finger.position = [finger.position[0] + t.delta.pageX, finger.position[1] + t.delta.pageY]
      }
    })

  return entities
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

/* eslint-disable prefer-const */

function isColliding(circleA: { position: number[] }, circleB: { position: number[] }) {
  const distance = Math.sqrt(
    (circleA.position[0] - circleB.position[0]) ** 2 +
      (circleA.position[1] - circleB.position[1]) ** 2,
  )
  return distance <= PUCK_RADIUS + FINGER_RADIUS
}

export const MoveFingerAndPuck = (entities: { [x: string]: any; puck: any }, { touches }: any) => {
  touches.forEach((t: { id: string; event: { pageX: any; pageY: any } }) => {
    const fingerKey = fingerKeys[t.id]
    const finger = entities[fingerKey]
    if (finger && finger.position) {
      finger.position = [t.event.pageX, t.event.pageY]
    }
  })

  const puck = entities.puck

  // Check collisions between puck and all fingers
  entities.forEach((entity: { id: string; position: number[] }) => {
    if (entity.id !== "puck") {
      if (isColliding(puck, entity)) {
        puck.velocity.x = -puck.velocity.x
        puck.velocity.y = -puck.velocity.y
      }
    }
  })

  // Update puck position
  puck.position[0] += puck.velocity.x
  puck.position[1] += puck.velocity.y

  // Wall boundaries
  if (puck.position[0] <= 0 || puck.position[0] >= ScreenWidth) puck.velocity.x = -puck.velocity.x
  if (puck.position[1] <= 0 || puck.position[1] >= ScreenStackHeaderRightView)
    puck.velocity.y = -puck.velocity.y

  return entities
}
