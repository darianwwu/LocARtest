window.onload = () => {
  let markerAdded = false,
      calibrationQuaternion = null,
      currentQuaternion = null;

  const targetCoords = {
      latitude: 51.935175,
      longitude: 7.649708
  };

  const currentPosition = {
      latitude: null,
      longitude: null
  };

  const distances = [3, 5.5, 12];

  const scene = document.querySelector("a-scene");
  const cameraEl = document.querySelector("[gps-new-camera]");
  cameraEl.setAttribute("camera", { far: 100 });
  
  // Entfernung Anzeige
  const distanceDisplay = document.createElement("div");
  distanceDisplay.id = "distanceDisplay";
  document.body.appendChild(distanceDisplay);

  // Kompassanzeige
  const compassContainer = document.createElement("div");
  compassContainer.id = "compassContainer";
  document.body.appendChild(compassContainer);

  const compassArrow = document.createElement("div");
  compassArrow.id = "compassArrow";
  compassArrow.innerText = "↑";
  compassContainer.appendChild(compassArrow);

  const compassText = document.createElement("div");
  compassText.id = "compassText";
  compassContainer.appendChild(compassText);

  let sensor;
  if ("AbsoluteOrientationSensor" in window) {
      sensor = new AbsoluteOrientationSensor({ frequency: 60 });
  } else if ("RelativeOrientationSensor" in window) {
      sensor = new RelativeOrientationSensor({ frequency: 60 });
  } else {
      showMessage("Gerät unterstützt keine Orientation Sensoren.");
      return;
  }

  sensor.addEventListener("reading", () => {
      currentQuaternion = [...sensor.quaternion];
      updateCompass(sensor.quaternion);

      if(currentPosition.latitude && currentPosition.longitude){
        console.log("Nutzerstandort:" + currentPosition.latitude + " " + currentPosition.longitude);
        checkIfPointingAtTarget(sensor.quaternion, currentPosition.latitude, currentPosition.longitude, targetCoords.latitude, targetCoords.longitude);
      }
    });

  sensor.addEventListener("error", e => {
      console.error("Sensor error: ", e.error);
      showMessage("Fehler beim Sensor!");
  });

  sensor.start();

  cameraEl.addEventListener("gps-camera-update-position", (e) => {
      currentPosition.latitude = e.detail.position.latitude;
      currentPosition.longitude = e.detail.position.longitude;

      if(currentPosition.latitude && currentPosition.longitude) {
        const distanceToTarget = computeDistance(currentPosition.latitude, currentPosition.longitude, targetCoords.latitude, targetCoords.longitude);
        distanceDisplay.innerText = `Entfernung zum Ziel: ${Math.round(distanceToTarget)} m`;
      
        let adjustedHeading = 0;
        if (calibrationQuaternion) {
            adjustedHeading = quaternionToHeading(currentQuaternion) - quaternionToHeading(calibrationQuaternion);
        }

        document.querySelectorAll("a-sphere").forEach(sphere => sphere.remove());

        distances.forEach((distance, index) => {
            const sphere = document.createElement("a-sphere");
            sphere.setAttribute("color", "#00008B");
            sphere.setAttribute("opacity", "0.7");

            const newCoords = getIntermediateCoords(currentPosition.latitude, currentPosition.longitude, targetCoords.latitude, targetCoords.longitude, distance, adjustedHeading);
            sphere.setAttribute("gps-new-entity-place", { latitude: newCoords.latitude, longitude: newCoords.longitude });
            let radius;
            if (index === 0) {
                radius = 0.3; // kleinste Kugel
            } else if (index === 1) {
                radius = 0.4;  // mittelgroße Kugel
            } else if (index === 2) {
                radius = 0.65;  // größte Kugel
            }
            sphere.setAttribute("radius", radius.toString());
            scene.appendChild(sphere);
        });

        if (!markerAdded) {
            const marker = document.createElement("a-image");
            marker.setAttribute("src", "./images/map-marker.png");
            marker.setAttribute("width", "4");
            marker.setAttribute("height", "4");
            marker.setAttribute("look-at", "[gps-new-camera]");
            marker.setAttribute("gps-new-entity-place", { latitude: targetCoords.latitude, longitude: targetCoords.longitude });

            scene.appendChild(marker);
            markerAdded = true;
        }
      }
      else {
        console.error("Keine aktuellen Koordinaten vorhanden!");
        showMessage("Keine aktuellen Koordinaten vorhanden!");
      }
  });

  function updateCompass(quaternion) {
      if (!quaternion) return;
      const heading = quaternionToHeading(quaternion);
      compassArrow.style.transform = `rotate(${-heading}deg)`;
      compassText.innerText = `${Math.round(heading)}°`;
  }

  function quaternionToHeading(quaternion) {
      let [x, y, z, w] = quaternion;
      let heading = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z)) * 180 / Math.PI;
      if (heading < 0) heading += 360;
      return calibrationQuaternion ? (heading - quaternionToHeading(calibrationQuaternion) + 360) % 360 : heading;
  }

  function getIntermediateCoords(lat1, lon1, lat2, lon2, offsetMeters, headingOffset) {
      const newCoords = computeOffsetCoords(lat1, lon1, lat2, lon2, offsetMeters);
      const earthRadius = 6371000;
      const latOffset = newCoords.latitude - lat1;
      const lonOffset = newCoords.longitude - lon1;

      const rotatedLat = latOffset * Math.cos(headingOffset) - lonOffset * Math.sin(headingOffset);
      const rotatedLon = latOffset * Math.sin(headingOffset) + lonOffset * Math.cos(headingOffset);

      return {
          latitude: lat1 + rotatedLat,
          longitude: lon1 + rotatedLon
      };
  }

  function computeOffsetCoords(lat1, lon1, lat2, lon2, offsetMeters) {
      const rad = Math.PI / 180;
      const dLat = (lat2 - lat1) * rad;
      const dLon = (lon2 - lon1) * rad;

      const y = Math.sin(dLon) * Math.cos(lat2 * rad);
      const x = Math.cos(lat1 * rad) * Math.sin(lat2 * rad) - Math.sin(lat1 * rad) * Math.cos(lat2 * rad) * Math.cos(dLon);

      const bearing = Math.atan2(y, x);
      const R = 6371000;
      const newLat = Math.asin(Math.sin(lat1 * rad) * Math.cos(offsetMeters / R) + Math.cos(lat1 * rad) * Math.sin(offsetMeters / R) * Math.cos(bearing));
      const newLon = lon1 * rad + Math.atan2(Math.sin(bearing) * Math.sin(offsetMeters / R) * Math.cos(lat1 * rad), Math.cos(offsetMeters / R) - Math.sin(lat1 * rad) * Math.sin(newLat));

      return { latitude: newLat / rad, longitude: newLon / rad };
  }

  function computeDistance(lat1, lon1, lat2, lon2) {
      const R = 6371000;
      const rad = Math.PI / 180;
      const dLat = (lat2 - lat1) * rad;
      const dLon = (lon2 - lon1) * rad;

      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
      return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function showMessage(msg) {
      alert(msg);
  }

  // Berechnet das Bearing (Azimut) vom Punkt (lat1, lon1) zum Punkt (lat2, lon2)
function computeBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const x = Math.sin(Δλ) * Math.cos(φ2);
    const y = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    
    let bearing = Math.atan2(x, y); // in Radiant
    bearing = bearing * 180 / Math.PI; // Umrechnung in Grad
    return (bearing + 360) % 360;  // Normalisierung auf den Bereich 0° bis 360°
  }
  
