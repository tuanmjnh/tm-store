import{d as B,k as G,B as R,r as i,$ as n,G as E,aw as j,c as M,b as a,w as r,e,i as d,F as N,P as O,o as q,I as z,T as H,C as J,j as K}from"./index-CdWp1Bke.js";import{A as L}from"./index-CN4o6Y_W.js";import{D as Q,a as W}from"./index-k5VEC7u2.js";import"./index-DpTwKlnw.js";import{S as X}from"./index-MNi-81oi.js";import{_ as Y}from"./tabBarView.vue_vue_type_script_setup_true_lang-gdjfs5wv.js";import{_ as Z}from"./index.vue_vue_type_style_index_0_lang-DbJ6YQ6L.js";import{_ as ee}from"./add.vue_vue_type_script_setup_true_lang-DObUlbm9.js";import{d as oe}from"./index-DbHcLYuo.js";import{D as te}from"./index-BPrd6SHs.js";import"./index-BEQ1__mJ.js";import"./function-call-gnPaGpGq.js";import"./index-mwYAXttw.js";import"./MdEditor-BD9Qdvc_.js";import"./index-B7laanD8.js";const ye=B({__name:"list",setup(ae){const w=G(),m=R(),l=i({text:"",type:w.meta.module,flag:1,page:1,rowsPerPage:15}),b=[{text:n("global.activite"),value:1},{text:n("global.inactivite"),value:0}],y=E(()=>m.all),_=i(j(y.value.filter(s=>s.flag==l.value.flag&&s.type==l.value.type),{parentProperty:"parent",customID:"_id",order:"order"})),p=i([]);i(!1);const h=i(!1),u=i(!1),f=i(!1),c=i(!1),v=async()=>{await oe(600)};v();const C=async()=>{h.value=!0,u.value=!1,await v()},k=async()=>{await m.setItem(),c.value=!0},V=async s=>{await m.setItem(s),c.value=!0},x=async()=>{const s=await m.updateFlag(p.value.map(o=>({_id:o._id,flag:l.value.flag||0})));s.status&&m.removeItems(s.success,_.value)};return(s,o)=>{const F=z,g=H,$=X,D=Q,I=W,S=J,U=K,P=O,A=L,T=te;return q(),M(N,null,[a(Z,{color:"blue",items:e(_),"id-key":"_id","name-key":"title",modelValue:e(p),"onUpdate:modelValue":o[0]||(o[0]=t=>d(p)?p.value=t:null),dense:"",selectable:""},{append:r(t=>[a(F,{id:"edit-folder",name:"records-o",onClick:le=>V(t.item)},null,8,["onClick"])]),_:1},8,["items","modelValue"]),a(Y,null,{item:r(()=>[a(g,{icon:"add-o",onClick:k}),a(g,{icon:"filter-o",onClick:o[1]||(o[1]=t=>u.value=!e(u))})]),_:1}),a(P,{show:e(u),"onUpdate:show":o[4]||(o[4]=t=>d(u)?u.value=t:null),position:"bottom",style:{height:"30%"}},{default:r(()=>[a($,{modelValue:e(l).text,"onUpdate:modelValue":o[2]||(o[2]=t=>e(l).text=t),placeholder:e(n)("global.search")},null,8,["modelValue","placeholder"]),a(U,null,{default:r(()=>[a(S,{title:e(n)("global.status")},{value:r(()=>[a(I,null,{default:r(()=>[a(D,{modelValue:e(l).flag,"onUpdate:modelValue":o[3]||(o[3]=t=>e(l).flag=t),options:b,onChange:C},null,8,["modelValue"])]),_:1})]),_:1},8,["title"])]),_:1})]),_:1},8,["show"]),a(A,{show:e(f),"onUpdate:show":o[5]||(o[5]=t=>d(f)?f.value=t:null),"cancel-text":e(n)("global.cancel"),"close-on-click-action":"",actions:[{name:e(l).flag?e(n)("global.delete"):e(n)("global.recover"),color:e(l).flag?"#f56c6c":"#e6a23c"}],onSelect:x},null,8,["show","cancel-text","actions"]),a(T,{show:e(c),"onUpdate:show":o[7]||(o[7]=t=>d(c)?c.value=t:null),class:"full-screen footer",title:e(m).item._id?e(n)("global.update"):e(n)("global.add"),"show-cancel-button":!1,"show-confirm-button":!1},{default:r(()=>[a(ee,{"is-dialog":"",onOnClose:o[6]||(o[6]=t=>c.value=!1)})]),_:1},8,["show","title"])],64)}}});export{ye as default};
