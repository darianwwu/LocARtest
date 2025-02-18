(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))p(e);new MutationObserver(e=>{for(const a of e)if(a.type==="childList")for(const u of a.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&p(u)}).observe(document,{childList:!0,subtree:!0});function f(e){const a={};return e.integrity&&(a.integrity=e.integrity),e.referrerPolicy&&(a.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?a.credentials="include":e.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function p(e){if(e.ep)return;e.ep=!0;const a=f(e);fetch(e.href,a)}})();window.onload=()=>{let g=!1;const i={latitude:51.934548,longitude:7.653734},f=[3,6,12],p=document.querySelector("a-scene"),e=document.querySelector("[gps-new-camera]");e.setAttribute("camera",{far:100});const a=document.createElement("div");a.id="distanceDisplay",document.body.appendChild(a);const u=document.createElement("div");u.id="compassContainer",document.body.appendChild(u);const h=document.createElement("div");h.id="compassArrow",h.innerText="↑",u.appendChild(h);const y=document.createElement("div");y.id="compassText",u.appendChild(y),e.addEventListener("gps-new-camera-update-rotation",t=>{console.log(t.detail)}),e.addEventListener("gps-new-camera-update-position",t=>{g||v();const r=t.detail.position.latitude,n=t.detail.position.longitude,d=A(r,n,i.latitude,i.longitude);a.innerText=`Entfernung zum Ziel: ${Math.round(d)} m`;const c=L(r,n,i.latitude,i.longitude);I(c),document.querySelectorAll("a-triangle").forEach(o=>o.remove()),f.forEach(o=>{const s=C(r,n,i.latitude,i.longitude,o);if(!s||!s.latitude||!s.longitude){console.error("Fehler: Berechnete GPS-Koordinaten sind ungültig.",s);return}const l=document.createElement("a-triangle");l.setAttribute("color","#00008B"),l.setAttribute("opacity","0.7"),l.setAttribute("gps-new-entity-place",{latitude:s.latitude,longitude:s.longitude}),p.appendChild(l)})});function v(){const t=document.createElement("a-image");t.setAttribute("src","./images/map-marker.png"),t.setAttribute("width","4"),t.setAttribute("height","4"),t.setAttribute("gps-new-entity-place",{latitude:i.latitude,longitude:i.longitude}),p.appendChild(t),g=!0}function A(t,r,n,d){const o=Math.PI/180,s=(n-t)*o,l=(d-r)*o,b=Math.sin(s/2)**2+Math.cos(t*o)*Math.cos(n*o)*Math.sin(l/2)**2;return 6371e3*(2*Math.atan2(Math.sqrt(b),Math.sqrt(1-b)))}function L(t,r,n,d){const c=Math.PI/180,o=Math.sin((d-r)*c)*Math.cos(n*c),s=Math.cos(t*c)*Math.sin(n*c)-Math.sin(t*c)*Math.cos(n*c)*Math.cos((d-r)*c);return(Math.atan2(o,s)*(180/Math.PI)+360)%360}function C(t,r,n,d,c){const o=t*Math.PI/180,s=r*Math.PI/180,l=n*Math.PI/180,w=d*Math.PI/180-s,x=Math.sin(w)*Math.cos(l),O=Math.cos(o)*Math.sin(l)-Math.sin(o)*Math.cos(l)*Math.cos(w),E=Math.atan2(x,O),m=6371e3,M=c,P=Math.asin(Math.sin(o)*Math.cos(M/m)+Math.cos(o)*Math.sin(M/m)*Math.cos(E)),T=s+Math.atan2(Math.sin(E)*Math.sin(M/m)*Math.cos(o),Math.cos(M/m)-Math.sin(o)*Math.sin(P));return{latitude:P*180/Math.PI,longitude:T*180/Math.PI}}function I(t){window.DeviceOrientationEvent&&window.addEventListener("deviceorientation",r=>{const n=r.alpha;if(n!==null){h.style.transform=`rotate(${-n}deg)`,y.innerText=`${Math.round(n)}°`;const d=Math.abs(n-t);d<=10||d>=350?h.style.color="green":h.style.color="white"}})}};
