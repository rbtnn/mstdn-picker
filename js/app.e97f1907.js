(function(e){function t(t){for(var a,s,o=t[0],d=t[1],l=t[2],u=0,f=[];u<o.length;u++)s=o[u],Object.prototype.hasOwnProperty.call(r,s)&&r[s]&&f.push(r[s][0]),r[s]=0;for(a in d)Object.prototype.hasOwnProperty.call(d,a)&&(e[a]=d[a]);c&&c(t);while(f.length)f.shift()();return i.push.apply(i,l||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],a=!0,o=1;o<n.length;o++){var d=n[o];0!==r[d]&&(a=!1)}a&&(i.splice(t--,1),e=s(s.s=n[0]))}return e}var a={},r={app:0},i=[];function s(t){if(a[t])return a[t].exports;var n=a[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,s),n.l=!0,n.exports}s.m=e,s.c=a,s.d=function(e,t,n){s.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},s.t=function(e,t){if(1&t&&(e=s(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(s.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)s.d(n,a,function(t){return e[t]}.bind(null,a));return n},s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,"a",t),t},s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},s.p="";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],d=o.push.bind(o);o.push=t,o=o.slice();for(var l=0;l<o.length;l++)t(o[l]);var c=d;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("1d50")},"1d50":function(e,t,n){"use strict";n.r(t);n("7b9d"),n("a8f9"),n("af23"),n("d1e9");var a=n("b9b7"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"default",attrs:{id:"mstdnpicker-wrapper"}},[n("mstdnpicker-header"),n("mstdnpicker-dialog"),n("mstdnpicker-content")],1)},i=[],s=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},o=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"mstdnpicker-header"}},[n("span",{attrs:{id:"description"}},[e._v("version "),n("span",{attrs:{id:"js_version"}},[e._v("0")]),e._v(" / maintained by "),n("a",{attrs:{href:"https://github.com/rbtnn"}},[e._v("@rbtnn")])]),n("a",{attrs:{href:"index.html"}},[n("img",{attrs:{id:"logo",src:"logo-mstdn-picker.svg"}})]),n("span",{attrs:{id:"search_icon"}},[n("input",{attrs:{id:"filter",type:"text",placeholder:"検索",value:""}})]),n("div",{staticClass:"information"},[n("a",{attrs:{id:"download_json"}},[n("span",{attrs:{id:"toot_count"}})])])])}],d={name:"mstdnpicker-header"},l=d,c=n("b51d"),u=Object(c["a"])(l,s,o,!1,null,"129ae90a",null),f=u.exports,p=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},m=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"mstdnpicker-dialog"}},[n("div",{staticClass:"dialog_form"},[n("h2",[e._v("指定区間の取得")]),n("label",[e._v("1) 始まりのトゥートURLを選択してください。")]),n("br"),n("input",{attrs:{type:"text",id:"since_url",min:"1",placeholder:"",value:""}}),n("br"),n("br"),n("label",[e._v("2) 終わりのトゥートURLを選択してください。")]),n("br"),n("input",{attrs:{type:"text",id:"max_url",min:"1",placeholder:"",value:""}}),n("div",{staticClass:"button",attrs:{id:"get_status"}},[e._v("トゥートを取得する")])]),n("div",{staticClass:"json_form"},[n("h2",[e._v("jsonファイルの読み込み")]),n("label",[e._v("1) jsonファイルを選択してください。")]),n("br"),n("input",{attrs:{type:"file",id:"files"}}),n("div",{staticClass:"button",attrs:{id:"load_json"}},[e._v("トゥートを読み込む")])])])}],v={name:"mstdnpicker-dialog"},h=v,g=Object(c["a"])(h,p,m,!1,null,"7d8237de",null),_=g.exports,y=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},b=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"mstdnpicker-content"}},[n("div",{attrs:{id:"loading"}},[n("img",{attrs:{id:"loading_img",src:"loading.gif"}}),n("span",{attrs:{id:"loading_msg"}},[e._v("トゥート取得中")])]),n("div",{staticClass:"status-list",attrs:{id:"status_list"}})])}],w={name:"mstdnpicker-content"},L=w,x=Object(c["a"])(L,y,b,!1,null,"a512829e",null),k=x.exports,E=(n("2f6e"),n("751a"),n("aba7"),n("5273"),n("7a97"),n("cf35"),n("17dc"),n("2557"),n("7ba2"),n("0508"),n("d49c"),n("099b"),{main:function(){var e=document.getElementById("mstdn_picker"),t=document.getElementById("mstdnpicker-wrapper"),n=document.getElementById("max_url"),a=document.getElementById("since_url"),r=document.getElementById("get_status"),i=document.getElementById("status_list"),s=document.getElementById("filter"),o=document.getElementById("mstdnpicker-dialog"),d=document.getElementById("mstdnpicker-content"),l=document.getElementById("toot_count"),c=document.getElementById("download_json"),u=document.getElementById("load_json"),f=document.getElementById("files"),p=document.getElementById("js_version"),m=5e3,v=36;p.innerText="143";var h=function(e,t){var n=new XMLHttpRequest;n.onreadystatechange=function(){if(4==this.readyState){var e="",n="",a=this.getResponseHeader("Link");if(a){var r=a.split(",");for(var i in r)r[i].match(/; rel="next"$/)&&(n=r[i].substring(r[i].indexOf("<")+1,r[i].indexOf(">"))),r[i].match(/; rel="prev"$/)&&(e=r[i].substring(r[i].indexOf("<")+1,r[i].indexOf(">")))}t(200==this.status,this.response,e,n)}},n.open("GET",e,!0),n.responseType="json",n.send(null)},g=function(e,t,n){h("https://"+e+"/api/v1/statuses/"+t,n)},_=function(e){var t=document.createElement("div");return t.style.backgroundImage="url("+e.account.avatar+")",t.classList.add("status-avatar"),t},y=function(e,t){for(var n in t){var a=":"+t[n].shortcode+":",r=new RegExp(a,"g"),i='<img draggable="false" class="emojione" alt="'+a+'" title="'+a+'" src="'+t[n].url+'">';e=e.replace(r,i)}return e},b=function(e){var t=document.createElement("div"),n=_(e),a=document.createElement("div"),r=document.createElement("div");for(var i in r.innerHTML=e.content,a.innerHTML='<a target="_blank" href="'+e.url+'">'+(0<e.account.display_name.length?y(e.account.display_name,e.account.emojis):"@"+e.account.username)+"</a>",a.innerHTML+=" ",a.innerHTML+='<span class="desc">('+new Date(e.created_at)+")</span>",a.innerHTML+=y(e.content,e.emojis),a.innerHTML+="<br/>",e.media_attachments){var s=e.media_attachments[i];a.innerHTML+='<img src="'+s.preview_url+'" width="225px" />'}return t.dataset.json=JSON.stringify(e),t.dataset.created_at=new Date(e.created_at).getTime(),t.dataset.text4filtering=e.account.display_name+e.account.username+r.innerText,t.classList.add("status-content"),t.appendChild(n),t.appendChild(a),t},w=function e(t,n,a,r,s,o){var d="https://"+t+"/api/v1/timelines/public?local=true&max_id="+n;h(d,(function(n,d,l,c){if(r&&""!=l){var u=document.createElement("div");u.innerHTML='<a href="?query='+escape(l)+'">newer</a>',i.appendChild(u)}if(n){var f=!0,p="";for(var m in d){if(s--,s<0||d[m].id<a){f=!1;break}d[m].id==a&&(f=!1),p=d[m].id,i.insertBefore(b(d[m]),i.firstChild),E()}if(d||(f=!1),f)e(t,p,a,!1,s,o);else{if(""!=c){var v=document.createElement("div");v.innerHTML='<a href="?query='+escape(c)+'">older</a>',i.insertBefore(v,i.firstChild)}o()}}}))},L=function(n,a,r){var s=!1;t.classList.add("loading");while(i.firstChild)i.removeChild(i.firstChild);s||(a==r?g(n,a,(function(s,o){if(s&&i.insertBefore(b(o),i.firstChild),t.classList.remove("loading"),s&&null!=localStorage){var d={key:n+"-"+a+"-"+r,value:i.innerHTML};localStorage[e]=JSON.stringify(d),window.console.log("saved "+d.key)}})):w(n,a,r,!0,m,(function(){if(t.classList.remove("loading"),null!=localStorage){var s={key:n+"-"+a+"-"+r,value:i.innerHTML};localStorage[e]=JSON.stringify(s),window.console.log("saved "+s.key)}})))},x=function(e){var t=new RegExp("^https://([^/]+)/@([^/]+)/(\\d+)$"),n=t.exec(e),a=new RegExp("^https://([^/]+)/users/([^/]+)/statuses/(\\d+)$"),r=a.exec(e);return null!=n?{instance:n[1],user_id:n[2],toot_id:n[3]}:null!=r?{instance:r[1],user_id:r[2],toot_id:r[3]}:null},k=function(e,t){var n=!1,a=null!=e&&e.hasOwnProperty("created_at")?new Date(e.created_at).getTime():-1,r=null!=t&&t.hasOwnProperty("created_at")?new Date(t.created_at).getTime():-1;if(-1!=a&&-1!=r){var i=r-a,s=Math.floor(i/1e3%60),o=Math.floor((i/1e3-s)/60%60),d=Math.floor((i/1e3-60*o-s)/60/60),l=60*d*60+60*o+s;n=0<=l&&l<=60*v*60}return n},E=function(){var e=i.querySelectorAll(".status-content");if(0<s.value.length){var t=i.querySelectorAll(".status-content:not(.status-hidden)");l.innerText=t.length+"/"+e.length+"トゥート"}else l.innerText=e.length+" トゥート"},j=function(){var e=i.querySelectorAll(".status-content");for(var t in e)void 0!=e[t].dataset&&(-1!=e[t].dataset.text4filtering.indexOf(s.value)?e[t].classList.remove("status-hidden"):e[t].classList.add("status-hidden"));E()};r.addEventListener("click",(function(){var e=document.location.href;if(-1==e.indexOf("?")){var t=x(a.value);if(null==t)return void window.alert("始まりのトゥートURLが不正もしくは未入力です。");var r=x(n.value);if(null==r)return void window.alert("終わりのトゥートURLが不正もしくは未入力です。");if(t.instance!=r.instance)return void window.alert("始まりのトゥートと終わりのトゥートのインスタンスが異なります。");g(t.instance,t.toot_id,(function(n,a){g(r.instance,r.toot_id,(function(i,s){n?i?k(a,s)?document.location.href=e+"?instance="+t.instance+"&since_id="+t.toot_id+"&max_id="+r.toot_id:window.alert("始まりのトゥートより終わりのトゥートが新しいか、"+v+"時間以上離れています。"):window.alert("終わりのトゥートが取得できません。"):window.alert("始まりのトゥートが取得できません。")}))}))}})),s.addEventListener("keyup",j),c.addEventListener("click",(function(){var e=[],t=i.querySelectorAll(".status-content");window.console.log(t.length);for(var n=t.length-1;0<=n;n--)void 0!=t[n].dataset&&(t[n].classList.contains("status-hidden")||e.push(JSON.parse(t[n].dataset.json)));var a=new Blob([JSON.stringify(e)],{type:"application/json"});c.href=window.URL.createObjectURL(a),c.type="application/json",c.download="mstdnpicker.json"})),u.addEventListener("click",(function(){if(1==f.files.length){var e=f.files[0];if(e.type.match("application/json")){var n=new FileReader;n.readAsText(e),n.onload=function(e){I&&(o.classList.add("hide_dialog"),d.classList.add("hide_dialog")),t.classList.remove("default");for(var n=JSON.parse(e.target.result),a=0;a<n.length;a++)i.insertBefore(b(n[a]),i.firstChild),E()}}else window.alert("jsonファイルではありません。jsonファイルを選択してください。")}else window.alert("jsonファイルを1つ選択してください。")}));var O="",T="",B=-1,M=-1,C=document.location.href,S=C.indexOf("?"),I=-1!=S;if(I){var H=C.substr(S+1).split("&");for(var R in H){var $=H[R].split("=");if(2==$.length)switch($[0]){case"instance":T=$[1];break;case"since_id":B=$[1];break;case"max_id":M=$[1];break;case"filter":s.value=decodeURI($[1]);break;case"query":O=unescape($[1]);break}}}t.classList.add("default"),""!=T&&-1!=B&&-1!=M?g(T,B,(function(e,n){g(T,M,(function(a,r){e&&a&&k(n,r)&&(I&&(o.classList.add("hide_dialog"),d.classList.add("hide_dialog")),t.classList.remove("default"),L(T,M,B),j())}))})):""!=O&&h(O,(function(e,n,a,r){if(e){if(I&&(o.classList.add("hide_dialog"),d.classList.add("hide_dialog")),t.classList.remove("default"),""!=a){var s=document.createElement("div");s.innerHTML='<a href="?query='+escape(a)+'">newer</a>',i.appendChild(s)}for(var l in n)i.insertBefore(b(n[l]),i.firstChild);if(""!=r){var c=document.createElement("div");c.innerHTML='<a href="?query='+escape(r)+'">older</a>',i.insertBefore(c,i.firstChild)}}}))}}),j={name:"App",components:{"mstdnpicker-header":f,"mstdnpicker-dialog":_,"mstdnpicker-content":k},mounted:function(){E.main()}},O=j,T=Object(c["a"])(O,r,i,!1,null,"380b8b0f",null),B=T.exports;new a["a"]({render:function(e){return e(B)}}).$mount("#App")}});
//# sourceMappingURL=app.e97f1907.js.map