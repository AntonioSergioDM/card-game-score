import"./theme-D_5wOjCX.js";import{$ as o,c as r}from"./common-CDYXJDN2.js";const E=(function(){let u,y,_,v=!1,S=!1,T=!1,d=10;const b=20;let p=[];const B=()=>{r.init(),u=o("#newScore"),y=o("#inputHolder"),_=o("#undoBtn"),H()},H=()=>{setInterval(w,100),u.on("click",k),y.on("click",k),_.on("click",C),o("#restartBtn").on("click",x),o("#startNormalScore").on("click",()=>$("normal")),o("#startUnlimitedScore").on("click",I)},I=()=>{u.html(`
            <h2>How many points per game?</h2>
            <div class="input input--number player">
                <input class="" id="unlimitedQty" type="number" value="${d}"/>
            </div>
            
            <button class="button button--primary" id="startGame">Start</button>
        `);const t=o("#unlimitedQty");t.trigger("focus").trigger("select"),o("#startGame").on("click",()=>$("unlimited",t.val()))},$=(t,e)=>{const l={type:t};t==="unlimited"&&(l.unlimitedQty=+e||d),r.save(l)},x=()=>{const t=r.getScore();t.score1=c(t.type),t.score2=c(t.type),r.save(t)},C=()=>{let t=p.pop();if(t===void 0)return;[lastPointTeam,lastPointPosition]=t;const e=r.getScore();e["score"+lastPointTeam][lastPointPosition]=!1;do{if(t=p.pop(),t===void 0)break;[lastPointTeam,lastPointPosition]=t}while(e["score"+lastPointTeam][lastPointPosition]<=0);p.push([lastPointTeam,lastPointPosition]),r.save(e)},k=t=>{const e=+o(t.target).closest("[data-player]").data("player");if(!e)return;const l=e===1?2:1,i=r.getScore();i.score1=i.score1||c(i.type),i.score2=i.score2||c(i.type);const s=M(i["score"+e],i["score"+l],i.type);i["score"+l][s]=i["score"+l][s]||!1;const a=i.type!=="unlimited"?s%4===0:s%i.unlimitedQty===0;if(v===e){a?(console.log(i["score"+e]),i["score"+e][s-1]++):(i["score"+e][s]=i["score"+e][s-1]+1,i["score"+e][s-1]=!1);const n=i["score"+e][s];n===3?T=setTimeout(()=>G(e,s),1e3):n>=4&&(clearTimeout(T),v=!1)}else i["score"+e][s]=1,clearTimeout(S),S=setTimeout(()=>v=!1,1e3),v=e;p.push([e,s]),r.save(i)},G=(t,e)=>{const l=r.getScore();l["score"+t][e-1]=l["score"+t][e]-1,l["score"+t][e]=1,r.save(l),w()},M=(t,e,l)=>{let i=t.findLastIndex(n=>!!n);if(i===void 0&&(i=-1),l==="unlimited")return i+1;let s=e.findLastIndex(n=>!!n);if(s===void 0&&(s=-1),i>=s)return i+1;const a=s%4;return a===3?s+1:s-i<=a?i+1:s-a},w=()=>{if(!r.hasChanges())return;const t=O();t&&(u.html(t),y.fadeIn())},O=()=>{let t="";const e=r.getScore();if(!e.type)return!1;e.type==="unlimited"&&(d=+e.unlimitedQty);const l=e.score1||c(e.type),i=e.score2||c(e.type);let s=0;for(;s<l.length;)t+=`
                <div class="board">
                    <div class="players">
                        <div class="player" data-renamable="1">${e.player1||"N"}</div>
                        <div class="divider divider--horizontal"></div>
                        <div class="player" data-renamable="2">${e.player2||"V"}</div>
                    </div>
                    <div class="divider"></div>
                    ${A(l.slice(s,s+b),i.slice(s,s+b),e.type)}
                </div>`,s+=b;return t},m=(t,e,l)=>`
            <div class="unit">
                <div class="point" data-player="1"><div class="${L(t)}">${t&&l&&h("up")||""}</div></div>
                <div class="divider" data-player="1"></div>
                <div class="divider divider--horizontal"></div>
                <div class="divider" data-player="2"></div>
                <div class="point" data-player="2"><div class="${L(e)}">${e&&l&&h("down")||""}</div></div>
            </div>`,f=()=>'<div class="unit"><div class="divider divider--horizontal"></div></div>',z=(t,e)=>`
            <div class="unit">
                <div class="divider divider--horizontal"></div>
                <div class="win win--${t}" data-player="${t==="up"?1:2}">
                    ${e&&h(t)||""}
                </div>
            </div>`,Q=()=>`
            <div class="unit">
                <span class="game-separator">\\/</span>
            <div class="divider divider--horizontal"></div>
                <span class="game-separator">/\\</span>
            </div>`,h=t=>`<div class="bandeira bandeira--${t} bandeira__pole">
                    <div class="bandeira__flag wave"></div>
                </div>`,A=(t,e,l)=>{let i=f(),s=0,a=0;for(let n=0;n<t.length;n++)l==="unlimited"?(s+=t[n],a+=e[n],s>=d||a>=d?(t.slice(n-3,n+1).reduce((g,P)=>g+P,0)>4||e.slice(n-3,n+1).reduce((g,P)=>g+P,0)>4?i+=m(t[n]&&-1,e[n]&&-1,!0):i+=m(t[n],e[n]),s=a=0,i+=Q()):i+=m(t[n],e[n])):(n+1)%4===0?(t[n]?(s++,i+=z("up",t[n]===4)):e[n]?(a++,i+=z("down",e[n]===4)):i+=f(),(s===2||a===2)&&(s=a=0,i+=Q()+f())):i+=m(t[n],e[n]);return i+=f(),i},L=t=>{switch(+t){case 1:return"point point--active";case 2:return"point__multiple point__multiple--double";case 4:return"point__multiple point__multiple--tetra";default:return""}},c=t=>new Array(t==="unlimited"?d:8).fill(!1);return{init:B}})();o(()=>{E.init()});
