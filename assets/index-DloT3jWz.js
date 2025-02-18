(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const s of e.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function u(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function c(t){if(t.ep)return;t.ep=!0;const e=u(t);fetch(t.href,e)}})();window.onload=()=>{let h=!1;const n={latitude:51.934548,longitude:7.653734},u=[3,6,12],c=document.querySelector("a-scene"),t=document.querySelector("[gps-new-camera]");t.setAttribute("camera",{far:100,fov:90,near:1});const e=document.createElement("div");e.id="distanceDisplay",document.body.appendChild(e);const s=document.createElement("div");s.id="compassContainer",document.body.appendChild(s);const i=document.createElement("div");i.id="compassArrow",i.innerText="↑",s.appendChild(i);const M=document.createElement("div");M.id="compassText",s.appendChild(M),t.addEventListener("gps-camera-update-position",l=>{const d=l.detail.position.latitude,o=l.detail.position.longitude,r=y(d,o,n.latitude,n.longitude);e.innerText=`Entfernung zum Ziel: ${Math.round(r)} m`;const p=w(d,o,n.latitude,n.longitude);if(g(p),!h){const a=document.createElement("a-image");a.setAttribute("src","./images/map-marker.png"),a.setAttribute("width","4"),a.setAttribute("height","4"),a.setAttribute("gps-new-entity-place",{latitude:n.latitude,longitude:n.longitude}),c.appendChild(a),h=!0}document.querySelectorAll("a-triangle").forEach(a=>a.remove()),u.forEach(a=>{const m=document.createElement("a-triangle");m.setAttribute("color","#00008B"),m.setAttribute("opacity","0.7");const f=A(d,o,n.latitude,n.longitude,a);m.setAttribute("gps-new-entity-place",{latitude:f.latitude,longitude:f.longitude}),m.setAttribute("look-at",`${n.latitude} ${n.longitude}`),c.appendChild(m)})});function g(l){window.DeviceOrientationEvent&&window.addEventListener("deviceorientation",d=>{const o=d.alpha;if(o!==null){i.style.transform=`rotate(${-o}deg)`,M.innerText=`${Math.round(o)}°`;const r=Math.abs(o-l);r<=10||r>=350?i.style.color="green":i.style.color="white"}})}function y(l,d,o,r){const a=Math.PI/180,m=(o-l)*a,f=(r-d)*a,b=Math.sin(m/2)**2+Math.cos(l*a)*Math.cos(o*a)*Math.sin(f/2)**2;return 6371e3*(2*Math.atan2(Math.sqrt(b),Math.sqrt(1-b)))}};function w(h,n,u,c){const t=Math.PI/180,e=Math.sin((c-n)*t)*Math.cos(u*t),s=Math.cos(h*t)*Math.sin(u*t)-Math.sin(h*t)*Math.cos(u*t)*Math.cos((c-n)*t);return(Math.atan2(e,s)*(180/Math.PI)+360)%360}function A(h,n,u,c,t){const e=h*Math.PI/180,s=n*Math.PI/180,i=u*Math.PI/180,g=c*Math.PI/180-s,y=Math.sin(g)*Math.cos(i),l=Math.cos(e)*Math.sin(i)-Math.sin(e)*Math.cos(i)*Math.cos(g),d=Math.atan2(y,l),o=6371e3,r=t,p=Math.asin(Math.sin(e)*Math.cos(r/o)+Math.cos(e)*Math.sin(r/o)*Math.cos(d)),a=s+Math.atan2(Math.sin(d)*Math.sin(r/o)*Math.cos(e),Math.cos(r/o)-Math.sin(e)*Math.sin(p));return{latitude:p*180/Math.PI,longitude:a*180/Math.PI}}
