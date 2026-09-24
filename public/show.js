// Local-only interactions for the reference page's supporting controls.
document.querySelectorAll('.widget-trigger').forEach(button=>{
 button.addEventListener('click',()=>{
  const panel=document.getElementById(button.getAttribute('aria-controls'));
  const open=button.getAttribute('aria-expanded')!=='true';
  document.querySelectorAll('.widget-panel').forEach(p=>{p.hidden=true;p.setAttribute('aria-hidden','true');});
  document.querySelectorAll('.widget-trigger').forEach(b=>b.setAttribute('aria-expanded','false'));
  button.setAttribute('aria-expanded',String(open));panel.hidden=!open;panel.setAttribute('aria-hidden',String(!open));
 });
 button.addEventListener('keydown',event=>{
  if(event.key==='Escape'){document.getElementById(button.getAttribute('aria-controls')).hidden=true;button.setAttribute('aria-expanded','false');}
 });
});
const calendar=document.querySelector('#calendar-panel');
calendar.innerHTML='<h2 class="panel-copy-h2">Add this event to your calendar</h2><div class="demo-tool-options"><a download="heidi-latsky-jan-9.ics" href="/calendar/heidi-latsky-jan-9.ics">January 9, 2027 · 7:30 pm</a><a download="heidi-latsky-jan-10.ics" href="/calendar/heidi-latsky-jan-10.ics">January 10, 2027 · 2:00 pm</a></div>';
const share=document.querySelector('.share-tool-ig-container');
share?.setAttribute('href','mailto:?subject=Heidi%20Latsky%20Dance&body='+encodeURIComponent(location.href));
document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',e=>e.preventDefault()));
document.querySelector('#vs-show-email-form-submit-alt')?.addEventListener('click',e=>{e.preventDefault();document.querySelector('.demo-dialog').showModal();});
