import { ClapMeter } from "./clapMeter"

// Multiplayer (p2p)
const sceneMessageBus = new MessageBus()

// Setup scene
const base = new Entity()
base.addComponent(new GLTFShape("models/baseDarkWithCollider.glb"))
engine.addEntity(base)

const clapMeterBoard = new ClapMeter(new GLTFShape("models/clapMeterBoard.glb"), new Transform({ position: new Vector3(8, 0.05, 8) }))

// Listen for claps
onPlayerExpressionObservable.add(({ expressionId }) => {
  if (expressionId == "clap") {
    sceneMessageBus.emit("updateClapMeter", {})
  }
})

// Update the clap meter for all players
sceneMessageBus.on("updateClapMeter", () => {
  clapMeterBoard.updateCooldown()
  clapMeterBoard.updateArrow()
})
