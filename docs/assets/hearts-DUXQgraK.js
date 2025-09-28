import"./theme-BWL1am71.js";import{$ as o,c}from"./common-BlY3ihj5.js";const B=(function(){let h,p,g,u,y,a=4,l=26;const $=()=>{c.init(),h=o("#newScore"),p=o("#board"),g=o("#undoBtn"),u=o("#numPlayers").val(a),y=o("#numPoints").val(l),v()},v=()=>{setInterval(k,100),h.on("click",b).on("change",m).on("keyup",I),g.on("click",S),o("#calculateBtn").on("click",m),u.on("change",()=>a=+u.val()||a),y.on("change",()=>l=+y.val()||l)},b=t=>{const r=+o(t.target).closest("[data-player]").data("player");r&&o('td[data-player="'+r+'"] input').trigger("focus")},I=t=>{const r=+o(t.target).closest("[data-player]").data("player");r&&t.key==="Enter"&&o(`td[data-player="${r+1}"] input`).trigger("focus")},P=()=>{let t=0,r=0;return o("td[data-player] input").each(function(){const e=o(this),s=+e.val();if(r+=s,t!==!1&&s!==0){if(s>0&&t){t=!1;return}t=+e.closest("td").data("player")}}),[r,t]},m=t=>{const[r,i]=P(),e=c.getScore();if(l=e.totalPointsPerGame=e.totalPointsPerGame||l,r<l)return;if(r>l){const n=+o(t.target).closest("[data-player]").data("player");n&&o(`td[data-player="${n}"]`).find("div").addClass("input--error").find("input").trigger("focus");return}o("td[data-player] input").each(function(){const n=+o(this).closest("td").data("player");e[`score${n}`]=e[`score${n}`]||f();let d=!!e[`score${n}`].length&&e[`score${n}`].pop();d===!1?d=0:e[`score${n}`].push(d),i?i!==n&&(d+=l):d+=+o(this).val(),e[`score${n}`].push(d)}),c.save(e)},S=()=>{const t=c.getScore();if(!(t.score1||[]).length){window.location.reload();return}a=t.playerNumber=t.playerNumber||a;for(let r=1;r<=a;r++)t[`score${r}`].pop();c.save(t)},k=()=>{if(c.hasChanges()){p.html(w());var t=p.find(".scroll");t.scrollTop(t.prop("scrollHeight"))}},w=()=>{const t=c.getScore();a=t.playerNumber=t.playerNumber||a;let r="<thead><tr>";for(let e=1;e<=a;e++)r+=`
                <td>
                    <div class="player" data-renamable="${e}">
                        ${t[`player${e}`]||["I","II","III","IV","V"][e-1]}
                    </div>
                </td>`;r+='</tr></thead><tbody class="scroll">';const i=(t.score1||f()).length;for(let e=0;e<i;e++){r+="<tr>";for(let s=1;s<=a;s++)r+=`
                    <td data-player="${s}">
                        ${N((t[`score${s}`]||f())[e],e<i-1)}
                    </td>`;r+="</tr>"}r+="<tr>";for(let e=1;e<=a;e++)r+=`
                <td data-player="${e}">
                    <div class="input input--number points">
                        <input type="number" placeholder="${t[`player${e}`]||["I","II","III","IV","V"][e-1]}"/>
                    </div>
                 </td>`;return r+="</tr>",r+="</tbody>",r},N=(t,r)=>`<div class="points ${r&&"points--crossed"||""}">&nbsp;${t}&nbsp;</div>`,f=()=>[];return{init:$}})();o(()=>{B.init()});
