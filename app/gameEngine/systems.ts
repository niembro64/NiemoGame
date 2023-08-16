import { fingerKeys } from "app/screens"

// export const MoveFingerOffset = (entities: { [x: string]: any }, { touches }: any) => {
//   touches
//     .filter((t: { type: string }) => t.type === "move")
//     .forEach((t: { id: string | number; delta: { pageX: any; pageY: any } }) => {
//       const fingerKey = fingerKeys[t.id]
//       const finger = entities[fingerKey]
//       if (finger && finger.position) {
//         finger.position = [finger.position[0] + t.delta.pageX, finger.position[1] + t.delta.pageY]
//       }
//     })

//   return entities
// }

export const MoveFingerOffset = (entities: { [x: string]: any }, { touches }: any) => {
  touches
    .filter((t: { type: string }) => t.type === "move")
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
    console.log("t", t)
    const fingerKey = fingerKeys[t.id]
    const finger = entities[fingerKey]
    if (finger && finger.position) {
      finger.position = [t.event.pageX, t.event.pageY]
    }
  })
  return entities
}
