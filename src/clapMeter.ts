import * as utils from "@dcl/ecs-scene-utils"

// Config
const START_ANGLE = 350
const END_ANGLE = 190

// Cooldown config
@Component("cooldownFlag")
class CooldownFlag {}
const CLAP_COOLDOWN_TIME = 6000 // Clap animation length
const COOLDOWN_SPEED = 10
const ANGLE_INCREMENT = 1 // How many degrees does the needle move

const clapMeterNeedle = new Entity()

export class ClapMeter extends Entity {
  constructor(transform: Transform) {
    super()
    engine.addEntity(this)
    this.addComponent(new GLTFShape("models/clapMeterBoard.glb"))
    this.addComponent(transform)

    // Clap meter needle
    clapMeterNeedle.addComponent(new GLTFShape("models/clapMeterNeedle.glb"))
    clapMeterNeedle.addComponent(new Transform({ position: new Vector3(0, 0.1, 0) }))
    clapMeterNeedle.setParent(this)

    // Set needle to start angle
    clapMeterNeedle.getComponent(Transform).rotation.setEuler(0, 0, START_ANGLE)
  }
  updateCooldown(): void {
    clapMeterNeedle.addComponentOrReplace(new CooldownFlag())
    clapMeterNeedle.addComponentOrReplace(
      new utils.Delay(CLAP_COOLDOWN_TIME, () => {
        clapMeterNeedle.removeComponent(CooldownFlag)
      })
    )
  }
  updateNeedle(): void {
    let currentNeedleAngle = clapMeterNeedle.getComponent(Transform).rotation.eulerAngles.z
    let currentNeedleRotation = clapMeterNeedle.getComponent(Transform).rotation

    if (currentNeedleAngle >= END_ANGLE) {
      currentNeedleRotation.setEuler(0, 0, currentNeedleAngle - ANGLE_INCREMENT)
    }
  }
}

// Cooldown System
export class CooldownSystem implements ISystem {
  update(dt: number) {
    if (clapMeterNeedle.hasComponent(CooldownFlag)) return

    let currentNeedleAngle = clapMeterNeedle.getComponent(Transform).rotation.eulerAngles.z
    let currentNeedleRotation = clapMeterNeedle.getComponent(Transform).rotation

    if (currentNeedleAngle <= START_ANGLE) {
      currentNeedleRotation.setEuler(0, 0, currentNeedleAngle + COOLDOWN_SPEED * dt)
    }
  }
}

engine.addSystem(new CooldownSystem())
