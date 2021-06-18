import * as utils from "@dcl/ecs-scene-utils"

// Config
const START_ANGLE = 350
const END_ANGLE = 190

// Cooldown config
@Component("cooldownFlag")
class CooldownFlag {}
const CLAP_COOLDOWN_TIME = 6000 // Clap animation length
const COOLDOWN_SPEED = 10

const clapMeterArrow = new Entity()

export class ClapMeter extends Entity {
  constructor(transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(new GLTFShape("models/clapMeterBoard.glb"))
    this.addComponent(transform)

    // Clap meter arrow
    clapMeterArrow.addComponent(new GLTFShape("models/clapMeterArrow.glb"))
    clapMeterArrow.addComponent(new Transform({ position: new Vector3(0, 0.1, 0) }))
    clapMeterArrow.setParent(this)

    // Set arrow to start angle
    clapMeterArrow.getComponent(Transform).rotation.setEuler(0, 0, START_ANGLE)
  }
  updateCooldown(): void {
    clapMeterArrow.addComponentOrReplace(new CooldownFlag())
    clapMeterArrow.addComponentOrReplace(
      new utils.Delay(CLAP_COOLDOWN_TIME, () => {
        clapMeterArrow.removeComponent(CooldownFlag)
      })
    )
  }
  updateArrow(): void {
    let currentArrowAngle = clapMeterArrow.getComponent(Transform).rotation.eulerAngles.z
    let currentArrowRoation = clapMeterArrow.getComponent(Transform).rotation

    if (currentArrowAngle >= END_ANGLE) {
      currentArrowRoation.setEuler(0, 0, currentArrowAngle - 1)
    }
  }
}

// Cooldown System
export class CooldownSystem implements ISystem {
  update(dt: number) {
    if (clapMeterArrow.hasComponent(CooldownFlag)) return

    let currentAngle = clapMeterArrow.getComponent(Transform).rotation.eulerAngles.z
    let currentArrowRoation = clapMeterArrow.getComponent(Transform).rotation

    if (currentAngle <= START_ANGLE) {
      currentArrowRoation.setEuler(0, 0, currentAngle + COOLDOWN_SPEED * dt)
    }
  }
}

engine.addSystem(new CooldownSystem())
