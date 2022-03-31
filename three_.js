
// #region || scene + camera

import * as THREE from "three"
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const scene = new THREE.Scene()
scene.background = null
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector("canvas"),
	alpha: true
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)
camera.position.setX(-3)

renderer.render(scene, camera)

const loader = new THREE.TextureLoader()

// #endregion
// #region || torus

// const geometry = new THREE.TorusGeometry(20, 5, 15, 30)
// texture 
// the commented one doesnt need a lightsource
// // const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true })
// const material = new THREE.MeshStandardMaterial({ color: 0xFfffff, wireframe: true })
// const torus = new THREE.Mesh(geometry, material)

// scene.add(torus)

// #endregion
// #region || Lights

const pointLight = new THREE.PointLight(0x99bbff)
pointLight.position.set(5, 5, -25) // original (5, 5, 5)

const pointLight2 = new THREE.PointLight(0x99bbff)
pointLight2.position.set(0, 0, 0)
pointLight2.intensity = 0.4

const pointLight3 = new THREE.PointLight(0xffffff)
pointLight3.position.set(0, 0, 60)
pointLight3.intensity = 0.05

const ambientLight = new THREE.AmbientLight(0xffffff)

// scene.add(pointLight, ambientLight)
scene.add(pointLight, pointLight2, pointLight3)

// #endregion
// #region || Helpers

const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50)
// scene.add(lightHelper, gridHelper)
// scene.add(lightHelper)

// for controlling with mouse
// const controls = new OrbitControls(camera, renderer.domElement)

// #endregion
// #region || Stars

function addStar() {
	const geometry = new THREE.SphereBufferGeometry(0.06, 6, 6)
	const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
	const star = new THREE.Mesh(geometry, material)
	const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
	star.position.set(x, y, z)
	scene.add(star)
}
// addStar() 500-1500 times
Array(1500).fill().forEach(addStar)

// #endregion
// #region || moon

const moonTexture = loader.load("img/moon.jpg")
const normalTexture = loader.load("img/moonnormal4.jpg")
// const heightMap = loader.load("img/moonheight.jpg") 
const moon = new THREE.Mesh(
	new THREE.SphereGeometry(3, 32, 32),
	new THREE.MeshStandardMaterial({
		map: moonTexture,
		normalMap: normalTexture,
		// displacementMap: heightMap,
		// displacementScale: 0.2
		// metalness: 0
	})
)

scene.add(moon)

moon.position.z = -20
moon.position.x = 15
moon.position.y = -5

// const moonControlled = new OrbitControls(camera, renderer.domElement)

// #endregion
// #region || Moon Ring

const moonRingTexture = loader.load("img/saturnrings7.png")
const moonRingGeometry = new THREE.RingBufferGeometry(5.5, 8, 64)
// calculations for texture map
let pos = moonRingGeometry.attributes.position
let v3 = new THREE.Vector3()
for (let i = 0; i < pos.count; i++) {
	v3.fromBufferAttribute(pos, i)
	moonRingGeometry.attributes.uv.setXY(i, v3.length() < 6 ? 0 : 1, 1)
}

const moonRingMaterial = new THREE.MeshBasicMaterial({
	map: moonRingTexture,
	side: THREE.DoubleSide,
	opacity: 0.15,
	transparent: true
})

const moonRing = new THREE.Mesh(moonRingGeometry, moonRingMaterial)

moonRing.position.z = -20
moonRing.position.x = 15
moonRing.position.y = -5
moonRing.rotation.x = 1
moonRing.rotation.y = 0.7

scene.add(moonRing)

// #endregion
// #region || blueplanet

// const blueplanetTexture = loader.load("img/blueplanet.jpg")
// const blueplanetNormalTexture = loader.load("img/moonnormal4.jpg")

// const blueplanet = new THREE.Mesh(
// 	new THREE.SphereGeometry(3, 32, 32),
// 	new THREE.MeshStandardMaterial({
// 		map: blueplanetTexture,
// 		normalMap: blueplanetNormalTexture,
// 		// metalness: 1
// 	})
// )

// scene.add(blueplanet)

// blueplanet.position.x = -15
// blueplanet.position.y = 5
// blueplanet.position.z = 9

// const moonControlled = new OrbitControls(camera, renderer.domElement)

// #endregion
// #region || scroll + animation

window.addEventListener('resize', onWindowResize, false);

// always keep correct aspect ratio
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	// renderer.setSize(window.innerWidth, window.innerHeight);

}

function moveCamera() {
	// how far the scroll position is from the top of page
	const t = document.body.getBoundingClientRect().top

	camera.position.z = t * -0.01
	camera.position.x = t * -0.0002
	camera.position.y = t * -0.0002
}

moveCamera()

document.body.onscroll = moveCamera

function animate() {
	requestAnimationFrame(animate)

	camera.rotation.x -= 0.0002
	camera.rotation.y -= 0.0002
	camera.rotation.z -= 0.0002

	moon.rotation.x += 0.003

	// controls.update()

	renderer.render(scene, camera)
}

animate()

// #endregion