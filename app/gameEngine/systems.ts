/* eslint-disable prefer-const */

export const MoveFingerOffset = (entities, { touches }) => {
  touches
    .filter((t) => t.type === "move" || t.type === "start")
    .forEach((t) => {
      let finger = entities[t.id]
      if (finger && finger.position) {
        finger.position = [finger.position[0] + t.delta.pageX, finger.position[1] + t.delta.pageY]
      }
    })

  return entities
}

export const MoveFingerPosition = (entities, { touches }) => {
  touches
    .filter((t) => t.type === "move" || t.type === "start")
    .forEach((t) => {
      let finger = entities[t.id]
      if (finger && finger.position) {
        finger.position = [t.event.pageX, t.event.pageY]
      }
    })

  return entities
}
