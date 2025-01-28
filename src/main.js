import * as THREE from 'three';
import * as LocAR from 'locar';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.001, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const locar = new LocAR.LocationBased(scene, camera);

window.addEventListener("resize", e => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const cam = new LocAR.WebcamRenderer(renderer);

const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);

const loader = new GLTFLoader();

let loadedModel;
const targetLocation = { lat: 51.93601, lon: 7.65105 }; // Hardcodiertes Ziel

loader.load('car-arrow-glb/source/carArrow.glb', function (gltf) {
    loadedModel = gltf.scene;
    loadedModel.scale.set(0.2, 0.2, 0.2);
    loadedModel.position.set(0, -0.4, 0); // Position anpassen
    scene.add(loadedModel);
}, undefined, function (error) {
    console.error('Fehler beim Laden des Modells:', error);
});

locar.on("gpsupdate", (pos, distMoved) => {
    if (loadedModel) {
        updateArrowDirection(loadedModel, pos.coords, targetLocation);
    }
});

locar.startGps();

renderer.setAnimationLoop(animate);

function animate() {
    cam.update();
    deviceOrientationControls.update();
    renderer.render(scene, camera);
}

/**
 * Aktualisiert die Richtung des Navigationspfeils basierend auf der Benutzerposition und dem Ziel.
 * @param {THREE.Object3D} model - Das 3D-Modell des Pfeils.
 * @param {Object} userCoords - Die aktuellen GPS-Koordinaten des Benutzers.
 * @param {Object} targetCoords - Die Zielkoordinaten.
 */
function updateArrowDirection(model, userCoords, targetCoords) {
    const userVector = new THREE.Vector3(userCoords.longitude, userCoords.latitude, 0);
    const targetVector = new THREE.Vector3(targetCoords.lon, targetCoords.lat, 0);

    // Berechnung des Zielrichtungsvektors
    const directionVector = new THREE.Vector3().subVectors(targetVector, userVector).normalize();

    // Die Ausrichtung des Modells entsprechend der Zielrichtung setzen
    const rotationAngle = Math.atan2(directionVector.y, directionVector.x);
    model.rotation.set(0, -rotationAngle, Math.PI / 6); // Pfeil leicht nach oben kippen
}
