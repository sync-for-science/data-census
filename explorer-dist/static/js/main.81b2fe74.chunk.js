(this["webpackJsonpbulk-census-explorer"]=this["webpackJsonpbulk-census-explorer"]||[]).push([[0],{274:function(e,t,n){},275:function(e,t,n){},528:function(e,t,n){"use strict";n.r(t);var a=n(3),c=n(0),r=n.n(c),i=n(33),l=n.n(i),s=(n(274),n(11)),o=(n(275),n(14)),d=n.n(o),u=n(573),h=n(568);var j=function(e){var t=e.data,n=e.currentResourceCategory,r=e.onSelect,i=Object(c.useState)([]),l=Object(s.a)(i,2),o=l[0],j=l[1];Object(c.useEffect)((function(){var e=d.a.chain(t).filter((function(e){return e.elementPath===e.resourceType})).sortBy(["resourceType","stratification"]).value();j(e)}),[t]);var f=function(e,t){return e+("unstratified"!==t?" ("+t+")":"")},m=function(e){e.preventDefault(),r&&r(o[e.currentTarget.id])};return Object(a.jsx)("div",{children:Object(a.jsxs)(u.a,{children:[Object(a.jsx)(u.a.Toggle,{variant:"outline-primary",className:"",children:function(){if(n&&o){var e=o.find((function(e){return e.stratification===n.stratification&&e.resourceType===n.resourceType}));return f(e.resourceType,e.stratification)}}()||"Select Resource"}),Object(a.jsx)(u.a.Menu,{popperConfig:{strategy:"fixed"},children:o.map((function(e,t){var c,r=f(e.resourceType,e.stratification);return Object(a.jsxs)(u.a.Item,{active:n&&e.resourceType===n.resourceType&&e.stratification===n.stratification,href:"#",className:"d-flex",id:t,onClick:m,children:[Object(a.jsx)("div",{children:r}),Object(a.jsx)("div",{className:"ml-auto pl-4",children:Object(a.jsx)(h.a,{variant:"light",pill:!0,children:(c=e.count,c.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","))})})]},r)}))})]})})},f=n(112);var m=function(e){var t=e.data,n=Object(f.a)(e,["data"]),c=function(e){n.onSelect&&n.onSelect(e.currentTarget.id),e.preventDefault()};return Object(a.jsxs)("table",{className:"my-2",children:[Object(a.jsx)("thead",{className:"font-weight-bold",children:Object(a.jsxs)("tr",{style:{borderBottom:"1px solid grey"},children:[Object(a.jsx)("td",{className:"text-center py-2",children:"%"}),Object(a.jsx)("td",{children:"name"}),Object(a.jsx)("td",{children:"type"})]})}),Object(a.jsx)("tbody",{children:t.map((function(e,r){if(-1!==e.level){var i=t[r-1]&&t[r-1].level,l=t[r+1]&&t[r+1].level,s=100*(e.count/e.parentCount||0),o=0===e.level?"resource":"parent";return Object(a.jsxs)("tr",{id:e.elementPath,className:e.elementPath===n.selectedElement?"element element-selected":"element",onClick:c,children:[Object(a.jsx)("td",{children:Object(a.jsx)("div",{title:"".concat(Math.round(s),"% of ").concat(o),className:"element-pct",children:Object(a.jsx)("div",{style:{width:Math.round(100-s)+"%"},className:"element-pct-bar"})})}),Object(a.jsxs)("td",{className:"d-flex",children:[d.a.range(1,e.level+1).map((function(e){var t=["element-level"];return e>i&&t.push("element-level-first"),e>l&&t.push("element-level-last"),Object(a.jsx)("div",{className:t.join(" ")},e)})),Object(a.jsx)("div",{className:"element-name-outer",children:Object(a.jsx)("button",{className:"element-name btn btn-link p-0",title:e.elementPath,children:e.display})})]}),Object(a.jsx)("td",{className:"element-type",children:e.fhirType})]},e.elementPath)}}))})]})};var b=function(e){var t=e.elementsList,n=e.currentResourceCategory,r=e.onCurrentElementChange,i=e.onCurrentResourceCategoryChange,l=Object(c.useState)(),o=Object(s.a)(l,2),d=o[0],u=o[1],h=Object(c.useState)([]),f=Object(s.a)(h,2),b=f[0],p=f[1];Object(c.useEffect)((function(){t&&n&&p(t.filter((function(e){return e.stratification===n.stratification&&e.resourceType===n.resourceType})))}),[t,n]);var x=function(e){u(e),r&&r(t.find((function(t){return t.elementPath===e&&t.stratification===(n&&n.stratification)})))};return Object(a.jsxs)("div",{children:[Object(a.jsx)(j,{data:t,onSelect:function(e){i(e),x(null)},currentResourceCategory:n}),b.length>0&&n&&Object(a.jsx)(m,{data:b,selectedElement:d,onSelect:x})]})},p=n(569),x=n(254);var O=function(e){var t=e.element,n=e.detailData,r=Object(c.useState)(),i=Object(s.a)(r,2),l=i[0],o=i[1];Object(c.useEffect)((function(){var e=d.a.chain(n).filter((function(e){return"instanceCount"===e.detailType})).map((function(e){return{items:parseInt(e.detailStratification.split("-")[0]),count:e.count}})).sortBy("items").value();if(e.length){var t=function(e){var t,n=d.a.minBy(e,"items"),a=d.a.maxBy(e,"items"),c=d.a.sumBy(e,"count"),r=0;return e.forEach((function(n,a){void 0===t&&(r+n.count>c/2?t=n.items:r+n.count===c/2?t=(n.items+e[a+1].items)/2:r+=n.count)})),{max:a?a.items:0,min:n?n.items:0,median:t,count:c}}(e);o(t)}else o()}),[n,t]);var u=function(e){return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",")},h=Math.round(t.count/t.parentCount*100);return Object(a.jsx)("div",{children:Object(a.jsxs)(p.a,{className:"mb-4",children:[Object(a.jsx)(x.a,{children:Object(a.jsxs)("div",{className:"p-2 shadow-sm bg-white rounded",children:[Object(a.jsx)("div",{className:"mb-2 text-center text-secondary text-uppercase",children:"populated"}),Object(a.jsxs)("div",{className:"d-flex justify-content-center",children:[Object(a.jsxs)("div",{className:"mr-5",children:[Object(a.jsxs)("h2",{className:"mb-0",style:{color:"#059669",fontWeight:700},children:[0===h?"< 1":h,"%"]}),Object(a.jsx)("div",{children:"of parents"})]}),Object(a.jsxs)("div",{children:[Object(a.jsx)("h2",{className:"mb-0",style:{color:"#059669",fontWeight:700},children:u(t.count)}),Object(a.jsx)("div",{children:"elements"})]})]})]})}),l&&Object(a.jsx)(x.a,{children:Object(a.jsxs)("div",{className:"p-2 shadow-sm bg-white rounded",style:{backgroundColor:"white"},children:[Object(a.jsx)("div",{className:"mb-2 text-center text-secondary text-uppercase",children:"instances"}),Object(a.jsxs)("div",{className:"d-flex justify-content-center",children:[Object(a.jsxs)("div",{className:"mr-5",children:[Object(a.jsx)("h2",{className:"mb-0",style:{color:"#059669",fontWeight:700},children:u(t.instanceCount||0)}),Object(a.jsx)("div",{children:"count"})]}),Object(a.jsxs)("div",{children:[Object(a.jsxs)("h2",{className:"mb-0",style:{color:"#059669",fontWeight:700},children:[Object(a.jsx)("span",{children:u(l.median)}),l.min!==l.max&&Object(a.jsxs)("span",{style:{fontSize:"50%"},children:[" (range of ",l.min,"-",l.max,")"]})]}),Object(a.jsx)("div",{children:"median per parent"})]})]})]})})]})})},v=n(16),g=n(19),y=n(65),C=n(20),N=n(21),S=n(575),T=n(261),E=function(e){Object(C.a)(n,e);var t=Object(N.a)(n);function n(e){var a;return Object(v.a)(this,n),(a=t.call(this)).updateTextFilter=d.a.debounce((function(){a.setState({appliedTextFilter:a.state.filterText})}),1e3).bind(Object(y.a)(a)),a.state=a.resetData(e.detailData),a}return Object(g.a)(n,[{key:"componentDidUpdate",value:function(e,t){if(e&&this.props.detailData!==e.detailData&&this.setState(this.resetData(this.props.detailData)),t&&(t.appliedTextFilter!==this.state.appliedTextFilter||t.subsetFilter!==this.state.subsetFilter)){var n=this.state.data;"all"!==this.state.subsetFilter&&(n=this.filterByCount(n,25,"uncommon"===this.state.subsetFilter)),this.state.appliedTextFilter&&(n=this.filterByText(n,this.state.appliedTextFilter)),this.setState({displayData:n})}}},{key:"resetData",value:function(e){var t=e.filter((function(e){return"coding"===e.detailType}));return{data:t,displayData:t,appliedTextFilter:"",filterText:"",subsetFilter:"all",countType:"resource"}}},{key:"buildTooltip",value:function(e){var t,n=e.id.split("|")[1]?e.id.split("|")[1]:e.id,c=(e.data.text||"")!==n?(e.data.text||"").split("\n").reduce((function(e,t){return Object(a.jsxs)(a.Fragment,{children:[e,Object(a.jsx)("br",{}),t]})})):"";return Object(a.jsxs)(a.Fragment,{children:[n,": ",Object(a.jsx)("b",{children:(t=e.value,t.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","))}),c&&Object(a.jsx)("br",{}),c]})}},{key:"dataToTree",value:function(e){var t=d.a.map(e,(function(e){var t=e.detailStratification,n=t.split("|"),a=Object(s.a)(n,2);return{system:a[0]||"No System",id:t,code:a[1],text:e.text,value:e.count}})),n={id:"Codings",children:[]},a=d.a.chain(t).uniqBy("system").map("system").value();return d.a.each(a,(function(e){n.children.push({id:e,children:t.filter((function(t){return t.system===e}))})})),n}},{key:"filterByCount",value:function(e,t,n){return d.a.chain(e).orderBy("count",n?"desc":"asc").slice(0,t).value()}},{key:"filterByText",value:function(e,t){return t?e.filter((function(e){return e.detailStratification.toUpperCase().indexOf(t.toUpperCase())>-1||(e.text||"").toUpperCase().indexOf(t.toUpperCase())>-1})):e}},{key:"handleTextChange",value:function(e){this.setState({filterText:e.target.value}),this.updateTextFilter()}},{key:"handleSubsetChange",value:function(e){this.setState({subsetFilter:e})}},{key:"render",value:function(){var e=this,t=this.state.displayData;return Object(a.jsxs)("div",{className:"p-4 shadow-sm p-3 mb-5 bg-white rounded",style:{backgroundColor:"white"},children:[Object(a.jsxs)("div",{className:"mb-4",children:[Object(a.jsx)("span",{children:"Show: "}),Object(a.jsx)(S.a.Check,{inline:!0,checked:"all"===this.state.subsetFilter,onChange:this.handleSubsetChange.bind(this,"all"),label:"all codes",type:"radio",id:"count-filter-all"}),Object(a.jsx)(S.a.Check,{inline:!0,checked:"common"===this.state.subsetFilter,onChange:this.handleSubsetChange.bind(this,"common"),label:"most common codes (25)",type:"radio",id:"count-filter-common"}),Object(a.jsx)(S.a.Check,{inline:!0,checked:"uncommon"===this.state.subsetFilter,onChange:this.handleSubsetChange.bind(this,"uncommon"),label:"least common codes (25)",type:"radio",id:"count-filter-uncommon"})]}),Object(a.jsx)(S.a.Control,{className:"mb-4",placeholder:"search...",value:this.state.filterText||"",onChange:this.handleTextChange.bind(this)}),Object(a.jsx)("div",{style:{height:"600px"},children:Object(a.jsx)(T.a,{data:this.dataToTree(t),valueFormat:" >,",orientLabel:!1,margin:{top:10,right:2,bottom:2,left:2},colors:{scheme:"greens"},label:function(e){return e.data.code},theme:{labels:{text:{fontSize:"14px",fontWeight:"bold"}}},labelTextColor:"black",parentLabelTextColor:"black",labelSkipSize:12,nodeOpacity:.2,tooltip:function(t){var n=t.node;return Object(a.jsx)("div",{children:e.buildTooltip(n)})}})})]})}}]),n}(r.a.Component),w=n(111),k=n(30),D=n(162);function P(e){var t=e.detailStratification.split("-"),n=Object(s.a)(t,1)[0];return parseInt(n)}function z(e){var t=e.map(P);return[d.a.minBy(t),d.a.max(t)]}var F=function(e){e.element;var t=e.data,n=Object(f.a)(e,["element","data"]).monthNames||["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],r=Object(c.useState)(),i=Object(s.a)(r,2),l=i[0],o=i[1],u=Object(c.useState)(),h=Object(s.a)(u,2),j=h[0],m=h[1];Object(c.useEffect)((function(){var e=z(t);o(e),m(e[1]-e[0]>10?"show":"none")}),[t]);var b=function(e){o(z(t)),m("show"),e.preventDefault()},p=function(e,t){var n=Object(a.jsxs)("span",{children:[" (",Object(a.jsx)("button",{className:"btn btn-link p-0 ",onClick:b,children:"view all years"}),")"]});return Object(a.jsxs)("div",{className:"mb-2 text-center",children:[Object(a.jsxs)("span",{className:"text-secondary text-uppercase",children:["Date Heatmap - ",e]}),t&&n]})};return l?"show"===j?function(e){return Object(a.jsxs)("div",{children:[p("summary"),Object(a.jsx)("div",{style:{height:35*e.length},children:Object(a.jsx)(D.a,{data:e,keys:["count"],indexBy:"range",axisTop:null,axisLeft:{tickSize:0,tickPadding:10},colors:["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f"],theme:{labels:{text:{fontSize:"14px",fontWeight:"bold",fillOpacity:1}},fontSize:"14px",fontWeight:"bold"},margin:{left:100,right:20,top:10,bottom:10},onClick:function(e){if(0!==e.value){var t=e.yKey.split("-");o([parseInt(t[0]),parseInt(t[1])]),m("hide")}}})})]})}(function(e,t,n){return n||(n=t[1]-t[0]>=50?10:5),d.a.chunk(d.a.range(t[0],t[1]+1),n).map((function(t){return{range:d.a.first(t)+"-"+d.a.last(t),count:t.reduce((function(t,n){return t+d.a.chain(e).filter((function(e){return P(e)===n})).map((function(e){return e.count})).sum().value()||0}),0)}}))}(t,l)):function(e,t){var c="".concat(l[0]," - ").concat(l[1]);return Object(a.jsxs)("div",{children:[p(c,t),Object(a.jsx)("div",{children:Object(a.jsx)("div",{style:{height:50*e.length+50},children:Object(a.jsx)(D.a,{data:e,keys:n,indexBy:"year",colors:["#edf8fb","#ccece6","#99d8c9","#66c2a4","#2ca25f"],theme:{labels:{text:{fontSize:"14px",fontWeight:"bold",fillOpacity:1}},fontSize:"14px",fontWeight:"bold"},margin:{top:50,right:60,bottom:60,left:60},axisLeft:{tickSize:0,tickPadding:10},axisTop:{tickSize:0,tickPadding:10},cellBorderColor:{from:"color",modifiers:[["darker",.4]]},labelTextColor:{from:"color",modifiers:[["darker",1.8]]},hoverTarget:"cell",animate:!0})})})]})}(d.a.chain(t).filter((function(e){var t=P(e);return t>=l[0]&&t<=l[1]})).reduce((function(e,t){var a=t.detailStratification.split("-"),c=Object(s.a)(a,2),r=c[0],i=c[1],l=n[i-1],o=parseInt(r);return e[o]=e[o]||{year:o},e[o][l]=(e[o][l]||0)+t.count,e}),{}).values().map((function(e){return d.a.assign.apply(d.a,Object(k.a)(n.map((function(e){return Object(w.a)({},e,0)}))).concat([e]))})).value(),"hide"===j):null};var B=function(e){var t=e.detailData,n=Object(c.useState)(),r=Object(s.a)(n,2),i=r[0],l=r[1];if(Object(c.useEffect)((function(){var e=["Y","m","d","H","M","S","f","z","z","z"],n=d.a.reduce(t,(function(t,n){var a=e.indexOf(n.detailStratification);return-1===a?t:{year:(t.year||0)+(a>=0?n.count:0),month:(t.month||0)+(a>=1?n.count:0),day:(t.day||0)+(a>=2?n.count:0),time:(t.time||0)+(a>=3?n.count:0),timezone:(t.timezone||0)+(a>=7?n.count:0)}}),{});l(n)}),[t]),!i)return null;var o=function(e){var t=e/i.year*100;return t<1?"< 1%":Math.round(t)+"%"};return Object(a.jsx)(p.a,{className:"mb-4",children:Object(a.jsx)(x.a,{children:Object(a.jsxs)("div",{className:"p-2 shadow-sm bg-white rounded",children:[Object(a.jsx)("div",{className:"mb-2 text-center text-secondary text-uppercase",children:"date precision"}),Object(a.jsxs)("div",{className:"d-flex justify-content-center",children:[Object(a.jsxs)("div",{className:"mr-4",children:[Object(a.jsx)("h4",{className:"mb-0",style:{color:"#059669",fontWeight:700},children:o(i.year)}),Object(a.jsx)("div",{children:"year"})]}),Object(a.jsxs)("div",{className:"mr-4",children:[Object(a.jsx)("h4",{className:"mb-0",style:{color:"#059669",fontWeight:700},children:o(i.month)}),Object(a.jsx)("div",{children:"month"})]}),Object(a.jsxs)("div",{className:"mr-4",children:[Object(a.jsx)("h4",{className:"mb-0",style:{color:"#059669",fontWeight:700},children:o(i.day)}),Object(a.jsx)("div",{children:"day"})]}),Object(a.jsxs)("div",{className:"mr-4",children:[Object(a.jsx)("h4",{className:"mb-0",style:{color:"#059669",fontWeight:700},children:o(i.time)}),Object(a.jsx)("div",{children:"time"})]}),Object(a.jsxs)("div",{className:"mr-4",children:[Object(a.jsx)("h4",{className:"mb-0",style:{color:"#059669",fontWeight:700},children:o(i.timezone)}),Object(a.jsx)("div",{children:"timezone"})]})]})]})})})};var M=function(e){var t=e.detailData,n=e.currentElement,r=Object(c.useState)(),i=Object(s.a)(r,2),l=i[0],o=i[1];Object(c.useEffect)((function(){o(t.filter((function(e){return e.elementPath===n.elementPath&&e.stratification===n.stratification})))}),[t,n]);var d=l&&l.find((function(e){return"coding"===e.detailType})),u=l&&l.find((function(e){return"date"===e.detailType}));return l&&n?Object(a.jsxs)("div",{children:[Object(a.jsx)(O,{element:n,detailData:l}),n&&d&&Object(a.jsx)(E,{detailData:l}),n&&u&&Object(a.jsxs)("div",{children:[Object(a.jsx)(B,{detailData:l}),Object(a.jsx)(F,{data:l})]})]}):Object(a.jsx)("div",{})},I=n(86),L=function(e){var t=e.children,n=e.fileDropHandler,r=Object(c.useState)(0),i=Object(s.a)(r,2),l=i[0],o=i[1],d=function(e){return!e.dataTransfer.types||"Files"===e.dataTransfer.types[0]||"application/x-moz-file"===e.dataTransfer.types[0]},u=Object(a.jsx)("div",{style:{border:"dashed grey 4px",backgroundColor:"rgba(255,255,255,.8)",position:"absolute",top:0,bottom:0,left:0,right:0,zIndex:9999}});return Object(a.jsxs)("div",{style:{position:"relative"},onDragEnter:function(e){e.preventDefault(),e.stopPropagation(),d(e)&&o(l+1)},onDragOver:function(e){e.preventDefault(),e.stopPropagation()},onDragLeave:function(e){e.preventDefault(),e.stopPropagation(),d(e)&&o(l-1)},onDrop:function(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer.files&&1===e.dataTransfer.files.length&&n(e.dataTransfer.files[0]),o(0)},children:[l>0&&u,t]})},W=n(574),R=n(572),A=n(253);var H=function(e){var t=Object(c.useState)(),n=Object(s.a)(t,2),r=n[0],i=n[1],l=Object(c.useState)(),o=Object(s.a)(l,2),u=o[0],h=o[1],j=Object(c.useRef)(),f=e.onFileLoaded;Object(c.useEffect)((function(){var e=function(e){e=e.replace(/[[]/,"\\[").replace(/[\]]/,"\\]");var t=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(window.location.search);return null===t?"":decodeURIComponent(t[1].replace(/\+/g," "))}("data");e&&(i(!0),h(null),fetch(e).then((function(t){if(!t.ok)throw new Error("".concat(e," - HTTP ").concat(t.status," - ").concat(t.statusText));return t})).then((function(e){return e.text()})).then((function(t){try{return JSON.parse(t)}catch(n){throw new Error("".concat(e," is not a valid bulk data summary file"))}})).then((function(e){var t=m(e),n=Object(s.a)(t,2),a=n[0],c=n[1];f&&f(a,c)})).catch((function(e){h(e.message),i(!1)})))}),[f]);var m=function(e){if(!e.summary||!e.detail||!d.a.isArray(e.summary)||!d.a.isArray(e.detail)||!e.version)throw new Error("Invalid file format");if("1.0.0"!==e.version)throw new Error("Version ".concat(e.version," files are not supported"));var t=d.a.map(e.summary,(function(e){var t,n=e.elementPath.split(/\.(?![^[]*\])/),a="url"===n[n.length-1]&&"["===n[n.length-2][0],c=n.length-(a?3:2),r=a?(t=n[n.length-2].replace(/\[|\]/g,"")).indexOf("/")>-1?"..."+t.match(/[^/]+(?=\/$|$)/):t:n[n.length-1],i=a?n.slice(0,n.length-1).join("."):e.elementPath,l=a?n.slice(0,n.length-2).join("."):n.slice(0,n.length-1).join("."),s=e.position;return"ModifierExtension"===e.fhirType&&(s=2e3),"Extension"===e.fhirType&&(s=3e3),Object(I.a)(Object(I.a)({},e),{},{parentPath:l,level:c,display:r,elementPath:i,position:s,rawPath:e.elementPath})}));t=d.a.orderBy(t,["level","parentPath","position"],["asc","asc","desc"]);var n,a=[];return d.a.forEach(t,(function(e,c){if(-1===e.level)return a.unshift(e);n&&e.parentPath===t[c-1].parentPath&&e.stratification===t[c-1].stratification||(n=d.a.findIndex(a,(function(t){return t.elementPath===e.parentPath&&t.stratification===e.stratification})));var r=a[n].instanceCount||a[n].count||0;a.splice(n+1,0,Object(I.a)(Object(I.a)({},e),{},{parentCount:r}))})),[a,e.detail]},b=function(t){var n=new FileReader;return i(!0),h(null),new Promise((function(e,a){n.onload=function(t){return e(n.result)},n.onerror=function(e){return a(e)},n.readAsText(t)})).then((function(e){try{return JSON.parse(e)}catch(t){throw new Error("Error unable to parse file")}})).then((function(t){var n=m(t),a=Object(s.a)(n,2),c=a[0],r=a[1];e.onFileLoaded&&e.onFileLoaded(c,r)})).catch((function(e){h(e.message),i(!1)}))};return Object(a.jsxs)("div",{className:"text-center",children:[u&&Object(a.jsx)(W.a,{variant:"danger",className:"m-2 p-2 text-left",children:u}),r&&Object(a.jsx)(R.a,{animation:"border",role:"status",className:"m-5",children:Object(a.jsx)("span",{className:"sr-only",children:"Loading..."})}),!r&&Object(a.jsx)(L,{fileDropHandler:b,children:Object(a.jsxs)("div",{children:[Object(a.jsx)("input",{ref:j,type:"file",style:{display:"none"},onChange:function(e){e.preventDefault(),e.stopPropagation(),1===e.target.files.length&&b(e.target.files[0])},accept:".json, application/json"}),Object(a.jsx)(A.a,{className:"mt-5",onClick:function(e){e.preventDefault(),j.current.value="",j.current.click()},children:"Select File"}),Object(a.jsx)("div",{className:"mt-2 pb-5",children:"or drop file here"})]})})]})};function J(){return(J=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function U(e,t){if(null==e)return{};var n,a,c=function(e,t){if(null==e)return{};var n,a,c={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(c[n]=e[n]);return c}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(c[n]=e[n])}return c}var Y=c.createElement("g",null,c.createElement("g",null,c.createElement("path",{d:"M23.5,11.449c-6.385,0-11.563,4.959-11.563,11.077c0,7.265,5.045,9.117,5.045,13.344c0,1.045,0.799,2.017,1.999,2.731 c-0.251,0.209-0.391,0.438-0.391,0.678c0,0.322,0.253,0.623,0.688,0.881c-0.408,0.253-0.645,0.544-0.645,0.855 c0,0.314,0.242,0.608,0.659,0.863c-0.426,0.256-0.674,0.555-0.674,0.872c0,0.388,0.366,0.743,0.978,1.032 c-0.237,0.215-0.373,0.453-0.373,0.703c0,0.74,1.153,1.369,2.774,1.621C22.282,46.634,22.86,47,23.534,47 c0.673,0,1.25-0.363,1.535-0.889c1.637-0.248,2.803-0.881,2.803-1.623c0-0.247-0.131-0.482-0.363-0.694 c0.625-0.291,0.998-0.651,0.998-1.042c0-0.314-0.241-0.609-0.659-0.863c0.425-0.257,0.674-0.554,0.674-0.871 c0-0.322-0.254-0.623-0.688-0.882c0.41-0.252,0.646-0.544,0.646-0.855c0-0.249-0.151-0.484-0.421-0.698 c1.181-0.713,1.966-1.675,1.966-2.711c0-4.229,5.039-6.08,5.039-13.344C35.063,16.408,29.886,11.449,23.5,11.449z M29.538,29.381 c-1.152,1.692-2.455,3.604-2.535,6.232c-0.396,0.441-1.809,1.158-3.499,1.158c-1.691,0-3.105-0.717-3.5-1.16 c-0.08-2.629-1.385-4.541-2.539-6.232c-1.287-1.886-2.502-3.667-2.502-6.854c0-4.439,3.83-8.051,8.537-8.051 c4.708,0,8.538,3.612,8.538,8.051C32.038,25.713,30.823,27.495,29.538,29.381z"}),c.createElement("path",{d:"M23.5,7.564c0.832,0,1.513-0.9,1.513-2V2c0-1.1-0.681-2-1.513-2s-1.513,0.9-1.513,2v3.564 C21.987,6.665,22.668,7.564,23.5,7.564z"}),c.createElement("path",{d:"M15.747,9.642c0.721-0.416,0.859-1.536,0.31-2.488l-1.781-3.087c-0.55-0.953-1.59-1.392-2.311-0.976 c-0.721,0.416-0.86,1.536-0.311,2.488l1.783,3.087C13.987,9.619,15.026,10.058,15.747,9.642z"}),c.createElement("path",{d:"M9.095,13.007L6.01,11.225c-0.953-0.55-2.073-0.411-2.489,0.31c-0.416,0.721,0.022,1.76,0.976,2.31l3.086,1.782 c0.953,0.55,2.073,0.411,2.488-0.31C10.486,14.596,10.048,13.557,9.095,13.007z"}),c.createElement("path",{d:"M42.504,32.295l-3.086-1.781c-0.953-0.551-2.073-0.412-2.488,0.31c-0.416,0.721,0.021,1.76,0.977,2.31l3.084,1.782 c0.953,0.55,2.073,0.411,2.489-0.31C43.896,33.884,43.458,32.845,42.504,32.295z"}),c.createElement("path",{d:"M7.994,23.07c0-0.833-0.9-1.513-2-1.513H2.43c-1.1,0-2,0.681-2,1.513c0,0.832,0.9,1.513,2,1.513h3.564 C7.094,24.583,7.994,23.902,7.994,23.07z"}),c.createElement("path",{d:"M44.57,21.557h-3.563c-1.101,0-2,0.681-2,1.513c0,0.832,0.899,1.513,2,1.513h3.563c1.101,0,2-0.681,2-1.513 C46.57,22.238,45.67,21.557,44.57,21.557z"}),c.createElement("path",{d:"M7.582,30.514l-3.086,1.781c-0.953,0.55-1.392,1.589-0.976,2.311c0.416,0.721,1.536,0.859,2.489,0.31l3.085-1.782 c0.953-0.55,1.392-1.589,0.976-2.31C9.655,30.104,8.535,29.963,7.582,30.514z"}),c.createElement("path",{d:"M39.418,15.627l3.086-1.782c0.953-0.55,1.392-1.589,0.976-2.31c-0.416-0.721-1.536-0.86-2.489-0.31l-3.085,1.782 c-0.952,0.55-1.392,1.589-0.976,2.31C37.345,16.038,38.465,16.177,39.418,15.627z"}),c.createElement("path",{d:"M35.036,3.09c-0.722-0.416-1.762,0.023-2.312,0.976l-1.781,3.087c-0.55,0.953-0.411,2.072,0.31,2.488 c0.722,0.416,1.761-0.023,2.311-0.976l1.783-3.087C35.896,4.626,35.756,3.506,35.036,3.09z"}))),V=c.createElement("g",null),$=c.createElement("g",null),q=c.createElement("g",null),K=c.createElement("g",null),X=c.createElement("g",null),_=c.createElement("g",null),G=c.createElement("g",null),Q=c.createElement("g",null),Z=c.createElement("g",null),ee=c.createElement("g",null),te=c.createElement("g",null),ne=c.createElement("g",null),ae=c.createElement("g",null),ce=c.createElement("g",null),re=c.createElement("g",null);function ie(e,t){var n=e.title,a=e.titleId,r=U(e,["title","titleId"]);return c.createElement("svg",J({id:"Capa_1",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",x:"0px",y:"0px",width:"47px",height:"47px",viewBox:"0 0 47 47",style:{enableBackground:"new 0 0 47 47"},xmlSpace:"preserve",ref:t,"aria-labelledby":a},r),n?c.createElement("title",{id:a},n):null,Y,V,$,q,K,X,_,G,Q,Z,ee,te,ne,ae,ce,re)}var le=c.forwardRef(ie);n.p;var se=function(){var e=Object(c.useState)(),t=Object(s.a)(e,2),n=t[0],r=t[1],i=Object(c.useState)(),l=Object(s.a)(i,2),o=l[0],u=l[1],h=Object(c.useState)(),j=Object(s.a)(h,2),f=j[0],m=j[1],p=Object(c.useState)(),x=Object(s.a)(p,2),O=x[0],v=x[1];return Object(a.jsxs)("div",{className:"h-100 d-flex flex-column",children:[Object(a.jsx)("div",{className:"flex-shrink-0 py-3 px-4 text-white",style:{background:"#059669"},children:Object(a.jsxs)("div",{className:"d-flex align-items-center",children:[Object(a.jsx)(le,{style:{fill:"white",height:"1.8em"},className:"mr-2"}),Object(a.jsx)("h4",{className:"mb-0",children:"FHIR DATA CENSUS"})]})}),!n&&Object(a.jsx)(H,{onFileLoaded:function(e,t){r(e),u(t);var n=d.a.chain(e).filter((function(e){return e.elementPath===e.resourceType})).value();1===n.length&&v(n[0])}}),n&&Object(a.jsxs)("div",{className:"flex-grow-1 d-flex ",style:{height:"1px"},children:[Object(a.jsx)("div",{className:"p-4 flex-shrink-0",style:{overflowY:"auto"},children:Object(a.jsx)(b,{elementsList:n,currentResourceCategory:O,onCurrentElementChange:m,onCurrentResourceCategoryChange:v})}),f&&Object(a.jsx)("div",{className:"p-4 flex-grow-1 bg-light",style:{overflowY:"auto",borderLeft:"1px solid #dadce0"},children:Object(a.jsx)(M,{currentElement:f,detailData:o})})]})]})};l.a.render(Object(a.jsx)(se,{}),document.getElementById("root"))}},[[528,1,2]]]);
//# sourceMappingURL=main.81b2fe74.chunk.js.map