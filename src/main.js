import { AbsoluteDeviceOrientationControls } from "./AbsoluteDeviceOrientationControls.js";
window.onload = () => {
  let markerAdded = false;
  let initialARHeading = null;
  let initialTrueHeading = null;
  let calibrationOffset = null; // (initialTrueHeading - initialARHeading) mod 360

  const targetCoords = { latitude: 51.935175, longitude: 7.649708 };
  const currentPosition = { latitude: null, longitude: null };
  const distances = [3, 5.5, 12];

  const scene = document.querySelector("a-scene");
  const cameraEl = document.querySelector("[gps-new-camera]");
  cameraEl.setAttribute("camera", { far: 100 });
  
  // Zusätzliche Anzeigeelemente (sind auch im Overlay sichtbar)
  const distanceDisplay = document.createElement("div");
  distanceDisplay.id = "distanceDisplay";
  document.body.appendChild(distanceDisplay);

  // Im Overlay definierte Elemente werden in index.html existieren:
  const compassContainer = document.getElementById("compassContainer");
  const compassArrow = document.getElementById("compassArrow");
  const compassText = document.getElementById("compassText");

  const absoluteDeviceOrientationControls = new AbsoluteDeviceOrientationControls(cameraEl.object3D);
  
  window.addEventListener('camera-rotation-change', () => {
    absoluteDeviceOrientationControls.update();
    
    // Bei iOS: Einmalige Kalibrierung durchführen, falls noch nicht erfolgt
    if (AbsoluteDeviceOrientationControls.isIOS && absoluteDeviceOrientationControls.deviceOrientation) {
      if (calibrationOffset === null) {
        initialARHeading = quaternionToHeading(absoluteDeviceOrientationControls.object.quaternion);
        initialTrueHeading = absoluteDeviceOrientationControls.deviceOrientation.webkitCompassHeading || 0;
        calibrationOffset = (initialTrueHeading - initialARHeading + 360) % 360;
        console.log("Kalibrierungs-Offset:", calibrationOffset);
      }
    }
    
    // Kompassanzeige aktualisieren: Bei iOS verwenden wir den absoluten Wert, ansonsten den aus der Quaternion
    let compassHeading = (AbsoluteDeviceOrientationControls.isIOS && absoluteDeviceOrientationControls.deviceOrientation)
                           ? (absoluteDeviceOrientationControls.deviceOrientation.webkitCompassHeading || 0)
                           : getHeadingFromQuaternion(absoluteDeviceOrientationControls.object.quaternion);
    compassText.innerText = `${Math.round(compassHeading)}°`;
    compassArrow.style.transform = `rotate(${-compassHeading}deg)`;

    // Falls noch nicht kalibriert: Prüfe, ob der Kompass in Richtung Norden (0°) zeigt
    // Wir nehmen hier eine Toleranz von ±5° an.
    if (!localStorage.getItem("calibrated")) {
      if (compassHeading <= 5 || compassHeading >= 355) {
        console.log("Ausrichtung erkannt. Kalibrierung abgeschlossen.");
        localStorage.setItem("calibrated", "true");
        // Nach einer kurzen Verzögerung neu laden, sodass die volle App geladen wird
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    }
    
    // Optional: Hier kannst du auch deine Richtungsprüfung für den Ziel-Marker einbauen …
    if (currentPosition.latitude !== null && currentPosition.longitude !== null) {
      const deviceHeading = (AbsoluteDeviceOrientationControls.isIOS && absoluteDeviceOrientationControls.deviceOrientation)
                              ? (absoluteDeviceOrientationControls.deviceOrientation.webkitCompassHeading || 0)
                              : quaternionToEuler(absoluteDeviceOrientationControls.object.quaternion).yaw;
      checkIfPointingAtTarget(deviceHeading,
        currentPosition.latitude,
        currentPosition.longitude,
        targetCoords.latitude,
        targetCoords.longitude
      );
    }
  });
  
  function getHeadingFromQuaternion(quaternion) {
    const euler = new THREE.Euler().setFromQuaternion(quaternion, 'YXZ');
    let heading = THREE.MathUtils.radToDeg(euler.y);
    heading = Math.abs((heading - 360) % 360);
    return heading;
  }
  
  cameraEl.addEventListener("gps-camera-update-position", (e) => {
    currentPosition.latitude = e.detail.position.latitude;
    currentPosition.longitude = e.detail.position.longitude;
    if (currentPosition.latitude && currentPosition.longitude) {
      const distanceToTarget = computeDistance(
        currentPosition.latitude,
        currentPosition.longitude,
        targetCoords.latitude,
        targetCoords.longitude
      );
      distanceDisplay.innerText = `Entfernung zum Ziel: ${Math.round(distanceToTarget)} m`;
      
      const originalBearing = computeBearing(
        currentPosition.latitude,
        currentPosition.longitude,
        targetCoords.latitude,
        targetCoords.longitude
      );
      let arBearing = originalBearing;
      if (AbsoluteDeviceOrientationControls.isIOS && calibrationOffset !== null) {
        arBearing = (originalBearing - calibrationOffset + 360) % 360;
        console.log("originalBearing:", originalBearing, "-> arBearing:", arBearing);
      }
      
      document.querySelectorAll("a-sphere").forEach(sphere => sphere.remove());
      distances.forEach((distance, index) => {
        const sphere = document.createElement("a-sphere");
        sphere.setAttribute("color", "#00008B");
        sphere.setAttribute("opacity", "0.7");
        const newCoords = getIntermediateCoordsFromBearing(
          currentPosition.latitude,
          currentPosition.longitude,
          distance,
          arBearing
        );
        sphere.setAttribute("gps-new-entity-place", { 
          latitude: newCoords.latitude, 
          longitude: newCoords.longitude 
        });
        let radius = (index === 0) ? 0.3 : (index === 1 ? 0.4 : 0.65);
        sphere.setAttribute("radius", radius.toString());
        scene.appendChild(sphere);
      });
      
      if (!markerAdded) {
        const marker = document.createElement("a-image");
        marker.setAttribute("src", "./images/map-marker.png");
        marker.setAttribute("width", "4");
        marker.setAttribute("height", "4");
        marker.setAttribute("look-at", "[gps-new-camera]");
        marker.setAttribute("gps-new-entity-place", { 
          latitude: targetCoords.latitude, 
          longitude: targetCoords.longitude 
        });
        scene.appendChild(marker);
        markerAdded = true;
      }
    } else {
      console.error("Keine aktuellen Koordinaten vorhanden!");
      showMessage("Keine aktuellen Koordinaten vorhanden!");
    }
  });
  
  // (Restliche Funktionen wie checkIfPointingAtTarget, quaternionToHeading, getIntermediateCoordsFromBearing, computeDistance, computeBearing, quaternionToEuler, angleDifference, showMessage bleiben unverändert.)
  
  function checkIfPointingAtTarget(deviceHeading, userLat, userLon, targetLat, targetLon) {
    const targetBearing = computeBearing(targetLat, targetLon, userLat, userLon);
    const diff = angleDifference(deviceHeading, targetBearing);
    const tolerance = 15;
    if (diff < tolerance) {
      kompassGruenMachen();
    } else {
      compassArrow.style.color = "red";
    }
  }
  
  function kompassGruenMachen() {
    compassArrow.style.color = "green";
  }
  
  function quaternionToHeading(quaternion) {
    const { x, y, z, w } = quaternion;
    let heading = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z)) * 180 / Math.PI;
    if (heading < 0) heading += 360;
    return heading;
  }
  
  function getIntermediateCoordsFromBearing(lat, lon, offsetMeters, bearingDegrees) {
    const rad = Math.PI / 180;
    const R = 6371000;
    const bearing = bearingDegrees * rad;
    const lat1 = lat * rad;
    const lon1 = lon * rad;
    const newLat = Math.asin(
      Math.sin(lat1) * Math.cos(offsetMeters / R) +
      Math.cos(lat1) * Math.sin(offsetMeters / R) * Math.cos(bearing)
    );
    const newLon = lon1 + Math.atan2(
      Math.sin(bearing) * Math.sin(offsetMeters / R) * Math.cos(lat1),
      Math.cos(offsetMeters / R) - Math.sin(lat1) * Math.sin(newLat)
    );
    return { latitude: newLat / rad, longitude: newLon / rad };
  }
  
  function computeDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }
  
  function showMessage(msg) {
    alert(msg);
  }
  
  function computeBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const x = Math.sin(Δλ) * Math.cos(φ2);
    const y = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    let bearing = Math.atan2(x, y) * 180 / Math.PI;
    return (bearing + 360) % 360;
  }
  
  function quaternionToEuler(q) {
    const { x, y, z, w } = q;
    const sinr_cosp = 2 * (w * x + y * z);
    const cosr_cosp = 1 - 2 * (x * x + y * y);
    const roll = Math.atan2(sinr_cosp, cosr_cosp);
    const sinp = 2 * (w * y - z * x);
    let pitch = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp);
    const siny_cosp = 2 * (w * z + x * y);
    const cosy_cosp = 1 - 2 * (y * y + z * z);
    let yaw = Math.atan2(siny_cosp, cosy_cosp) * 180 / Math.PI;
    if (yaw < 0) yaw += 360;
    return { roll: roll * 180 / Math.PI, pitch: pitch * 180 / Math.PI, yaw: yaw };
  }
  
  function angleDifference(angle1, angle2) {
    let diff = Math.abs(angle1 - angle2) % 360;
    if (diff > 180) diff = 360 - diff;
    return diff;
  }
};
