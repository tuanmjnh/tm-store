import{f as d,u as _,F as A}from"./index-DpTwKlnw.js";import{Q as F,S as f,a7 as i,a6 as L,d as N,r as T,a0 as B,b as o,ac as u,ad as D,a3 as O,ag as K}from"./index-CdWp1Bke.js";const[j,t,q]=F("search"),M=f({},d,{label:String,shape:i("square"),leftIcon:i("search"),clearable:L,actionText:String,background:String,showAction:Boolean});var Q=N({name:j,props:M,emits:["blur","focus","clear","search","cancel","clickInput","clickLeftIcon","clickRightIcon","update:modelValue"],setup(n,{emit:c,slots:a,attrs:b}){const h=_(),l=T(),k=()=>{a.action||(c("update:modelValue",""),c("cancel"))},I=e=>{e.keyCode===13&&(O(e),c("search",n.modelValue))},r=()=>n.id||`${h}-input`,g=()=>{if(a.label||n.label)return o("label",{class:t("label"),for:r()},[a.label?a.label():n.label])},p=()=>{if(n.showAction){const e=n.actionText||q("cancel");return o("div",{class:t("action"),role:"button",tabindex:0,onClick:k},[a.action?a.action():e])}},C=()=>{var e;return(e=l.value)==null?void 0:e.blur()},v=()=>{var e;return(e=l.value)==null?void 0:e.focus()},m=e=>c("blur",e),S=e=>c("focus",e),x=e=>c("clear",e),E=e=>c("clickInput",e),R=e=>c("clickLeftIcon",e),w=e=>c("clickRightIcon",e),y=Object.keys(d),P=()=>{const e=f({},b,u(n,y),{id:r()}),s=V=>c("update:modelValue",V);return o(A,D({ref:l,type:"search",class:t("field",{"with-message":e.errorMessage}),border:!1,onBlur:m,onFocus:S,onClear:x,onKeypress:I,onClickInput:E,onClickLeftIcon:R,onClickRightIcon:w,"onUpdate:modelValue":s},e),u(a,["left-icon","right-icon"]))};return B({focus:v,blur:C}),()=>{var e;return o("div",{class:t({"show-action":n.showAction}),style:{background:n.background}},[(e=a.left)==null?void 0:e.call(a),o("div",{class:t("content",n.shape)},[g(),P()]),p()])}}});const z=K(Q);export{z as S};
