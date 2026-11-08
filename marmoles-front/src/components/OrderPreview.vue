<template>
  <div class="min-w-0 space-y-3">
    <div ref="sceneHost" class="relative h-[27rem] min-w-0 overflow-hidden border border-gray-200 bg-[#d8d1c7] dark:border-neutral-700">
      <canvas ref="canvas" class="block h-full w-full" :aria-label="`Vista 3D orientativa de ${previewLabel}`" />
      <div class="pointer-events-none absolute bottom-3 left-3 bg-black/55 px-3 py-2 text-xs text-white">
        Arrastrá para girar · rueda para acercar
      </div>
      <div v-if="isLoading" class="absolute inset-0 grid place-items-center bg-white/70 text-sm text-gray-600 dark:bg-neutral-950/70 dark:text-gray-300">
        Preparando vista 3D…
      </div>
    </div>
    <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
      Vista 3D orientativa para comparar materiales y proporciones. No representa un render definitivo ni reemplaza la definición final del presupuesto.
    </p>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const props = withDefaults(defineProps<{
  showCountertop?: boolean
  showFurniture?: boolean
  showVanity?: boolean
  vanitySupport?: 'flotante' | 'patas' | ''
  melamineImage?: string
  stoneImage?: string
  melamineFallback?: string
  stoneFallback?: string
  hasZocalo?: boolean
  isWideFurniture?: boolean
  previewLabel?: string
}>(), {
  showCountertop: false,
  showFurniture: false,
  showVanity: false,
  vanitySupport: '',
  melamineImage: '',
  stoneImage: '',
  melamineFallback: '#d8d2c8',
  stoneFallback: '#d1d5db',
  hasZocalo: false,
  isWideFurniture: false,
  previewLabel: 'la combinación seleccionada',
})

const canvas = ref<HTMLCanvasElement | null>(null)
const sceneHost = ref<HTMLDivElement | null>(null)
const isLoading = ref(true)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let controls: OrbitControls | null = null
let resizeObserver: ResizeObserver | null = null
let animationFrame = 0

const textureLoader = new THREE.TextureLoader()

// Material de acero inoxidable brillante para bacha y canilla
const steelMaterial = new THREE.MeshStandardMaterial({
  color: '#b0b8bc',
  roughness: 0.2,
  metalness: 0.85,
})

// Cargador optimizado con filtrado Anisotrópico (Máxima Nitidez de Lejos)
function materialFromTexture(
  path: string, 
  fallback: string, 
  repeatU = 1.2, 
  repeatV = 1.2, 
  roughness = 0.5, 
  metalness = 0.05
) {
  const material = new THREE.MeshStandardMaterial({
    color: fallback === '#ffffff' ? '#d0d0cc' : fallback,
    roughness: roughness,
    metalness: metalness,
  })

  if (!path) return material

  textureLoader.load(path, texture => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(repeatU, repeatV)

    // Configuración para que NO se desenfoque de lejos
    texture.minFilter = THREE.LinearMipmapLinearFilter
    texture.magFilter = THREE.LinearFilter

    if (renderer) {
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    }

    material.map = texture
    material.color.set('#ffffff')
    material.needsUpdate = true
  })

  return material
}

function addBox(
  parent: THREE.Object3D,
  size: [number, number, number],
  position: [number, number, number],
  material: THREE.Material,
) {
  const geometry = new THREE.BoxGeometry(...size)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(...position)
  mesh.castShadow = true
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}

// Bacha de encastrar + Canilla cuello de cisne (Monocomando)
function createSinkAndFaucet(parent: THREE.Object3D, position: [number, number, number]) {
  const group = new THREE.Group()

  // 1. Marco exterior / borde de la bacha (encastre sobre la mesada)
  const rim = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.02, 0.85),
    steelMaterial
  )
  rim.position.set(...position)
  rim.castShadow = true
  rim.receiveShadow = true
  group.add(rim)

  // 2. Taza / Interior hundido de la bacha
  const basin = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.03, 0.72),
    new THREE.MeshStandardMaterial({ color: '#2b3033', roughness: 0.3, metalness: 0.7 })
  )
  basin.position.set(position[0], position[1] + 0.008, position[2])
  group.add(basin)

  // Sopapa de rejilla central
  const drain = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.015, 24),
    new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.3, metalness: 0.9 }),
  )
  drain.position.set(position[0], position[1] + 0.018, position[2])
  group.add(drain)

  // 3. CANILLA MONOCOMANDO (Cuello de Cisne)
  const faucetBaseX = position[0] + 0.42
  const faucetBaseZ = position[2] - 0.28
  const faucetBaseY = position[1] + 0.02

  const faucetBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.06, 0.05, 24),
    steelMaterial
  )
  faucetBase.position.set(faucetBaseX, faucetBaseY + 0.025, faucetBaseZ)
  group.add(faucetBase)

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(faucetBaseX, faucetBaseY + 0.05, faucetBaseZ),
    new THREE.Vector3(faucetBaseX, faucetBaseY + 0.45, faucetBaseZ),
    new THREE.Vector3(faucetBaseX - 0.15, faucetBaseY + 0.55, faucetBaseZ + 0.15),
    new THREE.Vector3(faucetBaseX - 0.22, faucetBaseY + 0.42, faucetBaseZ + 0.22),
  ])

  const tubeGeometry = new THREE.TubeGeometry(curve, 32, 0.025, 16, false)
  const tubeMesh = new THREE.Mesh(tubeGeometry, steelMaterial)
  tubeMesh.castShadow = true
  group.add(tubeMesh)

  const lever = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.12, 16),
    steelMaterial
  )
  lever.rotation.z = Math.PI / 4
  lever.position.set(faucetBaseX + 0.04, faucetBaseY + 0.1, faucetBaseZ)
  group.add(lever)

  parent.add(group)
}

