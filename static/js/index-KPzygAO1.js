import{Q as z,S as C,bi as I,a7 as l,V as R,d as D,bC as N,bK as q,b as a,I as w,a3 as L,ab as O,ag as U}from"./index-CCiqnY4g.js";const[V,o]=z("button"),_=C({},I,{tag:l("button"),text:String,icon:String,type:l("default"),size:l("normal"),color:String,block:Boolean,plain:Boolean,round:Boolean,square:Boolean,loading:Boolean,hairline:Boolean,disabled:Boolean,iconPrefix:String,nativeType:l("button"),loadingSize:R,loadingText:String,loadingType:String,iconPosition:l("left")});var E=D({name:V,props:_,emits:["click"],setup(n,{emit:g,slots:i}){const f=N(),b=()=>i.loading?i.loading():a(O,{size:n.loadingSize,type:n.loadingType,class:o("loading")},null),c=()=>{if(n.loading)return b();if(i.icon)return a("div",{class:o("icon")},[i.icon()]);if(n.icon)return a(w,{name:n.icon,class:o("icon"),classPrefix:n.iconPrefix},null)},x=()=>{let e;if(n.loading?e=n.loadingText:e=i.default?i.default():n.text,e)return a("span",{class:o("text")},[e])},S=()=>{const{color:e,plain:r}=n;if(e){const t={color:r?e:"white"};return r||(t.background=e),e.includes("gradient")?t.border=0:t.borderColor=e,t}},m=e=>{n.loading?L(e):n.disabled||(g("click",e),f())};return()=>{const{tag:e,type:r,size:t,block:y,round:B,plain:P,square:k,loading:T,disabled:s,hairline:d,nativeType:h,iconPosition:u}=n,v=[o([r,t,{plain:P,block:y,round:B,square:k,loading:T,disabled:s,hairline:d}]),{[q]:d}];return a(e,{type:h,class:v,style:S(),disabled:s,onClick:m},{default:()=>[a("div",{class:o("content")},[u==="left"&&c(),x(),u==="right"&&c()])]})}}});const Q=U(E);export{Q as B};