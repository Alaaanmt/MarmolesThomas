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
            Vista 3D orientativa para comparar materiales y proporciones. No representa un render definitivo ni reemplaza
            la definición final del presupuesto.
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

function materialFromTexture(path: string, fallback: string, repeat = 2) {
    const material = new THREE.MeshStandardMaterial({
        color: fallback === '#ffffff' ? '#d0d0cc' : fallback,
        roughness: 0.82,
        metalness: 0,
    })
    if (!path) return material

    textureLoader.load(path, texture => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(repeat, repeat)
        material.map = texture
        material.color.set(fallback === '#ffffff' ? '#d0d0cc' : '#f2f2f2')
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

function createSink(parent: THREE.Object3D, position: [number, number, number]) {
    const sink = new THREE.Mesh(
        new THREE.CylinderGeometry(0.52, 0.45, 0.11, 48, 1, false),
        new THREE.MeshStandardMaterial({ color: '#e8ebed', roughness: 0.18, metalness: 0.18 }),
    )
    sink.scale.z = 0.66
    sink.position.set(...position)
    sink.castShadow = true
    sink.receiveShadow = true
    parent.add(sink)

    const drain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.07, 0.012, 24),
        new THREE.MeshStandardMaterial({ color: '#737373', roughness: 0.32, metalness: 0.7 }),
    )
    drain.position.set(position[0], position[1] + 0.06, position[2] + 0.02)
    parent.add(drain)
}

function createHandle(parent: THREE.Object3D, position: [number, number, number], length = 0.34) {
    const metal = new THREE.MeshStandardMaterial({ color: '#9da3a8', roughness: 0.2, metalness: 0.86 })
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, length, 18), metal)
    handle.rotation.z = Math.PI / 2
    handle.position.set(...position)
    handle.castShadow = true
    parent.add(handle)

    for (const offset of [-length / 2 + 0.045, length / 2 - 0.045]) {
        const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.07, 18), metal)
        mount.rotation.x = Math.PI / 2
        mount.position.set(position[0] + offset, position[1], position[2] + 0.035)
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

function addFurniture(currentScene: THREE.Scene, stone: THREE.Material, melamine: THREE.Material) {
    const group = new THREE.Group()
    const width = props.isWideFurniture ? 5.2 : 4.5
    const depth = 1.65
    const cabinetHeight = 2.25
    const cabinetY = 0.08

    addBox(group, [width, cabinetHeight, depth], [0, cabinetY, 0], melamine)
    addBox(group, [width + 0.18, 0.1, depth + 0.18], [0, 1.28, 0], stone)

    if (props.hasZocalo) {
        addBox(group, [width + 0.18, 0.34, 0.08], [0, 1.49, -0.86], stone)
    }

    const doorWidth = props.isWideFurniture ? 1.18 : 1.4
    const left = -width / 2 + doorWidth / 2 + 0.06
    addBox(group, [doorWidth, 1.95, 0.045], [left, cabinetY, 0.85], melamine)
    addBox(group, [doorWidth, 1.95, 0.045], [-left, cabinetY, 0.85], melamine)
    createHandle(group, [left, cabinetY, 0.91])
    createHandle(group, [-left, cabinetY, 0.91])
    if (props.isWideFurniture) {
        const drawerX = width / 2 - 0.7
        for (let index = 0; index < 3; index += 1) {
            addBox(group, [1.12, 0.58, 0.05], [drawerX, 0.72 - index * 0.68, 0.86], melamine)
            createHandle(group, [drawerX, 0.72 - index * 0.68, 0.92], 0.3)
        }
    }
    createSink(group, [-0.5, 1.39, 0.02])
    currentScene.add(group)
}

function addCountertop(currentScene: THREE.Scene, stone: THREE.Material) {
    const group = new THREE.Group()
    addBox(group, [4.8, 0.1, 1.8], [0, 0.02, 0], stone)
    if (props.hasZocalo) addBox(group, [4.8, 0.34, 0.08], [0, 0.28, -0.86], stone)
    createSink(group, [-0.6, 0.15, 0.02])
    currentScene.add(group)
}

function addVanity(currentScene: THREE.Scene, stone: THREE.Material, melamine: THREE.Material) {
    const group = new THREE.Group()
    const width = 3.5
    const depth = 1.45
    addBox(group, [width, 1.45, depth], [0, 0, 0], melamine)
    addBox(group, [width + 0.18, 0.1, depth + 0.18], [0, 0.83, 0], stone)
    createSink(group, [0, 0.95, 0.02])
    createHandle(group, [-0.86, 0.02, 0.76])
    createHandle(group, [0.86, 0.02, 0.76])

    if (props.vanitySupport === 'patas') {
        for (const x of [-1.45, 1.45]) addBox(group, [0.12, 0.7, 0.12], [x, -1.05, 0], new THREE.MeshStandardMaterial({ color: '#3e4144', metalness: 0.65, roughness: 0.3 }))
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
    const fill = new THREE.PointLight('#d8eaff', 1.1, 12)
    fill.position.set(4, 3, 4)
    scene.add(fill)
    addRoom(scene)

    const stone = materialFromTexture(props.stoneImage, props.stoneFallback, 2.6)
    const melamine = materialFromTexture(props.melamineImage, props.melamineFallback, 2)

    if (props.showVanity) addVanity(scene, stone, melamine)
    else if (props.showFurniture) addFurniture(scene, stone, melamine)
    else if (props.showCountertop) addCountertop(scene, stone)

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
