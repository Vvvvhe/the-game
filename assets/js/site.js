// Small, privacy-preserving enhancements. This script stores nothing,
// sends nothing and loads nothing from other websites.
(()=>{
 // 1. Highlight the download that matches this computer. Detection happens
 //    only in this browser; the result is never stored or transmitted.
 const platforms=document.querySelectorAll('[data-platform]');
 if(platforms.length){
  const ua=(navigator.userAgentData?.platform||navigator.platform||navigator.userAgent||'').toLowerCase();
  const os=/win/.test(ua)?'windows':/mac|iphone|ipad/.test(ua)?'mac':/linux|x11|cros/.test(ua)?'linux':null;
  for(const card of platforms){if(card.dataset.platform===os){card.classList.add('recommended');const h=card.querySelector('h2');if(h){const b=document.createElement('span');b.className='badge';b.textContent='Matches this computer';h.append(b);}}}
 }
 // 2. Contact form: accessible validation, then the visitor's own email app
 //    opens with the message. The website never receives the form data.
 const form=document.querySelector('form.contact');
 if(form){
  const status=form.querySelector('[role=status]');
  const setError=(field,message)=>{const error=document.getElementById(field.id+'-error');field.setAttribute('aria-invalid',message?'true':'false');if(error)error.textContent=message||'';};
  form.addEventListener('submit',event=>{
   event.preventDefault();
   const email=form.elements.email,message=form.elements.message,consent=form.elements.consent,name=form.elements.name,topic=form.elements.topic;
   const problems=[];
   setError(email,'');setError(message,'');setError(consent,'');
   if(!email.value.trim())problems.push([email,'Enter your email address so we can reply.']);
   else if(!email.checkValidity())problems.push([email,'Enter an email address in the format name@example.com.']);
   if(!message.value.trim())problems.push([message,'Enter your message.']);
   if(!consent.checked)problems.push([consent,'Tick the box to confirm you agree, or email us directly instead.']);
   for(const [field,text] of problems)setError(field,text);
   if(problems.length){status.textContent=`${problems.length} ${problems.length===1?'problem needs':'problems need'} fixing before sending.`;problems[0][0].focus();return;}
   const to=form.dataset.to;
   if(!to||to.includes('[TO FILL')){status.textContent='The contact address has not been set up yet, so the message cannot be prepared.';return;}
   const subject=`[${topic.value}] Message from the website`;
   const body=`${message.value.trim()}\n\n—\nName: ${name.value.trim()||'(not given)'}\nReply to: ${email.value.trim()}\nConsent to processing for a reply: yes`;
   status.textContent='Opening your email app. Your message is sent only when you press Send there.';
   window.location.href=`mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
 }
})();
