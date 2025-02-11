(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))h(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const m of i.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&h(m)}).observe(document,{childList:!0,subtree:!0});function l(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function h(o){if(o.ep)return;o.ep=!0;const i=l(o);fetch(o.href,i)}})();window.onload=()=>{let v=!1,u=!1,l={alpha:null,beta:null,gamma:null},h=null;window.addEventListener("deviceorientation",e=>{e.alpha!==null&&(u=!0,l.alpha=e.alpha,l.beta=e.beta,l.gamma=e.gamma)});const o={latitude:51.935502,longitude:7.652093},i=[3,6,9,12,15],m=document.querySelector("a-scene");document.querySelector("[gps-new-camera]").addEventListener("gps-camera-update-position",e=>{if(!u){console.log("Warte auf vollständige Sensordaten...");return}const t=e.detail.position.latitude,r=e.detail.position.longitude;w("GPS-Position aktualisiert");let d=0;if(h!==null&&(d=l.alpha*Math.PI/180-h),document.querySelectorAll("a-circle").forEach(n=>n.parentNode.removeChild(n)),i.forEach(n=>{const a=document.createElement("a-circle");a.setAttribute("radius","0.5"),a.setAttribute("color","#00008B"),a.setAttribute("opacity","0.7");const s=H(t,r,o.latitude,o.longitude,n,d);a.setAttribute("gps-new-entity-place",{latitude:s.latitude,longitude:s.longitude}),m.appendChild(a)}),!v){const n=document.createElement("a-image");n.setAttribute("src","./images/map-marker.png"),n.setAttribute("width","4"),n.setAttribute("height","4"),n.setAttribute("look-at","[gps-new-camera]"),n.setAttribute("gps-new-entity-place",{latitude:o.latitude,longitude:o.longitude}),m.appendChild(n),v=!0}});const c=document.createElement("button");c.innerText="Kalibrieren",c.style.position="fixed",c.style.bottom="20px",c.style.left="50%",c.style.transform="translateX(-50%)",c.style.padding="10px 20px",c.style.zIndex="10000",document.body.appendChild(c),c.addEventListener("click",()=>{u&&l.alpha!==null?(h=l.alpha*Math.PI/180,w("Kalibrierung gesetzt!"),console.log("Kalibrierter Heading (in Radianten):",h)):w("Keine Sensordaten für Kalibrierung verfügbar!")});function S(e,t,r,d,p){const n=e*Math.PI/180,a=t*Math.PI/180,s=r*Math.PI/180,y=d*Math.PI/180-a,b=Math.sin(y)*Math.cos(s),E=Math.cos(n)*Math.sin(s)-Math.sin(n)*Math.cos(s)*Math.cos(y),P=Math.atan2(b,E),g=6371e3,f=p,A=Math.asin(Math.sin(n)*Math.cos(f/g)+Math.cos(n)*Math.sin(f/g)*Math.cos(P)),B=a+Math.atan2(Math.sin(P)*Math.sin(f/g)*Math.cos(n),Math.cos(f/g)-Math.sin(n)*Math.sin(A));return{latitude:A*180/Math.PI,longitude:B*180/Math.PI}}function H(e,t,r,d,p,n){const a=S(e,t,r,d,p),s=111320,C=40075e3*Math.cos(e*Math.PI/180)/360,y=(a.latitude-e)*s,b=(a.longitude-t)*C,E=b*Math.cos(n)-y*Math.sin(n),P=b*Math.sin(n)+y*Math.cos(n),g=e+P/s,f=t+E/C;return{latitude:g,longitude:f}}function w(e){const t=document.createElement("div");t.style.position="fixed",t.style.top="20px",t.style.left="50%",t.style.transform="translateX(-50%)",t.style.padding="10px 20px",t.style.backgroundColor="rgba(0, 0, 0, 0.7)",t.style.color="white",t.style.fontSize="14px",t.style.borderRadius="5px",t.style.zIndex="9999",t.innerText=e,document.body.appendChild(t),setTimeout(()=>{t.remove()},1e3)}const O=document.querySelector(".compass-circle"),K=document.querySelector(".start-btn"),x=document.querySelector(".my-point");let I,M;const q=!(navigator.userAgent.match(/(iPod|iPhone|iPad)/)&&navigator.userAgent.match(/AppleWebKit/));function D(){K.addEventListener("click",N),navigator.geolocation.getCurrentPosition(T,z,{enableHighAccuracy:!0})}function N(){q?DeviceOrientationEvent.requestPermission().then(e=>{e==="granted"?window.addEventListener("deviceorientation",L,!0):alert("Permission needed for compass!")}).catch(()=>alert("Not supported")):window.addEventListener("deviceorientationabsolute",L,!0)}function L(e){if(I=e.webkitCompassHeading||Math.abs(e.alpha-360),O.style.transform=`translate(-50%, -50%) rotate(${-I}deg)`,typeof M=="number"){let t=Math.abs(I-M);t>180&&(t=360-t),t<=15?x.style.opacity=1:x.style.opacity=0}}function T(e){const{latitude:t,longitude:r}=e.coords;M=k(t,r),M<0&&(M+=360)}function k(e,t){const r={lat:o.latitude,lng:o.longitude},d=r.lat*Math.PI/180,p=r.lng*Math.PI/180,n=e*Math.PI/180,a=t*Math.PI/180,s=180/Math.PI*Math.atan2(Math.sin(p-a),Math.cos(n)*Math.tan(d)-Math.sin(n)*Math.cos(p-a));return Math.round(s)}function z(e){console.error(e)}D()};
