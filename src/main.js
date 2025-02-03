import * as THREE from 'three';
import * as LocAR from 'locar';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const locar = new LocAR.LocationBased(scene, camera);

const cam = new LocAR.WebcamRenderer(renderer);
const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);
const loader = new GLTFLoader();

const targetLocation = { lat: 51.93601, lon: 7.65105 };
let loadedModel;

const directionDisplay = document.getElementById('orientation');
const distanceDisplay = document.getElementById('distance');
const userLocationDisplay = document.getElementById('userLocation');

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        loader.load('car-arrow-glb/source/carArrow.glb', function (gltf) {
            loadedModel = gltf.scene;
            loadedModel.scale.set(0.5, 0.5, 0.5); // Größe anpassen
            scene.add(loadedModel);
            updateArrowPositionAndRotation(loadedModel, position.coords, targetLocation);
            updateDistanceDisplay(position.coords, targetLocation);
            updateUserLocationDisplay(position.coords);
        });
    });
}

locar.on("gpsupdate", (pos, distMoved) => {
    if (!pos || !pos.coords) return;
    if (loadedModel) {
        updateArrowPositionAndRotation(loadedModel, pos.coords, targetLocation);
        updateDistanceDisplay(pos.coords, targetLocation);
        updateUserLocationDisplay(pos.coords);
    }
});

locar.startGps();

renderer.setAnimationLoop(animate);

function animate() {
    cam.update();
    deviceOrientationControls.update();
    updateDirectionDisplay();
    renderer.render(scene, camera);
}

scene.add(new THREE.AxesHelper(5));  // Dies zeigt dir die Orientierung der Weltachsen.

function updateArrowPositionAndRotation(model, userCoords, targetCoords) {
    // Verwende lonLatToWorldCoords anstelle von projectLonLatToWorld
    const userWorldCoords = locar.lonLatToWorldCoords(userCoords.longitude, userCoords.latitude);
    const targetWorldCoords = locar.lonLatToWorldCoords(targetCoords.lon, targetCoords.lat);

    const directionVector = new THREE.Vector3(
        targetWorldCoords[0] - userWorldCoords[0],  // x
        0,  // y
        targetWorldCoords[2] - userWorldCoords[2]   // z
    ).normalize();

    model.position.set(
        userWorldCoords[0] + directionVector.x,
        -0.4,  // Fixe die y-Position
        userWorldCoords[2] + directionVector.z
    );

    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const angleToTarget = Math.atan2(directionVector.x, directionVector.z);
    const deviceAngle = Math.atan2(cameraDirection.x, cameraDirection.z);
    const rotationAngle = deviceAngle - angleToTarget; // Fix: Richtung invertieren
    model.rotation.set(0, rotationAngle, 0);
}

function updateDistanceDisplay(userCoords, targetCoords) {
    const distance = calculateDistance(userCoords.latitude, userCoords.longitude, targetCoords.lat, targetCoords.lon);
    distanceDisplay.innerText = `Entfernung: ${distance.toFixed(2)} Meter`;
}

function updateUserLocationDisplay(userCoords) {
    userLocationDisplay.innerText = `Position: Lat ${userCoords.latitude.toFixed(6)}, Lon ${userCoords.longitude.toFixed(6)}`;
}

function updateDirectionDisplay() {
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    const angle = (Math.atan2(cameraDirection.x, cameraDirection.z) * (180 / Math.PI) + 360) % 360;
    const compassDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    const index = Math.round(angle / 45);
    directionDisplay.innerText = `Blickrichtung: ${compassDirections[index]}`;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radius der Erde in Metern
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}
