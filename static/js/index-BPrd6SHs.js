import{Q as O,S as R,bw as _,V as F,am as H,a7 as K,a6 as C,bx as N,d as z,r as I,az as L,by as M,b as o,ad as U,ac as V,an as Q,P as W,bz as y,aW as j,bA as q,bB as G,aD as J,ag as X}from"./index-CdWp1Bke.js";import{B as v}from"./index-mwYAXttw.js";import{A as k,a as Y}from"./function-call-gnPaGpGq.js";const[Z,a,u]=O("dialog"),$=R({},_,{title:String,theme:String,width:F,message:[String,Function],callback:Function,allowHtml:Boolean,className:H,transition:K("van-dialog-bounce"),messageAlign:String,closeOnPopstate:C,showCancelButton:Boolean,cancelButtonText:String,cancelButtonColor:String,cancelButtonDisabled:Boolean,confirmButtonText:String,confirmButtonColor:String,confirmButtonDisabled:Boolean,showConfirmButton:C,closeOnClickOverlay:Boolean}),p=[...N,"transition","closeOnPopstate"];var ee=z({name:Z,props:$,emits:["confirm","cancel","keydown","update:show"],setup(e,{emit:d,slots:l}){const g=I(),i=L({confirm:!1,cancel:!1}),h=n=>d("update:show",n),w=n=>{var t;h(!1),(t=e.callback)==null||t.call(e,n)},b=n=>()=>{e.show&&(d(n),e.beforeClose?(i[n]=!0,J(e.beforeClose,{args:[n],done(){w(n),i[n]=!1},canceled(){i[n]=!1}})):w(n))},f=b("cancel"),m=b("confirm"),x=M(n=>{var t,c;if(n.target!==((c=(t=g.value)==null?void 0:t.popupRef)==null?void 0:c.value))return;({Enter:e.showConfirmButton?m:y,Escape:e.showCancelButton?f:y})[n.key](),d("keydown",n)},["enter","esc"]),P=()=>{const n=l.title?l.title():e.title;if(n)return o("div",{class:a("header",{isolated:!e.message&&!l.default})},[n])},S=n=>{const{message:t,allowHtml:c,messageAlign:s}=e,r=a("message",{"has-title":n,[s]:s}),B=j(t)?t():t;return c&&typeof B=="string"?o("div",{class:r,innerHTML:B},null):o("div",{class:r},[B])},T=()=>{if(l.default)return o("div",{class:a("content")},[l.default()]);const{title:n,message:t,allowHtml:c}=e;if(t){const s=!!(n||l.title);return o("div",{key:c?1:0,class:a("content",{isolated:!s})},[S(s)])}},D=()=>o("div",{class:[G,a("footer")]},[e.showCancelButton&&o(v,{size:"large",text:e.cancelButtonText||u("cancel"),class:a("cancel"),style:{color:e.cancelButtonColor},loading:i.cancel,disabled:e.cancelButtonDisabled,onClick:f},null),e.showConfirmButton&&o(v,{size:"large",text:e.confirmButtonText||u("confirm"),class:[a("confirm"),{[q]:e.showCancelButton}],style:{color:e.confirmButtonColor},loading:i.confirm,disabled:e.confirmButtonDisabled,onClick:m},null)]),A=()=>o(Y,{class:a("footer")},{default:()=>[e.showCancelButton&&o(k,{type:"warning",text:e.cancelButtonText||u("cancel"),class:a("cancel"),color:e.cancelButtonColor,loading:i.cancel,disabled:e.cancelButtonDisabled,onClick:f},null),e.showConfirmButton&&o(k,{type:"danger",text:e.confirmButtonText||u("confirm"),class:a("confirm"),color:e.confirmButtonColor,loading:i.confirm,disabled:e.confirmButtonDisabled,onClick:m},null)]}),E=()=>l.footer?l.footer():e.theme==="round-button"?A():D();return()=>{const{width:n,title:t,theme:c,message:s,className:r}=e;return o(W,U({ref:g,role:"dialog",class:[a([c]),r],style:{width:Q(n)},tabindex:0,"aria-labelledby":t||s,onKeydown:x,"onUpdate:show":h},V(e,p)),{default:()=>[P(),T(),E()]})}}});const ae=X(ee);export{ae as D};
