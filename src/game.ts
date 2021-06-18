import * as utils from "@dcl/ecs-scene-utils"

// Setup scene
const base = new Entity()
base.addComponent(new GLTFShape("models/baseDarkWithCollider.glb"))
engine.addEntity(base)

const clapMeterBoard = new Entity()
clapMeterBoard.addComponent(new GLTFShape("models/clapMeterBoard.glb"))
clapMeterBoard.addComponent(new Transform({ position: new Vector3(8, 0.05, 8) }))
engine.addEntity(clapMeterBoard)

const clapMeterArrow = new Entity()
clapMeterArrow.addComponent(new GLTFShape("models/clapMeterArrow.glb"))
clapMeterArrow.addComponent(new Transform({ position: new Vector3(8, 0.1, 8) }))
engine.addEntity(clapMeterArrow)

// Config
const START_ANGLE = 350
const END_ANGLE = 190

// Set arrow to start angle
clapMeterArrow.getComponent(Transform).rotation.setEuler(0, 0, START_ANGLE)

// Listen for claps
onPlayerExpressionObservable.add(({ expressionId }) => {
  // Intermediate variables
  let currentArrowAngle = clapMeterArrow.getComponent(Transform).rotation.eulerAngles.z
  let currentArrowRoation = clapMeterArrow.getComponent(Transform).rotation

  if (expressionId == "clap") {
    if (currentArrowAngle >= END_ANGLE) {
      updateCooldown()
      currentArrowRoation.setEuler(0, 0, currentArrowAngle - 1)
    }
  }
})

// Cooldown config
@Component("cooldownFlag")
class CooldownFlag {}
const CLAP_COOLDOWN_TIME = 6000
const COOLDOWN_SPEED = 10

const cooldown = new Entity()
engine.addEntity(cooldown)

function updateCooldown(): void {
  cooldown.addComponentOrReplace(new CooldownFlag())
  cooldown.addComponentOrReplace(
    new utils.Delay(CLAP_COOLDOWN_TIME, () => {
      cooldown.removeComponent(CooldownFlag)
    })
  )
}

// Cooldown System
export class CooldownSystem implements ISystem {
  update(dt: number) {
    if (cooldown.hasComponent(CooldownFlag)) return

    // Intermediate variables
    let currentAngle = clapMeterArrow.getComponent(Transform).rotation.eulerAngles.z
    let currentArrowRoation = clapMeterArrow.getComponent(Transform).rotation

    if (currentAngle <= START_ANGLE) {
      currentArrowRoation.setEuler(0, 0, currentAngle + COOLDOWN_SPEED * dt)
    }
  }
}

engine.addSystem(new CooldownSystem())
