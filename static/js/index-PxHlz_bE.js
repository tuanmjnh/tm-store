import{d as m,u as v,p as f,G as c,g as h,w as r,j as _,o as $,b as t,e,H as S,C as V}from"./index-CdWp1Bke.js";import{S as b}from"./index-B10X1U2S.js";const w=m({__name:"index",setup(g){const s=v(),n=f(),l=c(()=>n.userInfo);return(a,o)=>{const u=V,i=b,d=_;return $(),h(d,null,{default:r(()=>[t(u,{title:a.$t("user.fullName"),value:e(l).fullName},null,8,["title","value"]),t(u,{title:a.$t("user.phone"),value:e(l).phone},null,8,["title","value"]),t(u,{title:a.$t("user.email"),value:e(l).email},null,8,["title","value"]),t(u,{title:a.$t("user.dateBirth"),value:e(S)(e(l).dateBirth).format(e(s).format.date)},null,8,["title","value"]),t(u,{title:a.$t("user.personNumber"),value:e(l).personNumber},null,8,["title","value"]),t(u,{title:a.$t("user.gender"),value:e(l).gender},null,8,["title","value"]),t(u,{title:a.$t("user.address"),value:e(l).address},null,8,["title","value"]),t(u,{title:a.$t("user.verify")},{"right-icon":r(()=>[t(i,{modelValue:e(l).verified,"onUpdate:modelValue":o[0]||(o[0]=p=>e(l).verified=p),disabled:"",size:"20px","aria-label":"Verified"},null,8,["modelValue"])]),_:1},8,["title"])]),_:1})}}});export{w as default};
