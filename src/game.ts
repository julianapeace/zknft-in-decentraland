import * as EthereumController from "@decentraland/EthereumController"
import * as crypto from "@dcl/crypto-scene-utils"
import { Door } from "./door"
import * as ui from "@dcl/ui-scene-utils"
import { Sound } from "./sound"

let userAddress: string
const contractAddress = "0xef3d2fd93126bbee4f0cd6a8beb16b2cfd1e0056" // (JULIE) contract
let zkNFTUI: ui.FillInPrompt

zkNFTUI = new ui.FillInPrompt(
  'Must own an NFT to enter',
  (e: string) => {
    log("E: ", e)
    // checkTokens()
  },
  'Send',
  'Enter commitment hash here',
  true
)
zkNFTUI.hide()

Input.instance.subscribe(
  'BUTTON_DOWN',
  ActionButton.PRIMARY,
  false,
  (e) => {
    if (zkNFTUI) {
      if (!zkNFTUI.background.visible) {
        zkNFTUI.show()
      } else {
        zkNFTUI.hide()
      }
    }
  }
)

// Sounds
// const prettySound = new Sound(new AudioClip("sounds/scene.mp3"), false)
const openDoorSound = new Sound(new AudioClip("sounds/openDoor.mp3"), false)
const accessDeniedSound = new Sound(new AudioClip("sounds/accessDenied.mp3"), false)
const jazzMuffledSound = new Sound(new AudioClip("sounds/jazzMuffled.mp3"), true, true)
const jazzSound = new Sound(new AudioClip("sounds/jazz.mp3"), true, true)
jazzSound.getComponent(AudioSource).volume = 0.0


// Models
// const temple = new GLTFShape('models/temple.glb')
//
// const zenTemple = new Entity()
//
// zenTemple.addComponent(temple)
// zenTemple.addComponent(new Transform({ position: new Vector3(10, 0, 10) }))
// zenTemple.getComponent(Transform).scale.setAll(2)
// zenTemple.getComponent(Transform).rotate(Vector3.Up(), 180)
//
//
// zenTemple.addComponent(
//   new OnPointerDown(
//     () => {
//       prettySound.getComponent(AudioSource).playOnce()
//     },
//     {
//       button: ActionButton.PRIMARY,
//       hoverText: "Click here Julie",
//       showFeedback: true,
//     }
//   )
// )
//
// engine.addEntity(zenTemple)







// Base
const base = new Entity()
base.addComponent(new GLTFShape("models/baseDarkWithCollider.glb"))
engine.addEntity(base)


// Facade
const facade = new Entity()
facade.addComponent(new GLTFShape("models/facade.glb"))
facade.addComponent(new Transform({ position: new Vector3(8, 0.05, 10) }))
facade.getComponent(Transform).rotate(Vector3.Up(), 180)
engine.addEntity(facade)

// Door
const door = new Door(new GLTFShape("models/door.glb"))
door.setParent(facade)
door.addComponent(
  new OnPointerDown(
    () => {
      checkTokens()
    },
    {
      button: ActionButton.PRIMARY,
      hoverText: "Enter Club",
      showFeedback: true,
    }
  )
)


// UI
let noSign = new ui.CenterImage("images/no-sign.png", 1, true, 0, 20, 128, 128, {
  sourceHeight: 512,
  sourceWidth: 512,
  sourceLeft: 0,
  sourceTop: 0,
})

// On load
executeTask(async () => {
  try {
    userAddress = await EthereumController.getUserAccount()
    log("User Address: ", userAddress)
  } catch (error) {
    log(error.toString())
  }
})

// Check player's wallet to see if they're holding any tokens relating to that contract address
async function checkTokens() {
  // let balance = await crypto.currency.balance(contractAddress, userAddress)
  let balance = await crypto.nft.checkTokens('0x22c1f6050e56d2876009903609a2cc3fef83b415', 845) // Scenario 2 POAP
  log("jm BALANCE: ", balance)

  // if (Number(balance) > 0) {
  if (Number(balance)) { // Scenario 2 POAP
    door.playDoorOpen()
    openDoorSound.getComponent(AudioSource).playOnce()
    jazzSound.getComponent(AudioSource).volume = 1.0
  } else {
    noSign.show(1)
    accessDeniedSound.getComponent(AudioSource).playOnce()
    jazzMuffledSound.getComponent(AudioSource).volume = 1.0
  }
}
