/* <l-icon name="truck" size="16"> — Lucide-backed icon custom element */
(function(){
const P=s=>s.split('-').map(w=>w?w[0].toUpperCase()+w.slice(1):w).join('');
function kidsOf(n){return n.map(([t,a,c])=>{const at=Object.entries(a||{}).map(([k,v])=>k+'="'+v+'"').join(' ');return c&&c.length?'<'+t+' '+at+'>'+kidsOf(c)+'</'+t+'>':'<'+t+' '+at+'/>';}).join('');}
class LIcon extends HTMLElement{
  static get observedAttributes(){return['name','size','stroke'];}
  connectedCallback(){this._c=true;if(!this._sr)this._sr=this.attachShadow({mode:'open'});this.draw();}
  attributeChangedCallback(){if(this._c)this.draw();}
  draw(){
    const name=this.getAttribute('name');if(!name)return;
    const size=this.getAttribute('size')||16,sw=this.getAttribute('stroke')||2;
    const L=window.lucide;
    if(!L||!L.icons){this._n=(this._n||0)+1;if(this._n<80)setTimeout(()=>this.draw(),120);return;}
    const ic=L.icons[P(name)]||L.icons[name];if(!ic)return;
    this.style.display='inline-flex';this.style.lineHeight='0';this.style.flex='none';
    if(typeof ic.toSvg==='function'){this._sr.innerHTML=ic.toSvg({width:size,height:size,'stroke-width':sw});return;}
    let node=Array.isArray(ic)?ic:(ic.iconNode||null);if(!node)return;
    if(node.length&&node[0]==='svg')node=node[2]||[]; // lucide UMD triple: ["svg",{attrs},[children]]
    this._sr.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round">'+kidsOf(node)+'</svg>';
  }
}
if(!customElements.get('l-icon'))customElements.define('l-icon',LIcon);
})();