// Konvertiert ein Quaternion (im Format [x, y, z, w]) in Euler-Winkel (Roll, Pitch, Yaw)
function quaternionToEuler(q) {
    const [x, y, z, w] = q;
    const sinr_cosp = 2 * (w * x + y * z);
    const cosr_cosp = 1 - 2 * (x * x + y * y);
    const roll = Math.atan2(sinr_cosp, cosr_cosp);
  
    const sinp = 2 * (w * y - z * x);
    let pitch;
    if (Math.abs(sinp) >= 1) {
      pitch = Math.sign(sinp) * Math.PI / 2;
    } else {
      pitch = Math.asin(sinp);
    }
  
    const siny_cosp = 2 * (w * z + x * y);
    const cosy_cosp = 1 - 2 * (y * y + z * z);
    let yaw = Math.atan2(siny_cosp, cosy_cosp) * 180 / Math.PI;
    
    if (yaw < 0) {
      yaw += 360;
    }
    
    return {
      roll: roll * 180 / Math.PI,
      pitch: pitch * 180 / Math.PI,
      yaw: yaw
    };
  }
  
  
  
  // Berechnet den minimalen Winkelunterschied zwischen zwei Winkeln in Grad
  function angleDifference(angle1, angle2) {
    let diff = Math.abs(angle1 - angle2) % 360;
    if (diff > 180) {
      diff = 360 - diff;
    }
    return diff;
  }
  
  // Diese Funktion prüft, ob der Nutzer mit seinem Gerät in Richtung des Ziels schaut
  function checkIfPointingAtTarget(sensorQuaternion, userLat, userLon, targetLat, targetLon) {
    // Berechne das Bearing vom Nutzer zum Ziel
    const targetBearing = computeBearing(targetLat, targetLon, userLat, userLon);
    
    // Ermittle die aktuellen Euler-Winkel aus dem Quaternion
    const euler = quaternionToEuler(sensorQuaternion);
    const deviceYaw = euler.yaw; // Annahme: 'yaw' entspricht der horizontalen Ausrichtung
    
    // Berechne den Winkelunterschied zwischen Geräteausrichtung und Zielrichtung
    const diff = angleDifference(deviceYaw, targetBearing);
    
    // Toleranz in Grad (anpassbar, je nach gewünschter Genauigkeit)
    const tolerance = 15; 
    
    if (diff < tolerance) {
      // Der Nutzer schaut in Richtung des Ziels – führe die gewünschte Aktion aus
      kompassGruenMachen();
    }
    else {
        // Der Nutzer schaut nicht in Richtung des Ziels
        compassArrow.style.color = "red";
    }
  }
  
  // Platzhalter-Funktion für die gewünschte Aktion
  function kompassGruenMachen() {
    console.log("Ziel ausgerichtet!");
    // Der Nutzer schaut in Richtung des Ziels
    compassArrow.style.color = "green";
  }
  
};