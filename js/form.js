let guardianConsented = false;

const modal = document.getElementById('consentModal');
const form = document.getElementById('applyForm');
const msg = document.getElementById('formMsg');

function openModal(){
  modal?.classList.add('open');
  modal?.setAttribute('aria-hidden','false');
}

function closeModal(){
  modal?.classList.remove('open');
  modal?.setAttribute('aria-hidden','true');
}

document.addEventListener('click',(e)=>{
  if(!modal) return;
  const target = e.target;
  if(!(target instanceof Element)) return;

  if(target.matches('[data-close]')) closeModal();

  if(target.matches('[data-decline]')){
    guardianConsented = false;
    closeModal();
    alert('Consent is required to submit for a minor.');
  }

  if(target.matches('[data-accept]')){
    guardianConsented = true;
    closeModal();
    if(msg){
      msg.textContent = 'Guardian consent recorded. You can submit the form now.';
    }
  }
});

form?.addEventListener('submit',async (e)=>{
  e.preventDefault();

  const ageBand = form.querySelector('input[name="ageBand"]:checked')?.value;
  if(ageBand === 'under18' && !guardianConsented){
    openModal();
    return;
  }

  msg.textContent = 'Sending...';
  await new Promise((resolve)=>setTimeout(resolve,600));
  msg.textContent = "Received. We'll reply within 1 business day.";
  form.reset();
  guardianConsented = false;
});
