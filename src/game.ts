import { Sound } from "./sound"

const zenTemple = new Entity()

const temple = new GLTFShape('models/temple.glb')

zenTemple.addComponent(temple)
zenTemple.addComponent(new Transform({ position: new Vector3(10, 0, 10) }))
zenTemple.getComponent(Transform).scale.setAll(2)
zenTemple.getComponent(Transform).rotate(Vector3.Up(), 180)

const prettySound = new Sound(new AudioClip("sounds/scene.mp3"), false)


zenTemple.addComponent(
  new OnPointerDown(
    () => {
      prettySound.getComponent(AudioSource).playOnce()
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: "Click here Julie",
      showFeedback: true,
    }
  )
)

engine.addEntity(zenTemple)
