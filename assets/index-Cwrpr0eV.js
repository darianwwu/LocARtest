(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))m(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const t of n.addedNodes)t.tagName==="LINK"&&t.rel==="modulepreload"&&m(t)}).observe(document,{childList:!0,subtree:!0});function b(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function m(a){if(a.ep)return;a.ep=!0;const n=b(a);fetch(a.href,n)}})();const R=navigator.userAgent.match(/iPhone|iPad|iPod/i);function y(T){const o=this;this.object=T,this.object.rotation.reorder("YXZ"),this.enabled=!0,this.deviceOrientation=null,this.screenOrientation=0,this.alphaOffset=0,this.initialOffset=null;const b=function({alpha:t,beta:u,gamma:E,webkitCompassHeading:v}){if(R){const p=360-v;o.alphaOffset=THREE.MathUtils.degToRad(p-t),o.deviceOrientation={alpha:t,beta:u,gamma:E,webkitCompassHeading:v}}else t<0&&(t+=360),o.deviceOrientation={alpha:t,beta:u,gamma:E};window.dispatchEvent(new CustomEvent("camera-rotation-change",{detail:{cameraRotation:T.rotation}}))},m=function(){o.screenOrientation=window.orientation||0},a=(function(){window.addEventListener("orientationchange",m,!1),R?window.addEventListener("deviceorientation",b,!1):window.addEventListener("deviceorientationabsolute",b,!1)}).bind(this),n=function(){const t=new THREE.Vector3(0,0,1),u=new THREE.Euler,E=new THREE.Quaternion,v=new THREE.Quaternion(-Math.sqrt(.5),0,0,Math.sqrt(.5));return function(p,M,w,d,H){u.set(w,M,-d,"YXZ"),p.setFromEuler(u),p.multiply(v),p.multiply(E.setFromAxisAngle(t,-H))}}();this.connect=function(){m(),window.DeviceOrientationEvent!==void 0&&typeof window.DeviceOrientationEvent.requestPermission=="function"?window.DeviceOrientationEvent.requestPermission().then(function(t){t=="granted"&&a()}).catch(function(t){console.error("THREE.AbsoluteDeviceOrientationControls: Unable to use DeviceOrientation API:",t)}):a(),o.enabled=!0},this.disconnect=function(){R?(window.removeEventListener("orientationchange",m,!1),window.removeEventListener("deviceorientation",b,!1)):(window.removeEventListener("orientationchange",m,!1),window.removeEventListener("deviceorientationabsolute",b,!1)),o.enabled=!1,o.initialOffset=!1,o.deviceOrientation=null},this.update=function({theta:t=0}={theta:0}){if(o.enabled===!1)return;const u=o.deviceOrientation;if(u){const E=u.alpha?THREE.MathUtils.degToRad(u.alpha):0,v=u.beta?THREE.MathUtils.degToRad(u.beta):0,p=u.gamma?THREE.MathUtils.degToRad(u.gamma):0,M=o.screenOrientation?THREE.MathUtils.degToRad(o.screenOrientation):0;if(R){const w=new THREE.Quaternion;n(w,E,v,p,M);const d=new THREE.Euler().setFromQuaternion(w,"YXZ");console.log(d.x,d.y,d.z),d.y=THREE.MathUtils.degToRad(360-u.webkitCompassHeading),w.setFromEuler(d),o.object.quaternion.copy(w)}else n(o.object.quaternion,E+t,v,p,M)}},this.updateAlphaOffset=function(){o.initialOffset=!1},this.dispose=function(){o.disconnect()},this.getAlpha=function(){const{deviceOrientation:t}=o;return t&&t.alpha?THREE.MathUtils.degToRad(t.alpha)+o.alphaOffset:0},this.getBeta=function(){const{deviceOrientation:t}=o;return t&&t.beta?THREE.MathUtils.degToRad(t.beta):0},this.getGamma=function(){const{deviceOrientation:t}=o;return t&&t.gamma?THREE.MathUtils.degToRad(t.gamma):0},this.connect()}y.prototype=Object.assign(Object.create(THREE.EventDispatcher.prototype),{constructor:y});window.onload=()=>{let T=!1,o=null,b=null,m=null;const a={latitude:51.935175,longitude:7.649708},n={latitude:null,longitude:null},t=[3,5.5,12],u=document.querySelector("a-scene"),E=document.querySelector("[gps-new-camera]");E.setAttribute("camera",{far:100});const v=document.createElement("div");v.id="distanceDisplay",document.body.appendChild(v);const p=document.createElement("div");p.id="compassContainer",document.body.appendChild(p);const M=document.createElement("div");M.id="compassArrow",M.innerText="↑",p.appendChild(M);const w=document.createElement("div");w.id="compassText",p.appendChild(w);const d=new y(E.object3D);window.addEventListener("camera-rotation-change",s=>{d.update(),y.isIOS&&d.deviceOrientation&&m===null&&(o=D(d.object.quaternion),b=d.deviceOrientation.webkitCompassHeading||0,m=(b-o+360)%360,console.log("Kalibrierungs-Offset (initialTrueHeading - initialARHeading):",m));let c=y.isIOS&&d.deviceOrientation?d.deviceOrientation.webkitCompassHeading||0:H(d.object.quaternion);if(w.innerText=`${Math.round(c)}°`,M.style.transform=`rotate(${-c}deg)`,n.latitude!==null&&n.longitude!==null){const e=y.isIOS&&d.deviceOrientation?d.deviceOrientation.webkitCompassHeading||0:j(d.object.quaternion).yaw;I(e,n.latitude,n.longitude,a.latitude,a.longitude)}});function H(s){const c=new THREE.Euler().setFromQuaternion(s,"YXZ");let e=THREE.MathUtils.radToDeg(c.y);return e=Math.abs((e-360)%360),e}E.addEventListener("gps-camera-update-position",s=>{if(n.latitude=s.detail.position.latitude,n.longitude=s.detail.position.longitude,n.latitude&&n.longitude){const c=S(n.latitude,n.longitude,a.latitude,a.longitude);v.innerText=`Entfernung zum Ziel: ${Math.round(c)} m`;const e=C(n.latitude,n.longitude,a.latitude,a.longitude);let l=e;if(y.isIOS&&m!==null&&(l=(e-m+360)%360,console.log("originalBearing:",e,"-> arBearing:",l)),document.querySelectorAll("a-sphere").forEach(i=>i.remove()),t.forEach((i,r)=>{const h=document.createElement("a-sphere");h.setAttribute("color","#00008B"),h.setAttribute("opacity","0.7");const g=q(n.latitude,n.longitude,i,l);h.setAttribute("gps-new-entity-place",{latitude:g.latitude,longitude:g.longitude});let f;r===0?f=.3:r===1?f=.4:r===2&&(f=.65),h.setAttribute("radius",f.toString()),u.appendChild(h)}),!T){const i=document.createElement("a-image");i.setAttribute("src","./images/map-marker.png"),i.setAttribute("width","4"),i.setAttribute("height","4"),i.setAttribute("look-at","[gps-new-camera]"),i.setAttribute("gps-new-entity-place",{latitude:a.latitude,longitude:a.longitude}),u.appendChild(i),T=!0}}else console.error("Keine aktuellen Koordinaten vorhanden!"),U("Keine aktuellen Koordinaten vorhanden!")});function I(s,c,e,l,i){const r=C(l,i,c,e);x(s,r)<15?L():M.style.color="red"}function L(){M.style.color="green"}function D(s){const{x:c,y:e,z:l,w:i}=s;let r=Math.atan2(2*(i*l+c*e),1-2*(e*e+l*l))*180/Math.PI;return r<0&&(r+=360),r}function q(s,c,e,l){const i=Math.PI/180,r=6371e3,h=l*i,g=s*i,f=c*i,O=Math.asin(Math.sin(g)*Math.cos(e/r)+Math.cos(g)*Math.sin(e/r)*Math.cos(h)),A=f+Math.atan2(Math.sin(h)*Math.sin(e/r)*Math.cos(g),Math.cos(e/r)-Math.sin(g)*Math.sin(O));return{latitude:O/i,longitude:A/i}}function S(s,c,e,l){const r=Math.PI/180,h=(e-s)*r,g=(l-c)*r,f=Math.sin(h/2)**2+Math.cos(s*r)*Math.cos(e*r)*Math.sin(g/2)**2;return 6371e3*(2*Math.atan2(Math.sqrt(f),Math.sqrt(1-f)))}function U(s){alert(s)}function C(s,c,e,l){const i=s*Math.PI/180,r=e*Math.PI/180,h=(l-c)*Math.PI/180,g=Math.sin(h)*Math.cos(r),f=Math.cos(i)*Math.sin(r)-Math.sin(i)*Math.cos(r)*Math.cos(h);return(Math.atan2(g,f)*180/Math.PI+360)%360}function j(s){const c=s.x,e=s.y,l=s.z,i=s.w,r=2*(i*c+e*l),h=1-2*(c*c+e*e),g=Math.atan2(r,h),f=2*(i*e-l*c);let O;Math.abs(f)>=1?O=Math.sign(f)*Math.PI/2:O=Math.asin(f);const A=2*(i*l+c*e),B=1-2*(e*e+l*l);let P=Math.atan2(A,B)*180/Math.PI;return P<0&&(P+=360),{roll:g*180/Math.PI,pitch:O*180/Math.PI,yaw:P}}function x(s,c){let e=Math.abs(s-c)%360;return e>180&&(e=360-e),e}};