function createHandle(parent: THREE.Object3D, position: [number, number, number], length = 0.32) {
  const metal = new THREE.MeshStandardMaterial({ color: '#9da3a8', roughness: 0.2, metalness: 0.86 })
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, length, 18), metal)
  handle.rotation.z = Math.PI / 2
  handle.position.set(...position)
  handle.castShadow = true
  parent.add(handle)

  for (const offset of [-length / 2 + 0.04, length / 2 - 0.04]) {
    const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 18), metal)
    mount.rotation.x = Math.PI / 2
    mount.position.set(position[0] + offset, position[1], position[2] + 0.025)
    parent.add(mount)
  }
}

function addRoom(currentScene: THREE.Scene) {
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 9),
    new THREE.MeshStandardMaterial({ color: '#ded8cf', roughness: 0.92 }),
  )
  wall.position.set(0, 3.8, -2.2)
  wall.receiveShadow = true
  currentScene.add(wall)

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(15, 12),
    new THREE.MeshStandardMaterial({ color: '#a58c73', roughness: 0.88 }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.05
  floor.receiveShadow = true
  currentScene.add(floor)
}

function buildKitchenCombo(
  currentScene: THREE.Scene,
  stone: THREE.Material,
  zocaloStone: THREE.Material,
  melamine: THREE.Material
) {
  const group = new THREE.Group()

  const width = props.isWideFurniture ? 5.4 : 4.5
  const depth = 1.65
  const cabinetHeight = 1.85
  const cabinetY = 0.05

  // 1. Mueble base (Melamina)
  addBox(group, [width, cabinetHeight, depth - 0.08], [0, cabinetY, -0.04], melamine)

  // Patas metálicas al piso
  const legMaterial = new THREE.MeshStandardMaterial({ color: '#d0d5d8', metalness: 0.8, roughness: 0.2 })
  const legPositions = [
    [-width / 2 + 0.2, -0.92, depth / 2 - 0.15],
    [width / 2 - 0.2, -0.92, depth / 2 - 0.15],
    [-width / 2 + 0.2, -0.92, -depth / 2 + 0.15],
    [width / 2 - 0.2, -0.92, -depth / 2 + 0.15],
  ]
  legPositions.forEach(pos => {
    addBox(group, [0.08, 0.2, 0.08], pos as [number, number, number], legMaterial)
  })

  // Frente: Puertas a la izquierda + Cajonera a la derecha
  const doorsWidth = width * 0.65
  const drawersWidth = width * 0.35

  const doorWidth = doorsWidth / 2
  const leftStart = -width / 2 + doorWidth / 2

  for (let i = 0; i < 2; i++) {
    const posX = leftStart + i * doorWidth
    addBox(group, [doorWidth - 0.03, cabinetHeight - 0.06, 0.04], [posX, cabinetY, depth / 2 - 0.02], melamine)
    createHandle(group, [posX, cabinetY + cabinetHeight / 2 - 0.2, depth / 2 + 0.01])
  }

  const drawerX = width / 2 - drawersWidth / 2
  const drawerHeight = (cabinetHeight - 0.08) / 3
  const drawerStartY = cabinetY - cabinetHeight / 2 + drawerHeight / 2 + 0.02

  for (let j = 0; j < 3; j++) {
    const posY = drawerStartY + j * drawerHeight
    addBox(group, [drawersWidth - 0.03, drawerHeight - 0.03, 0.04], [drawerX, posY, depth / 2 - 0.02], melamine)
    createHandle(group, [drawerX, posY, depth / 2 + 0.01], 0.28)
  }

  // 2. MESADA SUPERIOR (PIEDRA)
  const countertopThickness = 0.12
  const countertopY = cabinetY + cabinetHeight / 2 + countertopThickness / 2

  // Placa principal
  addBox(group, [width + 0.15, countertopThickness, depth + 0.15], [0, countertopY, 0], stone)

  // Zócalo trasero
  if (props.hasZocalo) {
    addBox(group, [width + 0.15, 0.35, 0.06], [0, countertopY + 0.18, -depth / 2 - 0.02], zocaloStone)
  }

  // 3. BACHA Y CANILLA
  createSinkAndFaucet(group, [-width * 0.15, countertopY + 0.06, 0.02])

  currentScene.add(group)
}

