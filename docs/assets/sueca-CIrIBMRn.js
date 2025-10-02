import"./theme-BWL1am71.js";import{$ as o,c as r}from"./common-BlY3ihj5.js";const N=(function(){let p,h,_,m=!1,$=!1,S=!1,u=10;const g=20;let f=[];const B=()=>{r.init(),p=o("#newScore"),h=o("#inputHolder"),_=o("#undoBtn"),H()},H=()=>{setInterval(w,100),p.on("click",k),h.on("click",k),_.on("click",C),o("#restartBtn").on("click",x),o("#startNormalScore").on("click",()=>T("normal")),o("#startUnlimitedScore").on("click",I)},I=()=>{p.html(`
            <h2>How many points per game?</h2>
            <div class="input input--number player">
                <input class="" id="unlimitedQty" type="number" value="${u}"/>
            </div>
            
            <button class="button button--primary" id="startGame">Start</button>
        `);const e=o("#unlimitedQty");e.trigger("focus").trigger("select"),o("#startGame").on("click",()=>T("unlimited",e.val()))},T=(e,t)=>{const l={type:e};e==="unlimited"&&(l.unlimitedQty=+t||u),r.save(l)},x=()=>{const e=r.getScore();e.score1=v(e.type),e.score2=v(e.type),r.save(e)},C=()=>{let e=f.pop();if(e===void 0)return;[lastPointTeam,lastPointPosition]=e;const t=r.getScore();t["score"+lastPointTeam][lastPointPosition]=!1;do{if(e=f.pop(),e===void 0)break;[lastPointTeam,lastPointPosition]=e}while(t["score"+lastPointTeam][lastPointPosition]<=0);f.push([lastPointTeam,lastPointPosition]),r.save(t)},k=e=>{const t=+o(e.target).closest("[data-player]").data("player");if(!t)return;const l=t===1?2:1,i=r.getScore();i.score1=i.score1||v(i.type),i.score2=i.score2||v(i.type);const s=M(i["score"+t],i["score"+l],i.type);i["score"+l][s]=i["score"+l][s]||!1;const a=i.type!=="unlimited"?s%4===0:s%i.unlimitedQty===0;if(m===t){a?(console.log(i["score"+t]),i["score"+t][s-1]++):(i["score"+t][s]=i["score"+t][s-1]+1,i["score"+t][s-1]=!1);const n=i["score"+t][s];n===3?S=setTimeout(()=>G(t,s),1e3):n>=4&&(clearTimeout(S),m=!1)}else i["score"+t][s]=1,clearTimeout($),$=setTimeout(()=>m=!1,1e3),m=t;f.push([t,s]),r.save(i)},G=(e,t)=>{const l=r.getScore();l["score"+e][t-1]=l["score"+e][t]-1,l["score"+e][t]=1,r.save(l),w()},M=(e,t,l)=>{let i=e.findLastIndex(n=>!!n);if(i===void 0&&(i=-1),l==="unlimited")return i+1;let s=t.findLastIndex(n=>!!n);if(s===void 0&&(s=-1),i>=s)return i+1;const a=s%4;return a===3?s+1:s-i<=a?i+1:s-a},w=()=>{if(!r.hasChanges())return;const e=O();e&&(p.html(e),h.fadeIn())},O=()=>{let e="";const t=r.getScore();if(!t.type)return!1;t.type==="unlimited"&&(u=+t.unlimitedQty);const l=t.score1||v(t.type),i=t.score2||v(t.type);let s=0;for(;s<l.length;)e+=`
                <div class="board">
                    <div class="players">
                        <div class="player" data-renamable="1">${t.player1||"N"}</div>
                        <div class="divider divider--horizontal"></div>
                        <div class="player" data-renamable="2">${t.player2||"V"}</div>
                    </div>
                    <div class="divider"></div>
                    ${E(l.slice(s,s+g),i.slice(s,s+g),t.type)}
                </div>`,s+=g;return e},y=(e,t,l)=>`
            <div class="unit">
                <div class="point" data-player="1"><div class="${L(e)}">${e&&l&&P("up")||""}</div></div>
                <div class="divider" data-player="1"></div>
                <div class="divider divider--horizontal"></div>
                <div class="divider" data-player="2"></div>
                <div class="point" data-player="2"><div class="${L(t)}">${t&&l&&P("down")||""}</div></div>
            </div>`,b=()=>'<div class="unit"><div class="divider divider--horizontal"></div></div>',z=(e,t,l)=>`
            <div class="unit">
                <div class="divider divider--horizontal"></div>
                <div class="win win--${e}" data-player="${e==="up"?1:2}">
                    ${t&&P(e)||""}
                </div>
                ${l&&A(e==="up"?"down":"up")||""}
            </div>`,Q=()=>`
            <div class="unit">
                <span class="game-separator">\\/</span>
            <div class="divider divider--horizontal"></div>
                <span class="game-separator">/\\</span>
            </div>`,P=e=>`<div class="bandeira bandeira--${e} bandeira__pole">
                    <div class="bandeira__flag wave"></div>
                </div>`,A=e=>`<div class="pente pente--${e}" data-player="${e==="up"?1:2}">
                    ${'<div class="divider"></div>'.repeat(10)}
                </div>
                `,E=(e,t,l)=>{let i=b(),s=0,a=0;for(let n=0;n<e.length;n++)l==="unlimited"?(s+=e[n],a+=t[n],s>=u||a>=u?(e.slice(n-3,n+1).reduce((d,c)=>d+c,0)>4||t.slice(n-3,n+1).reduce((d,c)=>d+c,0)>4?i+=y(e[n]&&-1,t[n]&&-1,!0):i+=y(e[n],t[n]),s=a=0,i+=Q()):i+=y(e[n],t[n])):(n+1)%4===0?(e[n]?(s++,i+=z("up",e[n]===4,t.slice(n-3,n+1).reduce((d,c)=>d+c,0)===0)):t[n]?(a++,i+=z("down",t[n]===4,e.slice(n-3,n+1).reduce((d,c)=>d+c,0)===0)):i+=b(),(s===2||a===2)&&(s=a=0,i+=Q()+b())):i+=y(e[n],t[n]);return i+=b(),i},L=e=>{switch(+e){case 1:return"point point--active";case 2:return"point__multiple point__multiple--double";case 4:return"point__multiple point__multiple--tetra";default:return""}},v=e=>new Array(e==="unlimited"?u:8).fill(!1);return{init:B}})();o(()=>{N.init()});
