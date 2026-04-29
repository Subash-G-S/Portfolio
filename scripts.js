// LOADER
(function(){
  const bar=document.getElementById('loaderBar');
  const txt=document.getElementById('loaderText');
  const loader=document.getElementById('loader');

  let pct=0;

  const iv=setInterval(()=>{
    pct+=2;
    if(pct>100)pct=100;

    bar.style.width=pct+'%';

    if(pct>=100){
      clearInterval(iv);
      loader.style.display='none';
    }
  },30);
})();

// TYPING EFFECT
const phrases=['Building systems','Scaling apps','Creating UI'];
let i=0,j=0,del=false;
const el=document.getElementById('typed');

function type(){
  const word=phrases[i];

  if(!del){
    el.textContent=word.slice(0,++j);
    if(j===word.length){del=true;setTimeout(type,1000);return;}
  }else{
    el.textContent=word.slice(0,--j);
    if(j===0){del=false;i=(i+1)%phrases.length;}
  }

  setTimeout(type,del?40:80);
}

type();