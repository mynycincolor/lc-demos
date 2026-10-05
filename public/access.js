// Presentation states only. Log In simulates eligible member access; no authentication occurs.
const accessState=new URLSearchParams(location.search).get('access');
const accessUnlocked=accessState==='unlocked';
const accessIneligible=accessState==='ineligible';
const onShow=Boolean(document.querySelector('.show-member-presale'));
const accessBox=document.querySelector('.member-presale-callout,.show-member-presale');
const stateNav=document.querySelector('.demo-review-nav');
if(stateNav){
 const label=stateNav.querySelector('span');if(label)label.textContent=accessUnlocked?'Member presale · Access unlocked':accessIneligible?'Member presale · Signed in, not eligible':'Member presale · Signed-out preview';
 const toggle=document.createElement('a');toggle.href=location.pathname+'?access='+(accessUnlocked?'signed-out':'unlocked')+'#member-access-confirmation';toggle.textContent=accessUnlocked?'Preview signed-out state':'Preview unlocked state';stateNav.append(toggle);
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
