(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const e of t)if(e.type==="childList")for(const o of e.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function i(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?e.credentials="include":t.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function r(t){if(t.ep)return;t.ep=!0;const e=i(t);fetch(t.href,e)}})();document.addEventListener("DOMContentLoaded",function(){const a=document.getElementById("dreieck"),n={latitude:51.9353,longitude:7.649964};function i(t,e,o,s,c){const u=t*(Math.PI/180),l=e*(Math.PI/180),f=o*(Math.PI/180),g=s*(Math.PI/180)-l,h=f-u,d=Math.atan2(h,g),L=c/6371e3*Math.cos(d),m=c/6371e3*Math.sin(d),p=t+L*(180/Math.PI),y=e+m*(180/Math.PI);return{latitude:p,longitude:y}}function r(t,e){a.setAttribute("gps-new-entity-place",`latitude: ${t}; longitude: ${e};`),console.log(`Neue Entity-Position gesetzt: ${t}, ${e}`)}navigator.geolocation.getCurrentPosition(t=>{const e=t.coords.latitude,o=t.coords.longitude,s=i(e,o,n.latitude,n.longitude,5);r(s.latitude,s.longitude)},t=>console.error("Fehler beim Abrufen des Standorts:",t),{enableHighAccuracy:!0})});
