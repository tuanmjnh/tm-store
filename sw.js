if(!self.define){let s,e={};const i=(i,c)=>(i=new URL(i+".js",c).href,e[i]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=i,s.onload=e,document.head.appendChild(s)}else s=i,importScripts(i),e()})).then((()=>{let s=e[i];if(!s)throw new Error(`Module ${i} didn’t register its module`);return s})));self.define=(c,a)=>{const d=s||("document"in self?document.currentScript.src:"")||location.href;if(e[d])return;let r={};const t=s=>i(s,d),f={module:{uri:d},exports:r,require:t};e[d]=Promise.all(c.map((s=>f[s]||t(s)))).then((s=>(a(...s),r)))}}define(["./workbox-5ffe50d4"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"favicon.ico",revision:"1ba2ae710d927f13d483fd5d1e548c9b"},{url:"icons/AppIcon-83.5x83.5@2x.png",revision:"6970529ea7b62e79dd270518110038cc"},{url:"icons/apple-touch-icon.png",revision:"ca77399d0f71368f11ef3007364ff09a"},{url:"icons/favicon-128x128.png",revision:"586087277195da87dede15171117970e"},{url:"icons/favicon-16x16.png",revision:"194e8e1d3fe0636f476bacf480dce40c"},{url:"icons/favicon-32x32.png",revision:"4febc2a398fcaddb605462ca569cb13a"},{url:"icons/favicon-96x96.png",revision:"271bbb1c97f2a8f704fd568b34a2d8fa"},{url:"icons/favicon.ico",revision:"204dbfcf8b62aa9b95514d68628b22dc"},{url:"icons/pwa-192x192.png",revision:"8c446eb09cf8740cf126f3d9e4315387"},{url:"icons/pwa-512x512.png",revision:"669e73fcac9700865bd90c4d5ba52904"},{url:"icons/pwa-maskable-192x192.png",revision:"1185ded37b7651beef8d854f613e4c98"},{url:"icons/pwa-maskable-512x512.png",revision:"8e2861a76829f2aa8a3482701785328a"},{url:"index.html",revision:"d969520153862e438aadea4c4bf8f1e8"},{url:"registerSW.js",revision:"d04cd3e25f4cb9c9035cd48cff73eb9a"},{url:"static/css/add-BCuRkT6h.css",revision:"513d13ff9a38ccfeb1b1275c5f1447cc"},{url:"static/css/add-CxhI4KxC.css",revision:"6290ad85d6f0a3b55f9d8168e39bf944"},{url:"static/css/google-drive-BbLRdWGC.css",revision:"fd59c5561a63d88a444bf81e94cb764e"},{url:"static/css/index-39SkaLJ-.css",revision:"2ecfa5d772417e087553ace242138dde"},{url:"static/css/index-7w7STn-5.css",revision:"49903b03211862cbbf063d27a38aac56"},{url:"static/css/index-B6g1TFdJ.css",revision:"30e71e692dd74782957e4a170ee5f3ec"},{url:"static/css/index-BAkiffLG.css",revision:"ffdf9381f4f08e5a76fd780f7fbda562"},{url:"static/css/index-C9V8pppp.css",revision:"1decb955c4f593f9bbf3619ce70f3e3d"},{url:"static/css/index-Cg5molzI.css",revision:"f14a6306388df348d0a55663d67a74f1"},{url:"static/css/index-D4lSZYC8.css",revision:"110dd5c93da1382c09782cff278ebaf9"},{url:"static/css/index-D4WpI1rO.css",revision:"4fa03573262a7e38358fe9bf4031fff1"},{url:"static/css/index-DLMh62Ht.css",revision:"65d2b84c79521d4ed5b56c8fb9ceace0"},{url:"static/css/index-DXisN2Ix.css",revision:"901b060b5547cf0f5ad99dac8efa1aea"},{url:"static/css/index-isvguOdi.css",revision:"3de46f54fe3a443ce66bfd0d7b76cbc5"},{url:"static/css/index-UNWAFgOH.css",revision:"1cdc6a7096113a4b21684fe48c42394e"},{url:"static/css/index-ZS-upCyR.css",revision:"2304bc961ea40f8789a65afd465ed4aa"},{url:"static/css/upload-image-links-ugYhSBeO.css",revision:"b7f78b90e316d7426da5197a15075d0b"},{url:"static/js/add-5nf19WBA.js",revision:"bfa2fdb5ae0eedb20e1f431748f0b5e6"},{url:"static/js/add-CeZGIW-K.js",revision:"0b952355f030594b5e71df28aaaad999"},{url:"static/js/add-CHLYdCM4.js",revision:"a9b0d518310fdb77bc3b9de5e82cdf12"},{url:"static/js/add-DLovA_rP.js",revision:"f5c49dfc27bdabf8a40d55ab08aa9b55"},{url:"static/js/add-LaTVBYak.js",revision:"4c1d44a75360dcd2841a36db004991b1"},{url:"static/js/add-Q-6yjZtO.js",revision:"8438db28bfb600bfbdac7e1efb0c6d37"},{url:"static/js/add.vue_vue_type_script_setup_true_lang-DObUlbm9.js",revision:"542b4cfa168bd4fc899829ba780e44d0"},{url:"static/js/add.vue_vue_type_style_index_0_lang-Bb2RnTMh.js",revision:"4ea0356cde75ba2e464f78ef8ef1c883"},{url:"static/js/apl-B4CMkyY2.js",revision:"8d1a3eab6a97e5a46150bb92dc7a8fb1"},{url:"static/js/asciiarmor-Df11BRmG.js",revision:"8c659d9736d3d6c9fef569b8857611f6"},{url:"static/js/asn1-CGOzndHr.js",revision:"b0e23e85c0190e0730297d0f8b3e2274"},{url:"static/js/asterisk-B-8jnY81.js",revision:"9048d25955911230a0c42508ffa89f45"},{url:"static/js/barcodeGenerator-DC7rOhiq.js",revision:"59a5ef7a116fe3cfb72e57aa5cfe7dc5"},{url:"static/js/brainfuck-C4LP7Hcl.js",revision:"541d1e633716bc4fd482101d58d37733"},{url:"static/js/clike-DWq2Y8ae.js",revision:"142aa8f90651acbc31c24cc16d48128e"},{url:"static/js/clojure-BMjYHr_A.js",revision:"31651f16dd4c524e33216d85e87e79c1"},{url:"static/js/cmake-BQqOBYOt.js",revision:"ad75287ea6620b76560d5a01c138dadb"},{url:"static/js/cobol-XrqhtCFE.js",revision:"767e6f48f8092e2a5af121b1fa169372"},{url:"static/js/coffeescript-S37ZYGWr.js",revision:"d3c3b445583b440bc53e34ddd098fb8c"},{url:"static/js/commonlisp-DBKNyK5s.js",revision:"fc9cffd8aa477055792c27eb73a41e36"},{url:"static/js/crystal-SjHAIU92.js",revision:"d6551eb892a3e02b22938c48e0f7efeb"},{url:"static/js/css-BnMrqG3P.js",revision:"d449582fe432645f20415216fde0b3c6"},{url:"static/js/cypher-C_CwsFkJ.js",revision:"4115757b2008dcad910d85280a4cbdca"},{url:"static/js/d-pRatUO7H.js",revision:"80cd3b35d821958c5a46bb604ef53a86"},{url:"static/js/diff-DbItnlRl.js",revision:"abc8a1140e0ded0e05df8dae3ceea1f1"},{url:"static/js/dockerfile-BuNIbK2j.js",revision:"2c3dd9e37ce0a3ef37c63ab1f9644b09"},{url:"static/js/drive-gapi-CVXAYCZ6.js",revision:"3e3302423f5ce4088860572df82afc08"},{url:"static/js/dtd-DF_7sFjM.js",revision:"8f6b509807fe40b8068a116a4ec69a0e"},{url:"static/js/dylan-DwRh75JA.js",revision:"5b7fe34ec881876032ab74efa603012f"},{url:"static/js/ebnf-CDyGwa7X.js",revision:"4fa661b3707e244bc13892a25809e7eb"},{url:"static/js/ecl-Cabwm37j.js",revision:"c586ee327aeea55cd130db54e99d68cc"},{url:"static/js/eiffel-CnydiIhH.js",revision:"bf831c27dc4c5c57c1446bd8140e64f1"},{url:"static/js/elm-vLlmbW-K.js",revision:"490df77486ae46ca7dc779def2066849"},{url:"static/js/erlang-BNw1qcRV.js",revision:"e7b62c61c1fd3338a0b01340b429fc06"},{url:"static/js/ErrorTip.vue_vue_type_script_setup_true_lang-C4cIufWZ.js",revision:"6c877f30504dda4e516c35a86012c8aa"},{url:"static/js/factor-D8pE9siL.js",revision:"7a906315d8ce57af1b548731215f0654"},{url:"static/js/fcl-Kvtd6kyn.js",revision:"a06ab92812547c9327aeb9955572859a"},{url:"static/js/forth-Ffai-XNe.js",revision:"64492c1d2b38b7a731ad4e337a49b073"},{url:"static/js/fortran-DYz_wnZ1.js",revision:"2c85662c002b4bb0078efdbbe02abe86"},{url:"static/js/function-call-gnPaGpGq.js",revision:"b2732fbd69260e21c87eec0510060b5d"},{url:"static/js/gas-Bneqetm1.js",revision:"7ad023d0348a8ec122daf4403cbafb8f"},{url:"static/js/gherkin-heZmZLOM.js",revision:"84dd8753c58e57560657fa796442867e"},{url:"static/js/google-add-B4wR7-8D.js",revision:"341079ed7f573d94dead8784a53cf077"},{url:"static/js/google-drive-C9RJPe_D.js",revision:"0b22404ad83535146e344bd89dc1a814"},{url:"static/js/google-remove-CqeVHOKK.js",revision:"db0490468212f1cb6b4317bb0ef9fedc"},{url:"static/js/groovy-DKLxxR9y.js",revision:"650535079ccb0ab849ab4ae101983358"},{url:"static/js/haskell-BWDZoCOh.js",revision:"a5647cd6f760c281fdc86dc5d85e6fcd"},{url:"static/js/haxe-pv4rovob.js",revision:"2fad3a5ddc0d07387181fc07a785fd8e"},{url:"static/js/http-DBlCnlav.js",revision:"2a86b7abf4727e1837ca152fb22c5c2b"},{url:"static/js/idl-BEugSyMb.js",revision:"bf9fa0a79cafc5afe7377f4d82c63179"},{url:"static/js/image-BoVPK3so.js",revision:"e4f464a6e70f90a3ee2a3e415e96087b"},{url:"static/js/index-2F1OWjam.js",revision:"954b650551cdef2fcb80d0c903d4ae44"},{url:"static/js/index-9HjMpZaI.js",revision:"7c086027063079e7bc5984fd0acbda7a"},{url:"static/js/index-B10X1U2S.js",revision:"78d13339c3e60f416c5fc2dbc7037161"},{url:"static/js/index-B6nM6TUU.js",revision:"2fe3236aff1d17b9d9e0d411b8404e84"},{url:"static/js/index-B7laanD8.js",revision:"ea751bd6e77bdf66839f7cb4dc70144b"},{url:"static/js/index-BemKfst0.js",revision:"c214b88d343590bb2bb3db3b967bc6b0"},{url:"static/js/index-BEQ1__mJ.js",revision:"1a52c834eec9d56c5ae9b6ea59c81275"},{url:"static/js/index-BLM5mZqd.js",revision:"2a3e5a8b2ac2e92320ca37450afa63f8"},{url:"static/js/index-BoOcSLdH.js",revision:"b8d13de7f3ec738c2fb0124062d1cc03"},{url:"static/js/index-BPGQKVAC.js",revision:"96e02801ba6778419f55c99e8b39e352"},{url:"static/js/index-BPrd6SHs.js",revision:"3b67cc318d9eb0dae4d1a33b257f7bc1"},{url:"static/js/index-BUrVKSVG.js",revision:"129128ab4e067df40aa79d1d331cb20d"},{url:"static/js/index-BvcgKi3Q.js",revision:"5ec4b71a0169f9e45b46049a813db65d"},{url:"static/js/index-BVi3QIPv.js",revision:"a142849dd0b509b469171e33d74b5245"},{url:"static/js/index-BWFwUMSN.js",revision:"faed225b117aca56fd89059bbb69f158"},{url:"static/js/index-BYLRSU1O.js",revision:"0dbe48ac20a767bca6a275920ff75835"},{url:"static/js/index-CdWp1Bke.js",revision:"9cdbff4c0f104f7c4bdfa49fa307b82a"},{url:"static/js/index-CN4o6Y_W.js",revision:"15ff3a9c4ca61fd3751399f3fb040a62"},{url:"static/js/index-Cs_gHNCl.js",revision:"d7dbb3b9310d4ee2e834eb8dfe6d36b4"},{url:"static/js/index-Cttwu79W.js",revision:"0aa9905819b8a6e34736b0cd60d6bf01"},{url:"static/js/index-Cx-VUnEJ.js",revision:"adb276b7884c4e48fea4f01d37232b5f"},{url:"static/js/index-D-burKOQ.js",revision:"ed0080287957416e38ac34a2aa4ddb12"},{url:"static/js/index-D04VJof3.js",revision:"8285e8ddd892e280756a9e23d565ba4f"},{url:"static/js/index-D3tZlqQq.js",revision:"f1e005642e45a89bdc3f3013abc17a3a"},{url:"static/js/index-D6ADjgBP.js",revision:"4d455ce65951bae2c37af56add32b273"},{url:"static/js/index-DbHcLYuo.js",revision:"2faf5a322501235bef02fcb558c53ebd"},{url:"static/js/index-DcaXHWKZ.js",revision:"1957ed688073c7956eaec07b262c58e9"},{url:"static/js/index-Dimn5hKd.js",revision:"9041f7a9f4bb8755ce09d703cba2de87"},{url:"static/js/index-DJXbWA4k.js",revision:"5e2967ee39d146b60b46ca47a20a7cd0"},{url:"static/js/index-DpTwKlnw.js",revision:"9aa144ab90b30b712461068dedec7b5d"},{url:"static/js/index-DVJ0m97g.js",revision:"a0ce23217f5e4be23fdc43086f8d6655"},{url:"static/js/index-DX8oGy4B.js",revision:"c939475c3f8be733ab8cdd129ee723ef"},{url:"static/js/index-GfQvlso9.js",revision:"0c5e301f7fd62f5b8edc0d769448eeda"},{url:"static/js/index-k5VEC7u2.js",revision:"4eb63443fc4f94bed6dd5ce154ea2382"},{url:"static/js/index-KS8KjvaN.js",revision:"7286925fd43886b2680e08bc61d521a8"},{url:"static/js/index-MNi-81oi.js",revision:"850763cb4f23645fbe6501826ef7f1f1"},{url:"static/js/index-mwYAXttw.js",revision:"784bbf761f4e015a11651b318f1ce543"},{url:"static/js/index-oUKRLcq0.js",revision:"7e813681012a48ca1abdd9c69fc0c6ae"},{url:"static/js/index-PwdDNKVh.js",revision:"bb9c9e6b8a19b418386bf3fb4dbb6f04"},{url:"static/js/index-PxHlz_bE.js",revision:"a7ff5fbe9eb31f8f6aa981fdee2cd9a4"},{url:"static/js/index-Qe6ncXJr.js",revision:"0d7c261826329dd3efb3cadb42026c16"},{url:"static/js/index-ScFvzPq0.js",revision:"1762e5cb4932abe87755e5b58e16a814"},{url:"static/js/index-VYwDc1t3.js",revision:"d66e8e32c529016149899c04be4c08ac"},{url:"static/js/index-XUW3-al0.js",revision:"20fb0e5e61c269e1b2ac78608275440f"},{url:"static/js/index.vue_vue_type_style_index_0_lang-DbJ6YQ6L.js",revision:"b5498a3bfc70762da1000a2968e8e7c5"},{url:"static/js/javascript-iSgyE4tI.js",revision:"6f4333c5ff8f8c25747ef6dc28568ac5"},{url:"static/js/jinja2-C4DGRd-O.js",revision:"55eec096c40d4dc8a09348dc4d1f9769"},{url:"static/js/julia-DuME0IfC.js",revision:"d20a48d57cd614021a5503f485c76559"},{url:"static/js/list-Btcuwxbq.js",revision:"b5e8fd021eb3bca885a5e8765059eb66"},{url:"static/js/list-CLeQWzkr.js",revision:"eb04d7b28541e60b57d8b04ae9747af1"},{url:"static/js/list-CzuzNzT6.js",revision:"882cc3b9e5154691865b3bdbfee45aff"},{url:"static/js/list-DKGkDc4N.js",revision:"1dde75e5c653f84057b70054cad8bdc5"},{url:"static/js/list-DrVnQama.js",revision:"35be838d7a09499de8134148c082f501"},{url:"static/js/list-w1AceMwn.js",revision:"3bb53dd1aeab228ca9f3b3fd96cbbecc"},{url:"static/js/livescript-k3uCVVjK.js",revision:"019a49b88423da04864c48092fc20415"},{url:"static/js/lodash-9XeukUMN.js",revision:"8da2bf6cc1de491d8d0261b438715dab"},{url:"static/js/lua-BgMRiT3U.js",revision:"e9fa9f9f5f78710a4bbcde1251a00a6d"},{url:"static/js/mathematica-DTrFuWx2.js",revision:"d3b7eaaac3ef77f6b7f8832f707f124d"},{url:"static/js/mbox-CNhZ1qSd.js",revision:"04ceac1f901b2d704708015f71d7a7ff"},{url:"static/js/MdEditor-BD9Qdvc_.js",revision:"17268b7e198cdbee49326e96181381f0"},{url:"static/js/mirc-CjQqDB4T.js",revision:"cf7c0ae89b34e817f3bb172af025e490"},{url:"static/js/mllike-C_8OmSiT.js",revision:"59963434552012151df2af41b27b0140"},{url:"static/js/modelica-Dc1JOy9r.js",revision:"03f103da3293fb38e19ab898bc79bb83"},{url:"static/js/mscgen-BA5vi2Kp.js",revision:"46cdc030f721e1eefcf9b0749bf63664"},{url:"static/js/mumps-BT43cFF4.js",revision:"6c4116ce44ede1e3a82f154696eb25fd"},{url:"static/js/nginx-DdIZxoE0.js",revision:"1aeb0f06f96f65fb6a8cf9a67dc23616"},{url:"static/js/nsis-CEAdamBV.js",revision:"ace1fa4dcaa03bcdcddd067cab83ae0f"},{url:"static/js/ntriples-BfvgReVJ.js",revision:"a001e84584e38332dec63a1fb4a62ca0"},{url:"static/js/octave-Ck1zUtKM.js",revision:"68d9b3dfdc635e4190d362e7ecbe95e4"},{url:"static/js/oz-BzwKVEFT.js",revision:"59e0d13ca21b7e93d4bad5a0ceaece44"},{url:"static/js/pascal-B1wCu0_E.js",revision:"f5423f72321912b152d7c33cd8b19a8c"},{url:"static/js/perl-CdXCOZ3F.js",revision:"a7b441b2e1c40e49238ac0af44533b29"},{url:"static/js/pig-CevX1Tat.js",revision:"f8e5c34294be6abc6e8d0df5e8f4ef5b"},{url:"static/js/powershell-CFHJl5sT.js",revision:"29f89d8526c61a9d7d8b40305aff9cf6"},{url:"static/js/properties-C78fOPTZ.js",revision:"483fae286b4b01c8b6c71c2fddc741cd"},{url:"static/js/protobuf-ChK-085T.js",revision:"808d55464ad16cefee4047636237e284"},{url:"static/js/pug-BmUsPMDj.js",revision:"81d789b6b46d3ae0718a654aeb4589b5"},{url:"static/js/puppet-DMA9R1ak.js",revision:"be32b445f25671170c1da636e5be5b93"},{url:"static/js/python-BuPzkPfP.js",revision:"72a40d102733074a8972ef91190f2005"},{url:"static/js/q-ZnEupP5q.js",revision:"b44f87c052ae3207d2acdb34339168f9"},{url:"static/js/qrcodeGenerator-hALdCWNi.js",revision:"20eaef22fa97a8948543662a92bb330a"},{url:"static/js/r-DUYO_cvP.js",revision:"ac477b6aa2b37e20f0e21e8ebc8bc642"},{url:"static/js/roles-WVUqtx32.js",revision:"a4eee59cc975f086541e4669e5656bed"},{url:"static/js/rpm-CTu-6PCP.js",revision:"e62d98f3d5d5837ca129fd16220b420c"},{url:"static/js/ruby-B2Rjki9n.js",revision:"24d1168ef2f432726aa8d2160c20e92f"},{url:"static/js/sas-B4kiWyti.js",revision:"1f52a3ac3ae8c62cdabea2f31f0df9b2"},{url:"static/js/scheme-C41bIUwD.js",revision:"44aa92928d8bac67cf9fd8531dc3a8e8"},{url:"static/js/shell-CjFT_Tl9.js",revision:"61a83907d726021f36aa50f25f48349b"},{url:"static/js/sieve-C3Gn_uJK.js",revision:"17a3f36fb9fd0623776c47cfcd10d67f"},{url:"static/js/simple-mode-C4Nsj8zu.js",revision:"94c7987509c8c364d8205ce907673bd2"},{url:"static/js/smalltalk-CnHTOXQT.js",revision:"a52ed89902cf1571ec6c1d66c54f8928"},{url:"static/js/solr-DehyRSwq.js",revision:"bb9c4a3b010fdddbc9b184834f272437"},{url:"static/js/sparql-DkYu6x3z.js",revision:"037f1c1208395361e5ff3b27b787cdbf"},{url:"static/js/spreadsheet-BCZA_wO0.js",revision:"ca19b609b8eca9aab8bbd5ec3792ff78"},{url:"static/js/sql-C4g8LzGK.js",revision:"00ce2a2125165c2e8432fb73788d7033"},{url:"static/js/stex-C3f8Ysf7.js",revision:"4dce51f0583a7018b1a8b29ab9dbde07"},{url:"static/js/stylus-BdAi1jBa.js",revision:"69c7316cab60d7069037bd9a617f5127"},{url:"static/js/swift-BzpIVaGY.js",revision:"ad11437b8fbf69e19c3972cf91fef327"},{url:"static/js/tabBarView.vue_vue_type_script_setup_true_lang-gdjfs5wv.js",revision:"606f83451eadd9dfea9c87f24fa5bcc3"},{url:"static/js/tcl-DVfN8rqt.js",revision:"427b07e8533f9c27a41b8c70cc24bbb1"},{url:"static/js/textile-CnDTJFAw.js",revision:"245141d9c7d3b8a4eeabdda66fe92900"},{url:"static/js/tiddlywiki-DO-Gjzrf.js",revision:"22a0e5e1c890cdbb920b190db89b7b3b"},{url:"static/js/tiki-DGYXhP31.js",revision:"dc94aa6456a8fc3000b6e2aef9c2cca6"},{url:"static/js/tmViewBox.vue_vue_type_script_setup_true_lang-CdlzRL9r.js",revision:"94d2472d697f54283c77fe74e6b2302b"},{url:"static/js/toml-BXUEaScT.js",revision:"e8b63a9d5ef08ccbec55c876221f9b6e"},{url:"static/js/troff-wAsdV37c.js",revision:"9eaeb7d651cf74290b4ab22798f4720c"},{url:"static/js/ttcn-cfg-BIkV9KBc.js",revision:"6f2cd7c1028dfe77ceaef5a2d65460ce"},{url:"static/js/ttcn-CiGrtVSZ.js",revision:"a23546474d1e6173d5da67c25249a974"},{url:"static/js/turtle-B1tBg_DP.js",revision:"36e49d5b2d850d63421f1ff41ddb0631"},{url:"static/js/types-CQfc4tMr.js",revision:"cf1a5a44425293dc27edd879b7a63c0a"},{url:"static/js/upload-image-links-B410S613.js",revision:"20584e7ae528c06a7035c075e55d27eb"},{url:"static/js/users-Bf1AVKHh.js",revision:"770982df778cc95ba3532d6f3e22c8b2"},{url:"static/js/vb-CmGdzxic.js",revision:"aacfb047174bb2e8c8f29f5dcdaa6b41"},{url:"static/js/vbscript-BuJXcnF6.js",revision:"a29e99ae0a36dcf2ef7d34126cb67fe5"},{url:"static/js/velocity-D8B20fx6.js",revision:"853191ad0a885d18d2f9e12d6cb7ffd9"},{url:"static/js/verilog-C6RDOZhf.js",revision:"d2f4aebb160dd8e46b69e578767e8447"},{url:"static/js/vhdl-lSbBsy5d.js",revision:"71b8f9e19b42890a929ac21038fd7146"},{url:"static/js/vueQrcodeReader.vue_vue_type_script_setup_true_lang-4KQHq9B4.js",revision:"a9cecb180ea7325bc948cb2a49f79876"},{url:"static/js/webidl-ZXfAyPTL.js",revision:"e46995cd25f249a968b16e186a9e09b7"},{url:"static/js/xquery-WRlm2TX8.js",revision:"82e50431c0182093821aa69251bc06aa"},{url:"static/js/yacas-BJ4BC0dw.js",revision:"4cfc3516e7d848609ead46d59f992f93"},{url:"static/js/z80-Hz9HOZM7.js",revision:"0e19c825a4d423f561d2c1c44c9cccba"},{url:"static/svg/error-403-VPEqmg7m.svg",revision:"6e071a0e4e2e54033828bdfe72835911"},{url:"static/svg/error-404-DLMSXL2R.svg",revision:"0c5a005b1f5c61f7fd116f620d8ff43f"},{url:"static/svg/error-500-C1R4JvdT.svg",revision:"1ac2fd7d2eca6d06363ff01a3e85db65"},{url:"icons/pwa-192x192.png",revision:"8c446eb09cf8740cf126f3d9e4315387"},{url:"icons/pwa-512x512.png",revision:"669e73fcac9700865bd90c4d5ba52904"},{url:"manifest.webmanifest",revision:"2ac5d2fb8df8391e317a30e3af0d665b"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
