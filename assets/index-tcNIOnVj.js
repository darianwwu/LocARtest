(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const d of document.querySelectorAll('link[rel="modulepreload"]'))r(d);new MutationObserver(d=>{for(const u of d)if(u.type==="childList")for(const i of u.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function p(d){const u={};return d.integrity&&(u.integrity=d.integrity),d.referrerPolicy&&(u.referrerPolicy=d.referrerPolicy),d.crossOrigin==="use-credentials"?u.credentials="include":d.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function r(d){if(d.ep)return;d.ep=!0;const u=p(d);fetch(d.href,u)}})();const P=navigator.userAgent.match(/iPhone|iPad|iPod/i);function C(T){const a=this;this.object=T,this.object.rotation.reorder("YXZ"),this.enabled=!0,this.deviceOrientation=null,this.screenOrientation=0,this.alphaOffset=0,this.initialOffset=null;const p=function({alpha:i,beta:h,gamma:E,webkitCompassHeading:v}){if(P){const m=360-v;a.alphaOffset=THREE.MathUtils.degToRad(m-i),a.deviceOrientation={alpha:i,beta:h,gamma:E,webkitCompassHeading:v}}else i<0&&(i+=360),a.deviceOrientation={alpha:i,beta:h,gamma:E};window.dispatchEvent(new CustomEvent("camera-rotation-change",{detail:{cameraRotation:T.rotation}}))},r=function(){a.screenOrientation=window.orientation||0},d=(function(){window.addEventListener("orientationchange",r,!1),P?window.addEventListener("deviceorientation",p,!1):window.addEventListener("deviceorientationabsolute",p,!1)}).bind(this),u=function(){const i=new THREE.Vector3(0,0,1),h=new THREE.Euler,E=new THREE.Quaternion,v=new THREE.Quaternion(-Math.sqrt(.5),0,0,Math.sqrt(.5));return function(m,w,b,y,L){h.set(b,w,-y,"YXZ"),m.setFromEuler(h),m.multiply(v),m.multiply(E.setFromAxisAngle(i,-L))}}();this.connect=function(){r(),window.DeviceOrientationEvent!==void 0&&typeof window.DeviceOrientationEvent.requestPermission=="function"?window.DeviceOrientationEvent.requestPermission().then(function(i){i=="granted"&&d()}).catch(function(i){console.error("THREE.AbsoluteDeviceOrientationControls: Unable to use DeviceOrientation API:",i)}):d(),a.enabled=!0},this.disconnect=function(){P?(window.removeEventListener("orientationchange",r,!1),window.removeEventListener("deviceorientation",p,!1)):(window.removeEventListener("orientationchange",r,!1),window.removeEventListener("deviceorientationabsolute",p,!1)),a.enabled=!1,a.initialOffset=!1,a.deviceOrientation=null},this.update=function({theta:i=0}={theta:0}){if(a.enabled===!1)return;const h=a.deviceOrientation;if(h){const E=h.alpha?THREE.MathUtils.degToRad(h.alpha):0,v=h.beta?THREE.MathUtils.degToRad(h.beta):0,m=h.gamma?THREE.MathUtils.degToRad(h.gamma):0,w=a.screenOrientation?THREE.MathUtils.degToRad(a.screenOrientation):0;if(P){const b=new THREE.Quaternion;u(b,E,v,m,w);const y=new THREE.Euler().setFromQuaternion(b,"YXZ");console.log(y.x,y.y,y.z),y.y=THREE.MathUtils.degToRad(360-h.webkitCompassHeading),b.setFromEuler(y),a.object.quaternion.copy(b)}else u(a.object.quaternion,E+i,v,m,w)}},this.updateAlphaOffset=function(){a.initialOffset=!1},this.dispose=function(){a.disconnect()},this.getAlpha=function(){const{deviceOrientation:i}=a;return i&&i.alpha?THREE.MathUtils.degToRad(i.alpha)+a.alphaOffset:0},this.getBeta=function(){const{deviceOrientation:i}=a;return i&&i.beta?THREE.MathUtils.degToRad(i.beta):0}}C.prototype=Object.assign(Object.create(THREE.EventDispatcher.prototype),{constructor:C});window.onload=()=>{let T=!1,a=null;const p={latitude:51.935175,longitude:7.649708},r={latitude:null,longitude:null},d=[3,5.5,12],u=document.querySelector("a-scene"),i=document.querySelector("[gps-new-camera]");i.setAttribute("camera",{far:100});const h=i.getObject3D("camera"),E=new C(h);E.connect();const v=document.createElement("div");v.id="distanceDisplay",document.body.appendChild(v);const m=document.createElement("div");m.id="compassContainer",document.body.appendChild(m);const w=document.createElement("div");w.id="compassArrow",w.innerText="↑",m.appendChild(w);const b=document.createElement("div");b.id="compassText",m.appendChild(b),E.addEventListener("reading",()=>{E.update(),a=E.object.quaternion.toArray(),console.log("currentQuaternion: "+a),y(a),r.latitude&&r.longitude&&(console.log("Nutzerstandort:"+r.latitude+" "+r.longitude),Q(a,r.latitude,r.longitude,p.latitude,p.longitude))}),i.addEventListener("gps-camera-update-position",e=>{if(r.latitude=e.detail.position.latitude,r.longitude=e.detail.position.longitude,r.latitude&&r.longitude){const s=q(r.latitude,r.longitude,p.latitude,p.longitude);v.innerText=`Entfernung zum Ziel: ${Math.round(s)} m`;let n=0;if(document.querySelectorAll("a-sphere").forEach(o=>o.remove()),d.forEach((o,c)=>{const t=document.createElement("a-sphere");t.setAttribute("color","#00008B"),t.setAttribute("opacity","0.7");const f=H(r.latitude,r.longitude,p.latitude,p.longitude,o,n);t.setAttribute("gps-new-entity-place",{latitude:f.latitude,longitude:f.longitude});let l;c===0?l=.3:c===1?l=.4:c===2&&(l=.65),t.setAttribute("radius",l.toString()),u.appendChild(t)}),!T){const o=document.createElement("a-image");o.setAttribute("src","./images/map-marker.png"),o.setAttribute("width","4"),o.setAttribute("height","4"),o.setAttribute("look-at","[gps-new-camera]"),o.setAttribute("gps-new-entity-place",{latitude:p.latitude,longitude:p.longitude}),u.appendChild(o),T=!0}}else console.error("Keine aktuellen Koordinaten vorhanden!"),D("Keine aktuellen Koordinaten vorhanden!")});function y(e){if(!e)return;const s=L(e);w.style.transform=`rotate(${-s}deg)`,b.innerText=`${Math.round(s)}°`}function L(e){let[s,n,o,c]=e,t=Math.atan2(2*(c*o+s*n),1-2*(n*n+o*o))*180/Math.PI;return t<0&&(t+=360),t}function H(e,s,n,o,c,t){const f=I(e,s,n,o,c),l=f.latitude-e,g=f.longitude-s,M=l*Math.cos(t)-g*Math.sin(t),O=l*Math.sin(t)+g*Math.cos(t);return{latitude:e+M,longitude:s+O}}function I(e,s,n,o,c){const t=Math.PI/180,f=(o-s)*t,l=Math.sin(f)*Math.cos(n*t),g=Math.cos(e*t)*Math.sin(n*t)-Math.sin(e*t)*Math.cos(n*t)*Math.cos(f),M=Math.atan2(l,g),O=6371e3,A=Math.asin(Math.sin(e*t)*Math.cos(c/O)+Math.cos(e*t)*Math.sin(c/O)*Math.cos(M)),R=s*t+Math.atan2(Math.sin(M)*Math.sin(c/O)*Math.cos(e*t),Math.cos(c/O)-Math.sin(e*t)*Math.sin(A));return{latitude:A/t,longitude:R/t}}function q(e,s,n,o){const t=Math.PI/180,f=(n-e)*t,l=(o-s)*t,g=Math.sin(f/2)**2+Math.cos(e*t)*Math.cos(n*t)*Math.sin(l/2)**2;return 6371e3*(2*Math.atan2(Math.sqrt(g),Math.sqrt(1-g)))}function D(e){alert(e)}function j(e,s,n,o){const c=e*Math.PI/180,t=n*Math.PI/180,f=(o-s)*Math.PI/180,l=Math.sin(f)*Math.cos(t),g=Math.cos(c)*Math.sin(t)-Math.sin(c)*Math.cos(t)*Math.cos(f);let M=Math.atan2(l,g);return M=M*180/Math.PI,(M+360)%360}function x(e){const[s,n,o,c]=e,t=2*(c*s+n*o),f=1-2*(s*s+n*n),l=Math.atan2(t,f),g=2*(c*n-o*s);let M;Math.abs(g)>=1?M=Math.sign(g)*Math.PI/2:M=Math.asin(g);const O=2*(c*o+s*n),A=1-2*(n*n+o*o);let R=Math.atan2(O,A)*180/Math.PI;return R<0&&(R+=360),{roll:l*180/Math.PI,pitch:M*180/Math.PI,yaw:R}}function U(e,s){let n=Math.abs(e-s)%360;return n>180&&(n=360-n),n}function Q(e,s,n,o,c){const t=j(o,c,s,n),l=x(e).yaw;U(l,t)<15?S():w.style.color="red"}function S(){w.style.color="green"}};
