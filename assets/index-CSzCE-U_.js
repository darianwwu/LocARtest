(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();document.addEventListener("DOMContentLoaded",function(){const a={latitude:51.9353,longitude:7.649964};function i(n,e,t,o,s){const d=n*(Math.PI/180),l=e*(Math.PI/180),u=t*(Math.PI/180),g=o*(Math.PI/180)-l,m=u-d,c=Math.atan2(m,g),p=s/6371e3*Math.cos(c),f=s/6371e3*Math.sin(c),h=n+p*(180/Math.PI),y=e+f*(180/Math.PI);return{latitude:h,longitude:y}}function r(n,e){console.log("GPS-Daten erhalten:",n,e);const t=i(n,e,a.latitude,a.longitude,5),o=`
      <a-scene
        vr-mode-ui="enabled: false"
        arjs="sourceType: webcam; videoTexture: true; debugUIEnabled: false;">
        
        <a-camera gps-new-camera gpsMinDistance="2" alert="true" gpsTimeInterval="500" id="camera"></a-camera>
        
        <a-light type="directional" position="1 1 1" intensity="0.5"></a-light>
        <a-light type="ambient" intensity="0.3"></a-light>
        
        <a-assets>
          <img id="platform" src="https://i.imgur.com/mYmmbrp.jpg">
        </a-assets>
        
        <a-entity
          gps-new-entity-place="latitude: ${t.latitude}; longitude: ${t.longitude};"
          id="dreieck"
          geometry="primitive: triangle"
          src="#platform"
          rotation="-90 0 0"
          position="0 2 0">
        </a-entity>

        <a-image gps-new-entity-place="latitude: ${a.latitude}; longitude: ${a.longitude};" 
                 id="zielort" 
                 src="./images/map-marker.png" 
                 position="0 2 0">
        </a-image>
        
        
      </a-scene>
      `;document.body.innerHTML=o}navigator.geolocation.getCurrentPosition(n=>{const e=n.coords.latitude,t=n.coords.longitude;r(e,t)},n=>{console.error("Fehler beim Abrufen der GPS-Daten:",n),alert("GPS konnte nicht geladen werden. Bitte aktivieren Sie den Standort.")},{enableHighAccuracy:!0})});
