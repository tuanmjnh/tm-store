import{d as H,r as u,$ as a,c as S,b as l,w as n,e,i as v,F as V,P as J,o as m,f as O,g as y,s as Q,t as L,a as W,N as X,K as $,q as Y,C as Z,L as ee,T as te,j as oe}from"./index-CdWp1Bke.js";import{A as le}from"./index-CN4o6Y_W.js";import{D as ae,a as ne}from"./index-k5VEC7u2.js";import"./index-DpTwKlnw.js";import{S as se}from"./index-MNi-81oi.js";import{P as ie,T as ue,S as re}from"./index-DVJ0m97g.js";import{_ as ce}from"./tabBarView.vue_vue_type_script_setup_true_lang-gdjfs5wv.js";import{u as de}from"./roles-WVUqtx32.js";import{d as pe}from"./index-DbHcLYuo.js";import{B as ge}from"./index-mwYAXttw.js";const Fe=H({__name:"list",setup(me){const p=de(),s=u({text:"",key:"group",flag:1,page:1,rowsPerPage:15}),P=[{text:a("global.activite"),value:1},{text:a("global.inactivite"),value:0}],r=u([]),h=u([]),g=u(!1),w=u(!1),c=u(!1),d=u(!1),f=u(!1),x=async()=>{await pe(600),c.value&&(s.value.page=1,r.value=[],c.value=!1);const{data:i,rowsNumber:o}=await p.getItems(s.value);r.value=r.value.concat(i),s.value.page++,g.value=!1,(r.value.length>=o||!i.length)&&(w.value=!0)},B=async()=>{w.value=!1,g.value=!0,await x()},I=async()=>{c.value=!0,d.value=!1,await x()},R=async()=>{await p.setItem(),$.push("add")},T=async i=>{await p.setItem(i),$.push(`edit/${i._id}`)},b=async i=>{h.value=[Y(i)],f.value=!0},U=async()=>{const i=await p.updateFlag(h.value.map(o=>({_id:o._id,flag:s.value.flag==1?0:1})));i.status&&p.removeItems(i.success,r.value)};return(i,o)=>{const _=ge,q=ue,k=Z,D=re,N=ee,A=ie,C=te,E=se,j=ae,z=ne,G=oe,K=J,M=le;return m(),S(V,null,[l(A,{modelValue:e(c),"onUpdate:modelValue":o[1]||(o[1]=t=>v(c)?c.value=t:null),"pulling-text":e(a)("global.textPulling"),"loosing-text":e(a)("global.textLoosing"),"loading-text":e(a)("global.textLoading"),onRefresh:B},{default:n(()=>[l(N,{loading:e(g),"onUpdate:loading":o[0]||(o[0]=t=>v(g)?g.value=t:null),finished:e(w),"finished-text":e(a)("global.textFinished"),"loading-text":e(a)("global.textLoading"),offset:50,onLoad:x},{default:n(()=>[(m(!0),S(V,null,O(e(r),t=>(m(),y(D,{key:t._id},{left:n(()=>[l(_,{square:"",icon:"passed",type:"primary"})]),right:n(()=>[l(_,{square:"",icon:"edit",type:"success",onClick:F=>T(t)},null,8,["onClick"]),e(s).flag?(m(),y(_,{key:0,square:"",icon:"close",type:"danger",onClick:F=>b(t)},null,8,["onClick"])):(m(),y(_,{key:1,square:"",icon:"replay",type:"warning",onClick:F=>b(t)},null,8,["onClick"]))]),default:n(()=>[l(k,{title:t.name,value:t.key,label:t.desc},{title:n(()=>[l(q,{type:"primary",class:"mr-2"},{default:n(()=>[Q(L(t.level),1)]),_:2},1024),W("span",{style:X({color:t.color})},L(t.name),5)]),_:2},1032,["title","value","label"])]),_:2},1024))),128))]),_:1},8,["loading","finished","finished-text","loading-text"])]),_:1},8,["modelValue","pulling-text","loosing-text","loading-text"]),l(ce,null,{item:n(()=>[l(C,{icon:"add-o",onClick:R}),l(C,{icon:"filter-o",onClick:o[2]||(o[2]=t=>d.value=!e(d))})]),_:1}),l(K,{show:e(d),"onUpdate:show":o[5]||(o[5]=t=>v(d)?d.value=t:null),position:"bottom",style:{height:"30%"}},{default:n(()=>[l(E,{modelValue:e(s).text,"onUpdate:modelValue":o[3]||(o[3]=t=>e(s).text=t),placeholder:e(a)("global.search")},null,8,["modelValue","placeholder"]),l(G,null,{default:n(()=>[l(k,{title:e(a)("global.status")},{value:n(()=>[l(z,null,{default:n(()=>[l(j,{modelValue:e(s).flag,"onUpdate:modelValue":o[4]||(o[4]=t=>e(s).flag=t),options:P,onChange:I},null,8,["modelValue"])]),_:1})]),_:1},8,["title"])]),_:1})]),_:1},8,["show"]),l(M,{show:e(f),"onUpdate:show":o[6]||(o[6]=t=>v(f)?f.value=t:null),"cancel-text":e(a)("global.cancel"),"close-on-click-action":"",actions:[{name:e(s).flag?e(a)("global.delete"):e(a)("global.recover"),color:e(s).flag?"#f56c6c":"#e6a23c"}],onSelect:U},null,8,["show","cancel-text","actions"])],64)}}});export{Fe as default};