function addCountertop(currentScene: THREE.Scene, stone: THREE.Material, zocaloStone: THREE.Material) {
  const group = new THREE.Group()
  addBox(group, [4.8, 0.1, 1.8], [0, 0.02, 0], stone)
  if (props.hasZocalo) addBox(group, [4.8, 0.34, 0.08], [0, 0.28, -0.86], zocaloStone)
  createSinkAndFaucet(group, [-0.6, 0.15, 0.02])
  currentScene.add(group)
}

function addVanity(currentScene: THREE.Scene, stone: THREE.Material, melamine: THREE.Material) {
  const group = new THREE.Group()
  const width = 3.5
  const depth = 1.45

  addBox(group, [width, 1.45, depth], [0, 0, 0], melamine)
  addBox(group, [width + 0.18, 0.1, depth + 0.18], [0, 0.83, 0], stone)
  createSinkAndFaucet(group, [0, 0.95, 0.02])
  createHandle(group, [-0.86, 0.02, 0.76])
  createHandle(group, [0.86, 0.02, 0.76])

  if (props.vanitySupport === 'patas') {
    for (const x of [-1.45, 1.45]) {
      addBox(group, [0.12, 0.7, 0.12], [x, -1.05, 0], new THREE.MeshStandardMaterial({ color: '#3e4144', metalness: 0.65, roughness: 0.3 }))
    }
  } else {
    addBox(group, [width + 0.2, 0.08, 0.12], [0, -0.77, 0], new THREE.MeshStandardMaterial({ color: '#252525', roughness: 0.4 }))
  }
  currentScene.add(group)
}

function disposeScene() {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  controls?.dispose()
  resizeObserver?.disconnect()
  renderer?.dispose()
  scene?.traverse(object => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose()
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach(material => {
        material.dispose()
        if (material instanceof THREE.MeshStandardMaterial) material.map?.dispose()
      })
    }
  })
  renderer = null
  scene = null
  camera = null
  controls = null
}

function renderScene() {
  if (!canvas.value || !sceneHost.value) return

  isLoading.value = true
  disposeScene()

  scene = new THREE.Scene()
  scene.background = new THREE.Color('#d8d1c7')

  camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
  camera.position.set(6.7, 4.6, 7.8)
  camera.lookAt(0, 0.45, 0)

  renderer = new THREE.WebGLRenderer({ canvas: canvas.value, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.96

  const ambient = new THREE.HemisphereLight('#fffaf2', '#55483e', 1.35)
  scene.add(ambient)

  const key = new THREE.DirectionalLight('#fff7e8', 2.5)
  key.position.set(-4, 8, 5)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  scene.add(key)

  const fill = new THREE.PointLight('#d8eaff', 1.0, 12)
  fill.position.set(4, 3, 4)
  scene.add(fill)

  addRoom(scene)

  // 1. Textura de la Mesada: repetición sutil (1.2x1.0) para evitar que se noten las líneas de corte/costuras (tiling)
  const stone = materialFromTexture(props.stoneImage, props.stoneFallback, 1.2, 1.0, 0.35, 0.05)
  
  // 2. Textura del Zócalo: repetición ajustada para mantener escala continua
  const zocaloStone = materialFromTexture(props.stoneImage, props.stoneFallback, 2.2, 0.4, 0.35, 0.05)

  // 3. Melamina
  const melamine = materialFromTexture(props.melamineImage, props.melamineFallback, 1.5, 1.5, 0.75, 0.0)

  if (props.showVanity) addVanity(scene, stone, melamine)
  else if (props.showFurniture) buildKitchenCombo(scene, stone, zocaloStone, melamine)
  else if (props.showCountertop) addCountertop(scene, stone, zocaloStone)

  controls = new OrbitControls(camera, canvas.value)
  controls.enableDamping = true
  controls.target.set(0, 0.45, 0)
  controls.minDistance = 4.5
  controls.maxDistance = 12
  controls.maxPolarAngle = Math.PI * 0.48
  controls.minPolarAngle = Math.PI * 0.28

  resizeObserver = new ResizeObserver(() => {
    if (!renderer || !camera || !sceneHost.value) return
    const { width, height } = sceneHost.value.getBoundingClientRect()
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  })
  resizeObserver.observe(sceneHost.value)

  isLoading.value = false

  const animate = () => {
    if (!renderer || !scene || !camera || !controls) return
    controls.update()
    renderer.render(scene, camera)
    animationFrame = requestAnimationFrame(animate)
  }
  animate()
}

watch(
  () => [
    props.showCountertop,
    props.showFurniture,
    props.showVanity,
    props.vanitySupport,
    props.melamineImage,
    props.stoneImage,
    props.melamineFallback,
    props.stoneFallback,
    props.hasZocalo,
    props.isWideFurniture,
  ],
  () => {
    if (canvas.value) renderScene()
  },
)

onMounted(() => renderScene())
onBeforeUnmount(disposeScene)
</script>