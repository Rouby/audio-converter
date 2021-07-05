var e=Object.defineProperty,t=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,o=(t,r,a)=>r in t?e(t,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[r]=a,n=(e,n)=>{for(var l in n||(n={}))r.call(n,l)&&o(e,l,n[l]);if(t)for(var l of t(n))a.call(n,l)&&o(e,l,n[l]);return e};import{u as l,r as s,J as c,c as p,L as i,C as m,B as u,F as d,R as g,a as E}from"./vendor.7277691d.js";const{createFFmpeg:x,fetchFile:f}=window.FFmpeg,v=x();function y(){const{acceptedFiles:e,getRootProps:t,getInputProps:r,isDragActive:a,isDragAccept:o,isDragReject:g}=l({accept:"audio/*"}),[E,x]=s.exports.useState({}),[y,b]=s.exports.useState(null);return s.exports.useEffect((()=>{if(e.length>0){!async function(){await v.load();const t={};x(n({},t));const r=new c;for(const a of e){v.FS("writeFile",a.name,await f(a)),await v.run("-i",a.name,"output.ogg");const e=v.FS("readFile","output.ogg"),o=new Blob([e],{type:"audio/ogg"});t[a.name]=URL.createObjectURL(o),r.file(a.name.replace(/\.\w+$/,"ogg"),o),x(n({},t))}b(r)}()}}),[e]),s.exports.createElement("div",{className:"App"},s.exports.createElement("header",{className:"App-header"},"Audio Converter"),s.exports.createElement("div",{className:"Dropzone-container"},s.exports.createElement("div",n({},t({className:p("Dropzone",a&&"Dropzone-active",o&&"Dropzone-accept",g&&"Dropzone-reject")})),s.exports.createElement("input",n({},r())),s.exports.createElement("p",null,"Drag 'n' drop some files here, or click to select files")),s.exports.createElement("ul",{className:"File-list"},e.map((e=>s.exports.createElement("li",{key:e.name,className:"File"},s.exports.createElement("div",null,E[e.name]?null:s.exports.createElement(i,{size:"sm"})),s.exports.createElement("div",null,e.name),E[e.name]?s.exports.createElement("audio",{className:"Player",controls:!0,src:E[e.name]}):s.exports.createElement("div",null))))),y?s.exports.createElement(m,null,s.exports.createElement(u,{onClick:()=>y.generateAsync({type:"blob"}).then((e=>d.exports.saveAs(e,"audio.zip")))},"Download all")):null))}g.render(E.createElement(E.StrictMode,null,E.createElement(y,null)),document.getElementById("root"));
