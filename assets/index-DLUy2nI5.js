(function(){const p=document.createElement("link").relList;if(p&&p.supports&&p.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))w(s);new MutationObserver(s=>{for(const u of s)if(u.type==="childList")for(const g of u.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&w(g)}).observe(document,{childList:!0,subtree:!0});function c(s){const u={};return s.integrity&&(u.integrity=s.integrity),s.referrerPolicy&&(u.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?u.credentials="include":s.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function w(s){if(s.ep)return;s.ep=!0;const u=c(s);fetch(s.href,u)}})();window.onload=()=>{let P=!1;const p={latitude:51.935175,longitude:7.649708},c={latitude:null,longitude:null},w=[3,6,12],s=document.querySelector("a-scene"),u=document.querySelector("[gps-new-camera]");u.setAttribute("camera",{far:100});const g=document.createElement("div");g.id="distanceDisplay",document.body.appendChild(g);const b=document.createElement("div");b.id="compassContainer",document.body.appendChild(b);const m=document.createElement("div");m.id="compassArrow",m.innerText="↑",b.appendChild(m);const v=document.createElement("div");v.id="compassText",b.appendChild(v);let f;if("AbsoluteOrientationSensor"in window)f=new AbsoluteOrientationSensor({frequency:60});else if("RelativeOrientationSensor"in window)f=new RelativeOrientationSensor({frequency:60});else{E("Gerät unterstützt keine Orientation Sensoren.");return}f.addEventListener("reading",()=>{[...f.quaternion],L(f.quaternion),c.latitude&&c.longitude&&(console.log("Nutzerstandort:"+c.latitude+" "+c.longitude),z(f.quaternion,c.latitude,c.longitude,p.latitude,p.longitude))}),f.addEventListener("error",e=>{console.error("Sensor error: ",e.error),E("Fehler beim Sensor!")}),f.start(),u.addEventListener("gps-camera-update-position",e=>{if(c.latitude=e.detail.position.latitude,c.longitude=e.detail.position.longitude,c.latitude&&c.longitude){const i=S(c.latitude,c.longitude,p.latitude,p.longitude);g.innerText=`Entfernung zum Ziel: ${Math.round(i)} m`;let n=0;if(document.querySelectorAll("a-sphere").forEach(o=>o.remove()),w.forEach((o,a)=>{const t=document.createElement("a-sphere");t.setAttribute("color","#00008B"),t.setAttribute("opacity","0.7");const d=I(c.latitude,c.longitude,p.latitude,p.longitude,o,n);t.setAttribute("gps-new-entity-place",{latitude:d.latitude,longitude:d.longitude});let r;a===0?r=.25:a===1?r=.5:a===2&&(r=.75),t.setAttribute("radius",r.toString()),s.appendChild(t)}),!P){const o=document.createElement("a-image");o.setAttribute("src","./images/map-marker.png"),o.setAttribute("width","4"),o.setAttribute("height","4"),o.setAttribute("look-at","[gps-new-camera]"),o.setAttribute("gps-new-entity-place",{latitude:p.latitude,longitude:p.longitude}),s.appendChild(o),P=!0}}else console.error("Keine aktuellen Koordinaten vorhanden!"),E("Keine aktuellen Koordinaten vorhanden!")});function L(e){if(!e)return;const i=C(e);m.style.transform=`rotate(${-i}deg)`,v.innerText=`${Math.round(i)}°`}function C(e){let[i,n,o,a]=e,t=Math.atan2(2*(a*o+i*n),1-2*(n*n+o*o))*180/Math.PI;return t<0&&(t+=360),t}function I(e,i,n,o,a,t){const d=q(e,i,n,o,a),r=d.latitude-e,l=d.longitude-i,h=r*Math.cos(t)-l*Math.sin(t),M=r*Math.sin(t)+l*Math.cos(t);return{latitude:e+h,longitude:i+M}}function q(e,i,n,o,a){const t=Math.PI/180,d=(o-i)*t,r=Math.sin(d)*Math.cos(n*t),l=Math.cos(e*t)*Math.sin(n*t)-Math.sin(e*t)*Math.cos(n*t)*Math.cos(d),h=Math.atan2(r,l),M=6371e3,A=Math.asin(Math.sin(e*t)*Math.cos(a/M)+Math.cos(e*t)*Math.sin(a/M)*Math.cos(h)),y=i*t+Math.atan2(Math.sin(h)*Math.sin(a/M)*Math.cos(e*t),Math.cos(a/M)-Math.sin(e*t)*Math.sin(A));return{latitude:A/t,longitude:y/t}}function S(e,i,n,o){const t=Math.PI/180,d=(n-e)*t,r=(o-i)*t,l=Math.sin(d/2)**2+Math.cos(e*t)*Math.cos(n*t)*Math.sin(r/2)**2;return 6371e3*(2*Math.atan2(Math.sqrt(l),Math.sqrt(1-l)))}function E(e){alert(e)}function O(e,i,n,o){const a=e*Math.PI/180,t=n*Math.PI/180,d=(o-i)*Math.PI/180,r=Math.sin(d)*Math.cos(t),l=Math.cos(a)*Math.sin(t)-Math.sin(a)*Math.cos(t)*Math.cos(d);let h=Math.atan2(r,l);return h=h*180/Math.PI,(h+360)%360}function T(e){const[i,n,o,a]=e,t=2*(a*i+n*o),d=1-2*(i*i+n*n),r=Math.atan2(t,d),l=2*(a*n-o*i);let h;Math.abs(l)>=1?h=Math.sign(l)*Math.PI/2:h=Math.asin(l);const M=2*(a*o+i*n),A=1-2*(n*n+o*o);let y=Math.atan2(M,A)*180/Math.PI;return y<0&&(y+=360),{roll:r*180/Math.PI,pitch:h*180/Math.PI,yaw:y}}function x(e,i){let n=Math.abs(e-i)%360;return n>180&&(n=360-n),n}function z(e,i,n,o,a){const t=O(o,a,i,n),r=T(e).yaw;x(r,t)<15?K():m.style.color="red"}function K(){console.log("Ziel ausgerichtet!"),m.style.color="green"}};
