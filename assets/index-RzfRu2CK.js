(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const r of t)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function h(t){const r={};return t.integrity&&(r.integrity=t.integrity),t.referrerPolicy&&(r.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?r.credentials="include":t.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(t){if(t.ep)return;t.ep=!0;const r=h(t);fetch(t.href,r)}})();document.addEventListener("DOMContentLoaded",()=>{console.log("DOM fully loaded and parsed");const u=document.getElementById("arrow"),i=document.getElementById("distance-display"),h=document.getElementById("radar-arrow"),s=document.getElementById("radar");u?console.log("Arrow model found in DOM"):console.error("Arrow model not found in DOM");const t={latitude:51.935918,longitude:7.650877};"geolocation"in navigator?(console.log("Geolocation is supported"),navigator.geolocation.watchPosition(o=>{const{latitude:n,longitude:e}=o.coords;console.log(`User position updated: lat=${n}, lon=${e}`),r(n,e),c(),w(n,e),b(n,e)},o=>console.error("Geolocation error:",o),{enableHighAccuracy:!0,maximumAge:0,timeout:5e3})):console.error("Geolocation not supported by this browser.");function r(o,n){const e=M(o,n,t.latitude,t.longitude);console.log(`Calculated bearing: ${e} degrees`),u.setAttribute("rotation",`0 ${e} 0`)}function c(o,n){console.log(`Updating arrow position: lat=${t.latitude}, lon=${t.longitude}`),u.setAttribute("gps-entity-place",`latitude: ${t.latitude}; longitude: ${t.longitude};`)}function w(o,n){const e=P(o,n,t.latitude,t.longitude);console.log(`Distance to target: ${e} meters`),i.innerText=`Distance: ${e.toFixed(2)} m`}function b(o,n){const e=M(o,n,t.latitude,t.longitude);h.style.transform=`rotate(${e}deg)`;const l=D(),a=Math.abs(l-e);a<45||a>315?s.style.backgroundColor="green":s.style.backgroundColor="red"}function D(){return window.screen.orientation?window.screen.orientation.angle:(console.error("Screen.orientation API is not supported."),0)}function M(o,n,e,l){const a=m=>m*Math.PI/180,g=m=>m*180/Math.PI,d=a(l-n),f=Math.sin(d)*Math.cos(a(e)),y=Math.cos(a(o))*Math.sin(a(e))-Math.sin(a(o))*Math.cos(a(e))*Math.cos(d);let p=g(Math.atan2(f,y));return p=(p+360)%360,console.log(`Bearing calculation result: ${p}`),p}function P(o,n,e,l){const g=(e-o)*(Math.PI/180),d=(l-n)*(Math.PI/180),f=Math.sin(g/2)*Math.sin(g/2)+Math.cos(o*(Math.PI/180))*Math.cos(e*(Math.PI/180))*Math.sin(d/2)*Math.sin(d/2);return 6371e3*(2*Math.atan2(Math.sqrt(f),Math.sqrt(1-f)))}});
