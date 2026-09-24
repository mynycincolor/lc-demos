// Local UI only: no production scripts, analytics, account calls, or form submissions.
const closeMenus=()=>{
 document.querySelectorAll('.demo-open').forEach(el=>el.classList.remove('demo-open'));
 document.querySelectorAll('[aria-expanded="true"]').forEach(el=>el.setAttribute('aria-expanded','false'));
};
document.querySelectorAll('.nav-button,.vs-sub-nev-parent').forEach((button,index)=>{
 const menu=button.nextElementSibling;
 if(!menu)return;
 button.setAttribute('tabindex','0');button.setAttribute('role','button');button.setAttribute('aria-expanded','false');
 menu.id='demo-menu-'+index;button.setAttribute('aria-controls',menu.id);
 const toggle=event=>{event.stopPropagation();const open=menu.classList.contains('demo-open');closeMenus();menu.classList.toggle('demo-open',!open);button.setAttribute('aria-expanded',String(!open));};
 button.addEventListener('click',toggle);
 if(button.tagName!=='BUTTON')button.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(e);}});
});
document.addEventListener('click',e=>{if(!e.target.closest('.dropdown-menu,.page-in-nav'))closeMenus();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenus();});
const mobile=document.querySelector('#nav-btn');
mobile?.addEventListener('click',e=>{e.stopPropagation();const open=document.querySelector('#nav-dropdown').classList.toggle('demo-open');mobile.setAttribute('aria-expanded',String(open));});
const seriesMenu=document.querySelector('#vs-show-menu-mobile');
seriesMenu?.setAttribute('role','button');seriesMenu?.setAttribute('tabindex','0');
function toggleSeries(){const open=document.querySelector('.page-nav-wrapper').classList.toggle('demo-open');seriesMenu.setAttribute('aria-expanded',String(open));}
seriesMenu?.addEventListener('click',toggleSeries);
seriesMenu?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleSeries();}});
const about=document.querySelector('[data-page="about"]');
about?.addEventListener('click',()=>window.open('https://www.lincolncenter.org/series/lincoln-center-presents/v/about','_blank','noopener'));
const dialog=document.createElement('dialog');dialog.className='demo-dialog';
dialog.innerHTML='<h2>Email updates</h2><p>This local demo does not submit email addresses. Email signup can be connected as part of the next flow.</p><button type="button">Close</button>';
document.body.append(dialog);dialog.querySelector('button').addEventListener('click',()=>dialog.close());
document.querySelectorAll('.email-popup-trigger,.nav-mail,#nav-social-email-desktop,#nav-social-email-mobile').forEach(el=>{el.setAttribute('tabindex','0');el.addEventListener('click',()=>dialog.showModal());el.addEventListener('keydown',e=>{if(e.key==='Enter')dialog.showModal();});});
const hero=document.querySelector('.new-header-vs img');
if(hero?.getAttribute('mobilesrc')){const desktop=hero.src;const mq=matchMedia('(max-width: 600px)');const sync=()=>hero.src=mq.matches?hero.getAttribute('mobilesrc'):desktop;mq.addEventListener('change',sync);sync();}

// The signed-out presale gate retains the selected performance while the dialog is open.
const memberDialog=document.querySelector('#member-access-dialog');
document.querySelectorAll('[data-member-access]').forEach(button=>{
 button.addEventListener('click',()=>{
  const card=button.closest('.event-with-image-and-description');
  memberDialog.querySelector('#member-selected-event').textContent=card.querySelector('.event-title').textContent.trim();
  memberDialog.dataset.event=card.dataset.event;
  memberDialog.showModal();
 });
});
memberDialog?.querySelector('.member-dialog-close').addEventListener('click',()=>memberDialog.close());
memberDialog?.addEventListener('click',event=>{
 const rect=memberDialog.getBoundingClientRect();
 if(event.target===memberDialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))memberDialog.close();
});
