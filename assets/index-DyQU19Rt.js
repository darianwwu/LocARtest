(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function c(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=c(e);fetch(e.href,t)}})();window.onload=()=>{let l=!1;const o={latitude:51.935502,longitude:7.652093},c=[3,6,9,12,15],r=document.querySelector("a-scene");document.querySelector("[gps-new-camera]").addEventListener("gps-camera-update-position",t=>{const n=t.detail.position.latitude,i=t.detail.position.longitude;console.log(`User position: ${n}, ${i}`),console.log(`Target position: ${o.latitude}, ${o.longitude}`),l?document.querySelectorAll("a-circle").forEach((s,a)=>{const p=c[a],d=M(n,i,o.latitude,o.longitude,p);s.setAttribute("gps-new-entity-place",{latitude:d.latitude,longitude:d.longitude})}):(c.forEach(f=>{const s=document.createElement("a-circle");s.setAttribute("radius","1"),s.setAttribute("color","#FF0000"),s.setAttribute("opacity","0.5");const a=M(n,i,o.latitude,o.longitude,f);s.setAttribute("gps-new-entity-place",{latitude:a.latitude,longitude:a.longitude}),r.appendChild(s)}),l=!0)})};function M(l,o,c,r,e){const t=l*Math.PI/180,n=o*Math.PI/180,i=c*Math.PI/180,s=r*Math.PI/180-n,a=Math.sin(s)*Math.cos(i),p=Math.cos(t)*Math.sin(i)-Math.sin(t)*Math.cos(i)*Math.cos(s),d=Math.atan2(a,p),u=6371e3,h=e,g=Math.asin(Math.sin(t)*Math.cos(h/u)+Math.cos(t)*Math.sin(h/u)*Math.cos(d)),m=n+Math.atan2(Math.sin(d)*Math.sin(h/u)*Math.cos(t),Math.cos(h/u)-Math.sin(t)*Math.sin(g));return{latitude:g*180/Math.PI,longitude:m*180/Math.PI}}
