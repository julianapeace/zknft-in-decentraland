import * as EthereumController from "@decentraland/EthereumController"
import { getProvider, Provider } from "@decentraland/web3-provider";
import * as eth from "eth-connect";
import * as crypto from "@dcl/crypto-scene-utils"
import { Door } from "./door"
import * as ui from "@dcl/ui-scene-utils"
import { Sound } from "./sound"
import * as config from "./constants/config"
import * as abi from "./constants/abi"

let zknft_contract_address = config.contractAddress
let zknft_abi = abi.abi

// On load
executeTask(async () => {
  try {
    let userAddress: string = await EthereumController.getUserAccount()
    log("jm User Address: ", userAddress)

    const provider = await getProvider();

    const requestManager: any = new eth.RequestManager(provider);

    let contract: any = await new eth.ContractFactory(requestManager, zknft_abi.abi).at(zknft_contract_address);
    log('jm contract instance: ', contract)
    let params: any = {
          proof: config.proof,
          nullifierHash: config.nullifierHash,
          entityId: config.entityId,
          challenge: config.challenge
        }
    const result = await contract.verifyIdentityChallenge(
      params.challenge,
      params.nullifierHash,
      params.entityId,
      params.proof,
    )
    log('jm result::: ', result)

  } catch (error: any) {
    log('jm error', error.toString())
  }
})

let zkNFTUI: ui.FillInPrompt

zkNFTUI = new ui.FillInPrompt(
  'Must own an NFT to enter',
  (e: string) => {
    log("jm E: ", e)
    zkNFTcheck(e)
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
  (e: any) => {
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

async function zkNFTcheck(e: string) {
  // check if string is valid by calling zknft contract
  log('jm ui input', e)
  log('jm crypto', crypto)
  let zknftContract = await crypto.contract.getContract(zknft_contract_address, zknft_abi)
  log('jm zknftContract', zknftContract)
}

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
