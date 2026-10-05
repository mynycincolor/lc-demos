// Presentation states only. Log In simulates eligible member access; no authentication occurs.
const accessState=new URLSearchParams(location.search).get('access');
const accessUnlocked=accessState==='unlocked';
const accessIneligible=accessState==='ineligible';
const onShow=Boolean(document.querySelector('.show-member-presale'));
const accessBox=document.querySelector('.member-presale-callout,.show-member-presale');
const stateNav=document.querySelector('.demo-review-nav');
if(stateNav){
 stateNav.setAttribute('aria-label','Demo controls');
 stateNav.innerHTML='<button class="demo-controls-toggle" type="button" aria-expanded="false" aria-controls="demo-controls-panel">Demo controls <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div id="demo-controls-panel" hidden><p>Preview state</p><div class="demo-state-links"></div><a class="demo-back-link" href="/demos.html">← Back to demos</a></div>';
 const toggle=stateNav.querySelector('button');
 const panel=stateNav.querySelector('#demo-controls-panel');
 const current=accessUnlocked?'unlocked':accessIneligible?'ineligible':'signed-out';
 for(const [value,label] of [['signed-out','Signed out'],['ineligible','Signed in, not eligible'],['unlocked','Access unlocked']]){
  const link=document.createElement('a');
  const url=new URL(location.href);url.searchParams.set('access',value);url.hash='member-access-confirmation';
  link.href=url.href;link.textContent=label;
  if(value===current)link.setAttribute('aria-current','page');
  stateNav.querySelector('.demo-state-links').append(link);
 }
 const close=()=>{panel.hidden=true;toggle.setAttribute('aria-expanded','false');};
 toggle.addEventListener('click',()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));});
 document.addEventListener('click',event=>{if(!stateNav.contains(event.target))close();});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){close();toggle.focus();}});
}
if(accessBox)accessBox.id='member-access-confirmation';
if(accessBox&&!accessUnlocked){
 const action=accessBox.querySelector('.member-action-primary');
 if(accessIneligible){
  accessBox.classList.add('access-ineligible');
  accessBox.querySelector('h2').textContent='Unlock your member presale access';
  accessBox.querySelector('p').textContent=onShow
   ? 'You’re signed in! Become a Lincoln Center Member to unlock early ticket access for this performance.'
   : 'You’re signed in! Become a Lincoln Center Member to unlock early access to Choose-What-You-Pay tickets.';
  action.textContent='Join Now';
  accessBox.querySelector('.presale-join-link')?.remove();
 }else{
  action.removeAttribute('data-placeholder');
  action.addEventListener('click',()=>{
   const next=new URL(location.href);next.searchParams.set('access','unlocked');next.hash='member-access-confirmation';location.href=next.href;
  });
 }
}
if(accessIneligible){
 document.querySelectorAll('a[href="/heidi-latsky-dance.html"]').forEach(a=>a.href='/heidi-latsky-dance.html?access=ineligible');
}

const presaleList=document.querySelector('.vs-cyp-group-shows-container');
if(presaleList)presaleList.id='presale-shows';
if(accessUnlocked&&accessBox){
 accessBox.classList.add('access-unlocked');
 accessBox.querySelector('h2').textContent=onShow?'Thank you for being a Member!':'Thank you for being a Lincoln Center Member!';
 accessBox.querySelector('p').textContent='Your early ticket access is now unlocked.';
 const actions=accessBox.querySelector('.member-presale-actions');actions.replaceChildren();
 const next=document.createElement(onShow?'button':'a');next.className='member-action member-action-primary';next.textContent=onShow?'Book Tickets':'Select a show';
 if(onShow){next.type='button';next.setAttribute('data-placeholder','');}else next.href='#presale-shows';
 actions.append(next);
 document.querySelectorAll('.presale-promo').forEach(p=>p.hidden=true);
 document.querySelectorAll('a[href="/heidi-latsky-dance.html"]').forEach(a=>a.href='/heidi-latsky-dance.html?access=unlocked');
 if(onShow){
  const chooser=document.createElement('fieldset');chooser.id='presale-performances';chooser.className='presale-performance-picker';
  chooser.innerHTML='<legend>Select a Date</legend><label><input type="radio" name="presale-performance" value="January 9, 2027 at 7:30 pm"><span>Saturday, January 9, 2027 at 7:30 pm</span></label><label><input type="radio" name="presale-performance" value="January 10, 2027 at 2:00 pm"><span>Sunday, January 10, 2027 at 2:00 pm</span></label>';
  document.querySelector('.vs-show-perf-date-item')?.closest('.scrollbox')?.replaceWith(chooser);
 }
}
if(location.hash==='#member-access-confirmation'){
 const revealAccess=()=>accessBox?.scrollIntoView({block:'start'});
 requestAnimationFrame(revealAccess);window.addEventListener('load',revealAccess,{once:true});document.fonts.ready.then(revealAccess);
}
document.querySelectorAll('.member-action,.ticket-button,.demo-dialog button,.vs-supporter-link-cont').forEach(button=>button.classList.add('slide-cta'));
