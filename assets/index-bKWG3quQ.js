(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&c(o)}).observe(document,{childList:!0,subtree:!0});function l(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(e){if(e.ep)return;e.ep=!0;const t=l(e);fetch(e.href,t)}})();window.onload=()=>{let r=!1,n=!1,l={alpha:null,beta:null,gamma:null},c=null;const e=document.createElement("div");e.id="distanceDisplay",e.style.position="fixed",e.style.top="20px",e.style.left="50%",e.style.transform="translateX(-50%)",e.style.padding="10px 20px",e.style.backgroundColor="rgba(0,0,0,0.7)",e.style.color="white",e.style.fontSize="16px",e.style.borderRadius="5px",e.style.zIndex="10000",document.body.appendChild(e);const t=document.createElement("div");t.id="compassContainer",t.style.position="fixed",t.style.top="20px",t.style.right="20px",t.style.width="60px",t.style.height="60px",t.style.backgroundColor="rgba(0,0,0,0.7)",t.style.borderRadius="50%",t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="center",t.style.zIndex="10000",document.body.appendChild(t);const o=document.createElement("div");o.id="compassArrow",o.innerText="↑",o.style.fontSize="32px",o.style.color="white",t.appendChild(o);const s=document.createElement("div");s.id="compassText",s.style.position="absolute",s.style.bottom="0",s.style.width="100%",s.style.textAlign="center",s.style.fontSize="12px",s.style.color="white",t.appendChild(s),window.addEventListener("deviceorientation",i=>{i.alpha!==null&&(n=!0,l.alpha=i.alpha,l.beta=i.beta,l.gamma=i.gamma,o.style.transform=`rotate(${-i.alpha}deg)`,s.innerText=`${Math.round(i.alpha)}°`)});const a=document.createElement("button");a.innerText="Kalibrieren",a.style.position="fixed",a.style.bottom="20px",a.style.left="50%",a.style.transform="translateX(-50%)",a.style.padding="10px 20px",a.style.zIndex="10000",document.body.appendChild(a),a.addEventListener("click",()=>{n&&l.alpha!==null?(c=l.alpha*Math.PI/180,b("Kalibrierung gesetzt!"),console.log("Kalibrierter Heading (in Radianten):",c)):b("Keine Sensordaten für Kalibrierung verfügbar!")});const d={latitude:51.935502,longitude:7.652093},h=[3,6,9,12,15],m=document.querySelector("a-scene");document.querySelector("[gps-new-camera]").addEventListener("gps-camera-update-position",i=>{if(!n){console.log("Warte auf vollständige Sensordaten...");return}const p=i.detail.position.latitude,g=i.detail.position.longitude;b("GPS-Position aktualisiert");const M=P(p,g,d.latitude,d.longitude);e.innerText=`Entfernung zum Ziel: ${Math.round(M)} m`;let x=0;if(c!==null&&(x=l.alpha*Math.PI/180-c),document.querySelectorAll("a-circle").forEach(u=>u.parentNode.removeChild(u)),h.forEach(u=>{const f=document.createElement("a-circle");f.setAttribute("radius","0.5"),f.setAttribute("color","#00008B"),f.setAttribute("opacity","0.7");const w=I(p,g,d.latitude,d.longitude,u,x);f.setAttribute("gps-new-entity-place",{latitude:w.latitude,longitude:w.longitude}),m.appendChild(f)}),!r){const u=document.createElement("a-image");u.setAttribute("src","./images/map-marker.png"),u.setAttribute("width","4"),u.setAttribute("height","4"),u.setAttribute("look-at","[gps-new-camera]"),u.setAttribute("gps-new-entity-place",{latitude:d.latitude,longitude:d.longitude}),m.appendChild(u),r=!0}})};function C(r,n,l,c,e){const t=r*Math.PI/180,o=n*Math.PI/180,s=l*Math.PI/180,d=c*Math.PI/180-o,h=Math.sin(d)*Math.cos(s),m=Math.cos(t)*Math.sin(s)-Math.sin(t)*Math.cos(s)*Math.cos(d),y=Math.atan2(h,m),i=6371e3,p=e,g=Math.asin(Math.sin(t)*Math.cos(p/i)+Math.cos(t)*Math.sin(p/i)*Math.cos(y)),M=o+Math.atan2(Math.sin(y)*Math.sin(p/i)*Math.cos(t),Math.cos(p/i)-Math.sin(t)*Math.sin(g));return{latitude:g*180/Math.PI,longitude:M*180/Math.PI}}function I(r,n,l,c,e,t){const o=C(r,n,l,c,e),s=111320,a=40075e3*Math.cos(r*Math.PI/180)/360,d=(o.latitude-r)*s,h=(o.longitude-n)*a,m=h*Math.cos(t)-d*Math.sin(t),y=h*Math.sin(t)+d*Math.cos(t),i=r+y/s,p=n+m/a;return{latitude:i,longitude:p}}function P(r,n,l,c){const t=Math.PI/180,o=(l-r)*t,s=(c-n)*t,a=Math.sin(o/2)*Math.sin(o/2)+Math.cos(r*t)*Math.cos(l*t)*Math.sin(s/2)*Math.sin(s/2);return 6371e3*(2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)))}function b(r){const n=document.createElement("div");n.style.position="fixed",n.style.top="20px",n.style.left="50%",n.style.transform="translateX(-50%)",n.style.padding="10px 20px",n.style.backgroundColor="rgba(0, 0, 0, 0.7)",n.style.color="white",n.style.fontSize="14px",n.style.borderRadius="5px",n.style.zIndex="9999",n.innerText=r,document.body.appendChild(n),setTimeout(()=>{n.remove()},1e3)}
