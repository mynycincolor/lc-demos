// Prototype-only access states. No credentials, account requests, or real code validation.
const accessParams=new URLSearchParams(location.search);
const accessUnlocked=accessParams.get('access')==='unlocked';
const onShow=Boolean(document.querySelector('.show-member-presale'));
const accessBox=document.querySelector('.member-presale-callout,.show-member-presale,.series-presale-callout');
const accessStateURL=(state,method)=>{
 const url=new URL(location.href);url.searchParams.set('access',state);
 if(method)url.searchParams.set('via',method);else url.searchParams.delete('via');
 url.hash=state==='unlocked'?'member-access-confirmation':'';
 return url.pathname+url.search+url.hash;
};
const stateNav=document.querySelector('.demo-review-nav');
if(stateNav){
 const label=stateNav.querySelector('span');if(label)label.textContent=accessUnlocked?'Member presale · Access unlocked':'Member presale · Signed-out preview';
 const toggle=document.createElement('a');toggle.href=accessStateURL(accessUnlocked?'signed-out':'unlocked');toggle.textContent=accessUnlocked?'Preview signed-out state':'Preview unlocked state';stateNav.append(toggle);
}
const accessFlow=document.createElement('dialog');accessFlow.className='member-access-dialog access-flow-dialog';
accessFlow.setAttribute('aria-labelledby','access-flow-title');
accessFlow.innerHTML='<button class="member-dialog-close" aria-label="Close access preview" type="button">×</button><p class="member-dialog-eyebrow">Demo preview</p><h2 id="access-flow-title"></h2><p id="access-flow-copy"></p><form><label for="demo-promo-code">Promo code</label><input id="demo-promo-code" autocomplete="off" required aria-describedby="promo-demo-hint"><p id="promo-demo-hint">Use DEMO to preview unlocked access.</p><p class="promo-error" role="alert"></p><button class="access-confirm" type="submit">Apply code</button></form><button class="access-confirm" data-confirm-access type="button"></button>';
document.body.append(accessFlow);
let accessMethod='login';
accessFlow.querySelector('.member-dialog-close').addEventListener('click',()=>accessFlow.close());
function openAccess(method){
 accessMethod=method;document.querySelector('#member-access-dialog[open]')?.close();
 const promo=method==='promo';
 accessFlow.querySelector('#access-flow-title').textContent=promo?'Enter your promo code':method==='join'?'Preview joining':'Preview logging in';
 accessFlow.querySelector('#access-flow-copy').textContent=promo?'Enter the demo code below to preview ticket access.':'This prototype skips account setup and payment. Continue to see the confirmation after '+(method==='join'?'joining.':'logging in.');
 accessFlow.querySelector('form').hidden=!promo;
 const confirm=accessFlow.querySelector('[data-confirm-access]');confirm.hidden=promo;confirm.textContent=method==='join'?'Preview completed membership':'Preview successful login';
 accessFlow.querySelector('.promo-error').textContent='';accessFlow.showModal();
}
document.querySelectorAll('[data-access-method]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();openAccess(link.dataset.accessMethod);}));
accessFlow.querySelector('[data-confirm-access]').addEventListener('click',()=>location.assign(accessStateURL('unlocked',accessMethod)));
accessFlow.querySelector('form').addEventListener('submit',event=>{
 event.preventDefault();if(accessFlow.querySelector('input').value.trim().toUpperCase()!=='DEMO'){accessFlow.querySelector('.promo-error').textContent='For this demo, please use the code DEMO.';return;}
 location.assign(accessStateURL('unlocked','promo'));
});
if(accessParams.get('access')==='promo')openAccess('promo');
if(accessUnlocked&&accessBox){
 accessBox.id='member-access-confirmation';accessBox.classList.add('access-unlocked');
 const title=accessBox.querySelector('h2');title.textContent='Your ticket access is unlocked.';
 const copy=accessBox.querySelector('p');copy.textContent=onShow?'You’re ready to reserve presale tickets. Select a performance to continue.':'You’re ready to reserve presale tickets. Select a show to continue.';
 const actions=accessBox.querySelector('.member-presale-actions');actions.replaceChildren();
 const next=document.createElement('a');next.className='member-action member-action-primary';next.textContent=onShow?'Select a performance':'Select a show';
 next.href=onShow?'#presale-performances':document.querySelector('#cyp-wrapper')?'#presale-shows':'/?access=unlocked#presale-shows';actions.append(next);
 document.querySelectorAll('.presale-promo').forEach(p=>p.hidden=true);
 const list=document.querySelector('.vs-cyp-group-shows-container');if(list)list.id='presale-shows';
 document.querySelectorAll('[data-member-access]').forEach(button=>{
  const card=button.closest('.event-with-image-and-description');const link=document.createElement('a');link.className=button.className;link.textContent='Learn More';link.setAttribute('data-member-access-unlocked','');
  const source=card.querySelector('.event-title a');link.href=source.getAttribute('href');
  if(link.getAttribute('href').startsWith('/'))link.href=link.getAttribute('href')+'?access=unlocked';else{link.target='_blank';link.rel='noopener noreferrer';}
  button.replaceWith(link);card.querySelector('.member-presale-label').textContent='Presale access unlocked';
 });
 // Keep access when following the local show image/title, too.
 document.querySelectorAll('a[href="/heidi-latsky-dance.html"]').forEach(a=>a.href='/heidi-latsky-dance.html?access=unlocked');
 if(onShow){
  const chooser=document.createElement('fieldset');chooser.id='presale-performances';chooser.className='presale-performance-picker';
  chooser.innerHTML='<legend>Select a Date</legend><label><input type="radio" name="presale-performance" value="January 9, 2027 at 7:30 pm"><span>Saturday, January 9, 2027 at 7:30 pm</span></label><label><input type="radio" name="presale-performance" value="January 10, 2027 at 2:00 pm"><span>Sunday, January 10, 2027 at 2:00 pm</span></label>';
  const originalDates=document.querySelector('.vs-show-perf-date-item')?.closest('.scrollbox');
  if(originalDates)originalDates.replaceWith(chooser);else accessBox.before(chooser);
  let selectedPerformance='';
  chooser.addEventListener('change',event=>{
   selectedPerformance=event.target.value;next.textContent='Book Tickets';next.href='#booking-preview';
  });
  const booking=document.createElement('dialog');booking.className='member-access-dialog access-flow-dialog';booking.setAttribute('aria-labelledby','booking-preview-title');
  booking.innerHTML='<button type="button" class="member-dialog-close" aria-label="Close booking preview">×</button><p class="member-dialog-eyebrow">Demo preview</p><h2 id="booking-preview-title">Book Tickets</h2><p class="booking-performance"></p><p>Ticket checkout would open for this performance. No tickets have been reserved in this demo.</p>';
  document.body.append(booking);booking.querySelector('button').addEventListener('click',()=>booking.close());
  next.addEventListener('click',event=>{
   if(!selectedPerformance)return;
   event.preventDefault();booking.querySelector('.booking-performance').textContent='Heidi Latsky Dance · '+selectedPerformance;booking.showModal();
  });
 }
}
if(accessUnlocked&&location.hash==='#member-access-confirmation'){
 const revealAccess=()=>accessBox?.scrollIntoView({block:'start'});
 requestAnimationFrame(revealAccess);
 window.addEventListener('load',revealAccess,{once:true});
 document.fonts.ready.then(revealAccess);
}

// Use the same left-to-right fill for every visible CTA, including generated actions.
document.querySelectorAll(".member-action,.access-confirm,.ticket-button,.lnd-description-button,.series-video-toggle,.demo-dialog button,.vs-supporter-link-cont").forEach(button=>button.classList.add("slide-cta"));
