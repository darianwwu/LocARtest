import * as THREE from 'three';
import * as LocAR from 'locar';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.001, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const locar = new LocAR.LocationBased(scene, camera);

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const cam = new LocAR.WebcamRenderer(renderer);
const deviceOrientationControls = new LocAR.DeviceOrientationControls(camera);
const loader = new GLTFLoader();

const targetLocation = { lat: 51.93601, lon: 7.65105 }; // Hardcodiertes Ziel
let arrowMesh;
let loadedModel; // Hier die globale Definition von loadedModel

// HTML-Elemente zur Anzeige der Entfernung und Benutzerposition
const distanceDisplay = document.createElement('div');
distanceDisplay.style.position = 'absolute';
distanceDisplay.style.top = '10px';
distanceDisplay.style.left = '10px';
distanceDisplay.style.color = 'white';
distanceDisplay.style.fontSize = '18px';
distanceDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
distanceDisplay.style.padding = '10px';
distanceDisplay.style.borderRadius = '5px';
distanceDisplay.innerText = 'Entfernung: Wird geladen...';
document.body.appendChild(distanceDisplay);

const userLocationDisplay = document.createElement('div');
userLocationDisplay.style.position = 'absolute';
userLocationDisplay.style.top = '60px';
userLocationDisplay.style.left = '10px';
userLocationDisplay.style.color = 'white';
userLocationDisplay.style.fontSize = '18px';
userLocationDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
userLocationDisplay.style.padding = '10px';
userLocationDisplay.style.borderRadius = '5px';
userLocationDisplay.innerText = 'Position: Wird geladen...';
document.body.appendChild(userLocationDisplay);

// Lade das Modell nur, wenn die Geolocation des Benutzers verfügbar ist
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const userCoords = position.coords;
        
        // Laden des Modells, wenn Geolocation verfügbar ist
        loader.load('car-arrow-glb/source/carArrow.glb', function (gltf) {
            loadedModel = gltf.scene;
            loadedModel.scale.set(0.2, 0.2, 0.2);
            loadedModel.position.set(0, -0.4, 0); // Position anpassen
            scene.add(loadedModel);

            // Das Modell wird hinzugefügt und die GPS-Daten sind vorhanden
            updateArrowDirection(loadedModel, userCoords, targetLocation);
            updateDistanceDisplay(userCoords, targetLocation);
            updateUserLocationDisplay(userCoords);
        }, undefined, function (error) {
            console.error('Fehler beim Laden des Modells:', error);
        });
    });
}

// Listener für GPS-Updates
locar.on("gpsupdate", (pos) => {
    if (pos && pos.coords) {
        updateDistanceDisplay(pos.coords, targetLocation);
        updateUserLocationDisplay(pos.coords);
    }

    // Überprüfe, ob das Modell geladen wurde, bevor du versuchst, es zu aktualisieren
    if (loadedModel) {
        updateArrowDirection(loadedModel, pos.coords, targetLocation);
    }
});

locar.startGps();

renderer.setAnimationLoop(animate);

const light = new THREE.AmbientLight(0xffffff, 0.5); // Weiches Umgebungslicht
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

function animate() {
    cam.update();
    deviceOrientationControls.update();
    renderer.render(scene, camera);
}

/**
 * Aktualisiert die Entfernung zwischen Benutzer und Ziel in Metern.
 * @param {Object} userCoords - Die aktuellen GPS-Koordinaten des Benutzers.
 * @param {Object} targetCoords - Die Zielkoordinaten.
 */
function updateDistanceDisplay(userCoords, targetCoords) {
    const distance = calculateDistance(userCoords.latitude, userCoords.longitude, targetCoords.lat, targetCoords.lon);
    distanceDisplay.innerText = `Entfernung: ${distance.toFixed(2)} Meter`;
}

/**
 * Aktualisiert die Anzeige der Benutzerposition.
 * @param {Object} userCoords - Die aktuellen GPS-Koordinaten des Benutzers.
 */
function updateUserLocationDisplay(userCoords) {
    userLocationDisplay.innerText = `Position: Lat ${userCoords.latitude.toFixed(6)}, Lon ${userCoords.longitude.toFixed(6)}`;
}

/**
 * Berechnet die Entfernung zwischen zwei geografischen Punkten in Metern.
 * @param {number} lat1 - Latitude des ersten Punktes.
 * @param {number} lon1 - Longitude des ersten Punktes.
 * @param {number} lat2 - Latitude des zweiten Punktes.
 * @param {number} lon2 - Longitude des zweiten Punktes.
 * @returns {number} - Die Entfernung in Metern.
 */
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

    return R * c; // Entfernung in Metern
}

function updateArrowDirection(model, userCoords, targetCoords) {
    // Alternative Projektion: Umrechnung von Lon/Lat in vereinfachte x/z Koordinaten
    const userWorldCoords = projectLonLatToWorld(userCoords.longitude, userCoords.latitude);
    const targetWorldCoords = projectLonLatToWorld(targetCoords.lon, targetCoords.lat);

    const userVector = new THREE.Vector3(userWorldCoords.x, 0, userWorldCoords.z); // Y ist fix, da wir flach projizieren
    const targetVector = new THREE.Vector3(targetWorldCoords.x, 0, targetWorldCoords.z);

    // Berechnung des Zielrichtungsvektors
    const directionVector = new THREE.Vector3().subVectors(targetVector, userVector).normalize();

    // Berechnung des Gerätesicht-Vektors (die Richtung, in die der Benutzer schaut)
    const deviceDirection = new THREE.Vector3();
    camera.getWorldDirection(deviceDirection); // Gibt den Blickrichtung-Vektor der Kamera zurück

    // Berechnung des Winkels zwischen dem Zielrichtungsvektor und dem Blickrichtungsvektor des Geräts
    const angleToTarget = Math.atan2(directionVector.z, directionVector.x); // Zielrichtung
    const deviceAngle = Math.atan2(deviceDirection.z, deviceDirection.x); // Blickrichtung des Geräts

    // Rotation berechnen: Kombiniere Blickrichtung und Zielrichtung
    let rotationAngle = angleToTarget - deviceAngle;  // Der Unterschied im Winkel zwischen Ziel und Blickrichtung
    rotationAngle += Math.PI; // Hier drehen wir den Pfeil um 180 Grad, falls nötig

    // Setze die Rotation des Pfeils basierend auf dem berechneten Winkel
    model.rotation.set(0, rotationAngle, 0);
}


/**
 * Einfache Projektion von Lon/Lat zu x/z Weltkoordinaten.
 * @param {number} lon - Longitude
 * @param {number} lat - Latitude
 * @returns {Object} - Umgerechnete Koordinaten als {x, z}
 */
function projectLonLatToWorld(lon, lat) {
    const scale = 1000; // Skalierungsfaktor für die Projektion
    const x = lon * scale;
    const z = lat * scale;
    return { x, z };
}
