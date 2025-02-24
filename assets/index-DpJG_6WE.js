(function(){const f=document.createElement("link").relList;if(f&&f.supports&&f.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const u of s)if(u.type==="childList")for(const g of u.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&r(g)}).observe(document,{childList:!0,subtree:!0});function p(s){const u={};return s.integrity&&(u.integrity=s.integrity),s.referrerPolicy&&(u.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?u.credentials="include":s.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function r(s){if(s.ep)return;s.ep=!0;const u=p(s);fetch(s.href,u)}})();window.onload=()=>{let P=!1,f=null;const p={latitude:51.935175,longitude:7.649708},r={latitude:null,longitude:null},s=[3,5.5,12],u=document.querySelector("a-scene"),g=document.querySelector("[gps-new-camera]");g.setAttribute("camera",{far:100});const v=document.createElement("div");v.id="distanceDisplay",document.body.appendChild(v);const b=document.createElement("div");b.id="compassContainer",document.body.appendChild(b);const m=document.createElement("div");m.id="compassArrow",m.innerText="↑",b.appendChild(m);const E=document.createElement("div");E.id="compassText",b.appendChild(E);let y;if("AbsoluteOrientationSensor"in window)y=new AbsoluteOrientationSensor({frequency:60});else if("RelativeOrientationSensor"in window)y=new RelativeOrientationSensor({frequency:60});else{L("Gerät unterstützt keine Orientation Sensoren.");return}y.addEventListener("reading",()=>{f=[...y.quaternion],console.log("currentQuaternion:",f),C(f),r.latitude&&r.longitude&&(console.log("Nutzerstandort:"+r.latitude+" "+r.longitude),K(f,r.latitude,r.longitude,p.latitude,p.longitude))}),y.addEventListener("error",e=>{console.error("Sensor error: ",e.error),L("Fehler beim Sensor!")}),y.start(),g.addEventListener("gps-camera-update-position",e=>{if(r.latitude=e.detail.position.latitude,r.longitude=e.detail.position.longitude,r.latitude&&r.longitude){const i=q(r.latitude,r.longitude,p.latitude,p.longitude);v.innerText=`Entfernung zum Ziel: ${Math.round(i)} m`;let n=0;if(document.querySelectorAll("a-sphere").forEach(o=>o.remove()),s.forEach((o,a)=>{const t=document.createElement("a-sphere");t.setAttribute("color","#00008B"),t.setAttribute("opacity","0.7");const d=S(r.latitude,r.longitude,p.latitude,p.longitude,o,n);t.setAttribute("gps-new-entity-place",{latitude:d.latitude,longitude:d.longitude});let c;a===0?c=.3:a===1?c=.4:a===2&&(c=.65),t.setAttribute("radius",c.toString()),u.appendChild(t)}),!P){const o=document.createElement("a-image");o.setAttribute("src","./images/map-marker.png"),o.setAttribute("width","4"),o.setAttribute("height","4"),o.setAttribute("look-at","[gps-new-camera]"),o.setAttribute("gps-new-entity-place",{latitude:p.latitude,longitude:p.longitude}),u.appendChild(o),P=!0}}else console.error("Keine aktuellen Koordinaten vorhanden!"),L("Keine aktuellen Koordinaten vorhanden!")});function C(e){if(!e)return;const i=I(e);m.style.transform=`rotate(${-i}deg)`,E.innerText=`${Math.round(i)}°`}function I(e){let[i,n,o,a]=e,t=Math.atan2(2*(a*o+i*n),1-2*(n*n+o*o))*180/Math.PI;return t<0&&(t+=360),t}function S(e,i,n,o,a,t){const d=O(e,i,n,o,a),c=d.latitude-e,l=d.longitude-i,h=c*Math.cos(t)-l*Math.sin(t),M=c*Math.sin(t)+l*Math.cos(t);return{latitude:e+h,longitude:i+M}}function O(e,i,n,o,a){const t=Math.PI/180,d=(o-i)*t,c=Math.sin(d)*Math.cos(n*t),l=Math.cos(e*t)*Math.sin(n*t)-Math.sin(e*t)*Math.cos(n*t)*Math.cos(d),h=Math.atan2(c,l),M=6371e3,A=Math.asin(Math.sin(e*t)*Math.cos(a/M)+Math.cos(e*t)*Math.sin(a/M)*Math.cos(h)),w=i*t+Math.atan2(Math.sin(h)*Math.sin(a/M)*Math.cos(e*t),Math.cos(a/M)-Math.sin(e*t)*Math.sin(A));return{latitude:A/t,longitude:w/t}}function q(e,i,n,o){const t=Math.PI/180,d=(n-e)*t,c=(o-i)*t,l=Math.sin(d/2)**2+Math.cos(e*t)*Math.cos(n*t)*Math.sin(c/2)**2;return 6371e3*(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)))}function L(e){alert(e)}function T(e,i,n,o){const a=e*Math.PI/180,t=n*Math.PI/180,d=(o-i)*Math.PI/180,c=Math.sin(d)*Math.cos(t),l=Math.cos(a)*Math.sin(t)-Math.sin(a)*Math.cos(t)*Math.cos(d);let h=Math.atan2(c,l);return h=h*180/Math.PI,(h+360)%360}function x(e){const[i,n,o,a]=e,t=2*(a*i+n*o),d=1-2*(i*i+n*n),c=Math.atan2(t,d),l=2*(a*n-o*i);let h;Math.abs(l)>=1?h=Math.sign(l)*Math.PI/2:h=Math.asin(l);const M=2*(a*o+i*n),A=1-2*(n*n+o*o);let w=Math.atan2(M,A)*180/Math.PI;return w<0&&(w+=360),{roll:c*180/Math.PI,pitch:h*180/Math.PI,yaw:w}}function z(e,i){let n=Math.abs(e-i)%360;return n>180&&(n=360-n),n}function K(e,i,n,o,a){const t=T(o,a,i,n),c=x(e).yaw;z(c,t)<15?R():m.style.color="red"}function R(){m.style.color="green"}};
