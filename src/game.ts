import { ClapMeter } from "./clapMeter"
import * as ui from "@dcl/ui-scene-utils"

// Multiplayer (p2p)
const sceneMessageBus = new MessageBus()

// Setup scene
const base = new Entity()
base.addComponent(new GLTFShape("models/baseDarkWithCollider.glb"))
engine.addEntity(base)

const clapMeterBoard = new ClapMeter(new Transform({ position: new Vector3(8, 0.05, 8) }))

// Listen for claps
onPlayerExpressionObservable.add(({ expressionId }) => {
  if (expressionId == "clap") {
    sceneMessageBus.emit("updateClapMeter", {})
  }
})

// Update the clap meter for all players
sceneMessageBus.on("updateClapMeter", () => {
  clapMeterBoard.updateCooldown()
  clapMeterBoard.updateNeedle()
})

// UI
const message = "For the best experience, \nswitch to 3rd person view by \npressing 'V' key"
ui.displayAnnouncement(message, -1)

onCameraModeChangedObservable.add(({ cameraMode }) => {
  if (cameraMode == 0) ui.displayAnnouncement(message, -1)
  if (cameraMode == 1) ui.hideAnnouncements()
})
