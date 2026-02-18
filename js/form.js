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

  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const athleteTypeValue = String(formData.get('athleteType') || '').trim();
  const message = String(formData.get('message') || '').trim();

  const ageLabel = ageBand === 'under18' ? 'Under 18' : '18+';
  const athleteTypeMap = {
    highschool: 'High school athlete',
    collegiate: 'Collegiate athlete',
    nfl: 'NFL athlete'
  };
  const athleteTypeLabel = athleteTypeMap[athleteTypeValue] || athleteTypeValue || 'Not provided';

  const subject = 'New Apply/Contact Submission - Sovereign Athlete Advisory';
  const body = [
    'New submission details:',
    '',
    `Full name: ${name}`,
    `Email: ${email}`,
    `Athlete age band: ${ageLabel}`,
    `Athlete level: ${athleteTypeLabel}`,
    '',
    'Message:',
    message
  ].join('\n');

  const mailtoUrl = `mailto:info@sovereignathletes.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  msg.textContent = 'Opening your email app...';
  window.location.href = mailtoUrl;
  msg.textContent = 'Success: If your email app opened and you clicked Send, your submission was sent to info@sovereignathletes.com.';
  form.reset();
  guardianConsented = false;
});
