import{d as O,J as Q,z as W,G as X,r,$ as s,c as P,b as a,w as o,e,i as y,F as T,P as Y,o as g,f as Z,g as h,s as ee,t as U,a as te,K as B,q as le,C as ae,L as oe,T as ne,j as se}from"./index-CCiqnY4g.js";import{A as ie}from"./index-B5j9-yk4.js";import{D as ue,a as re}from"./index-BMD1pfGu.js";import"./index-df1euzin.js";import{S as ce}from"./index-CV8Z38v6.js";import{P as de,T as pe,S as me}from"./index-LNpVP83O.js";import{_ as ge}from"./tabBarView.vue_vue_type_script_setup_true_lang-Dr-UnG8l.js";import{d as fe}from"./index-DbHcLYuo.js";import{B as _e}from"./index-KPzygAO1.js";const Se=O({__name:"list",setup(ve){const u=Q();W(()=>{u.getKey()});const I=X(()=>u.keys.map(n=>({text:s(`types.${n}`),value:n}))),i=r({text:"",key:"group",flag:1,page:1,rowsPerPage:15}),q=[{text:s("global.activite"),value:1},{text:s("global.inactivite"),value:0}],c=r(u.items),b=r([]),d=r(!1),f=r(!1),p=r(!1),m=r(!1),_=r(!1),w=async()=>{await fe(600),p.value&&(i.value.page=1,c.value=[],p.value=!1);const{data:n,rowsNumber:l}=await u.getItems(i.value);c.value=c.value.concat(n),i.value.page++,d.value=!1,(c.value.length>=l||!n.length)&&(f.value=!0)},D=()=>{u.items&&u.items.length?(d.value=!1,f.value=!0):w()},R=async()=>{f.value=!1,d.value=!0,await w()},k=async()=>{p.value=!0,m.value=!1,await w()},N=async()=>{await u.setItem(),B.push("add")},A=async n=>{await u.setItem(n),B.push(`edit/${n._id}`)},C=async n=>{b.value=[le(n)],_.value=!0},E=async()=>{const n=await u.updateFlag(b.value.map(l=>({_id:l._id,flag:i.value.flag==1?0:1})));n.status&&u.removeItems(n.success,c.value)};return(n,l)=>{const v=_e,G=pe,x=ae,K=me,M=oe,j=de,V=ne,z=ce,F=ue,S=re,$=se,J=Y,H=ie;return g(),P(T,null,[a(j,{modelValue:e(p),"onUpdate:modelValue":l[1]||(l[1]=t=>y(p)?p.value=t:null),"pulling-text":e(s)("global.textPulling"),"loosing-text":e(s)("global.textLoosing"),"loading-text":e(s)("global.textLoading"),onRefresh:R},{default:o(()=>[a(M,{loading:e(d),"onUpdate:loading":l[0]||(l[0]=t=>y(d)?d.value=t:null),finished:e(f),"finished-text":e(s)("global.textFinished"),"loading-text":e(s)("global.textLoading"),offset:50,onLoad:D},{default:o(()=>[(g(!0),P(T,null,Z(e(c),t=>(g(),h(K,{key:t._id},{left:o(()=>[a(v,{square:"",icon:"passed",type:"primary"})]),right:o(()=>[a(v,{square:"",icon:"edit",type:"success",onClick:L=>A(t)},null,8,["onClick"]),e(i).flag?(g(),h(v,{key:0,square:"",icon:"close",type:"danger",onClick:L=>C(t)},null,8,["onClick"])):(g(),h(v,{key:1,square:"",icon:"replay",type:"warning",onClick:L=>C(t)},null,8,["onClick"]))]),default:o(()=>[a(x,{title:t.code,value:t.name,label:t.desc},{title:o(()=>[a(G,{type:"primary",class:"mr-2"},{default:o(()=>[ee(U(t.order),1)]),_:2},1024),te("span",null,U(t.name),1)]),_:2},1032,["title","value","label"])]),_:2},1024))),128))]),_:1},8,["loading","finished","finished-text","loading-text"])]),_:1},8,["modelValue","pulling-text","loosing-text","loading-text"]),a(ge,null,{item:o(()=>[a(V,{icon:"add-o",onClick:N}),a(V,{icon:"filter-o",onClick:l[2]||(l[2]=t=>m.value=!e(m))})]),_:1}),a(J,{show:e(m),"onUpdate:show":l[6]||(l[6]=t=>y(m)?m.value=t:null),position:"bottom",style:{height:"30%"}},{default:o(()=>[a(z,{modelValue:e(i).text,"onUpdate:modelValue":l[3]||(l[3]=t=>e(i).text=t),placeholder:e(s)("global.search")},null,8,["modelValue","placeholder"]),a($,null,{default:o(()=>[a(x,{title:e(s)("global.key")},{value:o(()=>[a(S,null,{default:o(()=>[a(F,{modelValue:e(i).key,"onUpdate:modelValue":l[4]||(l[4]=t=>e(i).key=t),options:e(I),onChange:k},null,8,["modelValue","options"])]),_:1})]),_:1},8,["title"])]),_:1}),a($,null,{default:o(()=>[a(x,{title:e(s)("global.status")},{value:o(()=>[a(S,null,{default:o(()=>[a(F,{modelValue:e(i).flag,"onUpdate:modelValue":l[5]||(l[5]=t=>e(i).flag=t),options:q,onChange:k},null,8,["modelValue"])]),_:1})]),_:1},8,["title"])]),_:1})]),_:1},8,["show"]),a(H,{show:e(_),"onUpdate:show":l[7]||(l[7]=t=>y(_)?_.value=t:null),"cancel-text":e(s)("global.cancel"),"close-on-click-action":"",actions:[{name:e(i).flag?e(s)("global.delete"):e(s)("global.recover"),color:e(i).flag?"#f56c6c":"#e6a23c"}],onSelect:E},null,8,["show","cancel-text","actions"])],64)}}});export{Se as default};