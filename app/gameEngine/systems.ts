/* eslint-disable prefer-const */

export const MoveFingerOffset = (entities: { [x: string]: any }, { touches }: any) => {
  touches
    .filter((t: { type: string }) => t.type === "move" || t.type === "start")
    .forEach((t: { id: string | number; delta: { pageX: any; pageY: any } }) => {
      let finger = entities[t.id]
      if (finger && finger.position) {
        finger.position = [finger.position[0] + t.delta.pageX, finger.position[1] + t.delta.pageY]
      }
    })

  touches.forEach((t: { type: string; event: { pageX: any; pageY: any } }) => {
    console.log(t.type, t.event.pageX, t.event.pageY)
  })

  return entities
}

export const MoveFingerPosition = (entities: { [x: string]: any }, { touches }: any) => {
  touches.forEach((t: { id: string | number; event: { pageX: any; pageY: any } }) => {
    let finger = entities[t.id]
    if (finger && finger.position) {
      finger.position = [t.event.pageX, t.event.pageY]
    }
  })

  touches.forEach((t: { type: string; event: { pageX: any; pageY: any } }) => {
    console.log(t.type, t.event.pageX, t.event.pageY)
  })

  return entities
}
