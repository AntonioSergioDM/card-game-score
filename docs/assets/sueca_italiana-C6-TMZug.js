import"./theme-xnCyEx_4.js";import{$ as i,c as o}from"./common-92_0j6lW.js";const S=(function(){let l,d,n,v=[];const u=()=>{o.init(),l=i("#newScore"),d=i("#board"),n=i("#undoBtn"),p()},p=()=>{setInterval(g,100),l.on("click",f),n.on("click",h),i("#calculateBtn").on("click",$)},$=()=>{const t=o.getScore();for(let e=1;e<=5;e++)t[`score${e}`]=t[`score${e}`]||a(),t[`score${e}`].push(0);o.save(t)},h=()=>{const t=v.pop();if(t===void 0){window.location.reload();return}const e=o.getScore();e[`score${t}`].push(e[`score${t}`].pop()-1),o.save(e)},f=t=>{const e=+i(t.target).closest("[data-player]").data("player");if(!e)return;const r=o.getScore();r[`score${e}`]=r[`score${e}`]||a(),r[`score${e}`].push(r[`score${e}`].pop()+1),v.push(e),o.save(r)},g=()=>{if(o.hasChanges()){d.html(b());var t=d.find(".scroll");t.scrollTop(t.prop("scrollHeight"))}},b=()=>{const t=o.getScore();let e="<thead><tr>";for(let s=1;s<=5;s++)e+=`<td class="relative">
                        <div class="player" data-renamable="${s}">
                            ${t[`player${s}`]||["I","II","III","IV","V"][s-1]}
                        </div>`,(t[`score${s}`]||[]).length&&(e+=`<div class="absolute absolute--endish">
                            ${t[`score${s}`].reduce((c,I)=>c+I,0)}
                        </div>`),e+="</td>";e+='</tr></thead><tbody class="scroll">';const r=(t.score1||a()).length;for(let s=0;s<r;s++){e+="<tr>";for(let c=1;c<=5;c++)e+=`<td class="relative" data-player="${c}">
                            ${m((t[`score${c}`]||a())[s])}
                            <div class="absolute absolute--endish text-xs">
                               ${t[`score${c}`]&&t[`score${c}`][s]||0}
                            </div>
                         </td>`;e+="</tr>"}return e+="</tbody>",e},m=t=>{const e=Math.floor(t/5),r=t%5;return'<div class="points">'+y().repeat(e)+`
<div class="unit">
    ${'<div class="divider"></div>'.repeat(r)}
</div></div>`},y=()=>`
<div class="unit">
    <div class="divider"></div>
    <div class="divider"></div>
    <div class="divider"></div>
    <div class="divider"></div>
    <div class="divider divider--diagonal"></div>
</div>`,a=()=>[0];return{init:u}})();i(()=>{S.init()});
