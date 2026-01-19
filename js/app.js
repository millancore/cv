const defaultLanguage = 'en';
const langButtons = document.querySelectorAll('.lang-button')


async function loadLanguage(lang) {
    const response = await fetch(`data/${lang}.json`);
    const translations = await response.json();

    activateButton(lang);

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translations[key];
    });

    const jobsContainer = document.getElementById('jobs');
    jobsContainer.innerHTML = '';
    translations.jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.classList.add('job');
        if (job.noPrint) jobElement.classList.add('no-print');
        const locationMode = [job.location, job.mode].filter(Boolean).join(' · ');
        jobElement.innerHTML = `
            <div class="job-header">
                <div>
                  <span class="job-title">${job.company}</span>
                  <p>${job.title}</p>
                </div>
                <span class="date">${locationMode ? locationMode + '<br>' : ''}${job.period}</span>
            </div>
            <ul>
                ${job.tasks.map(task => {
                    if (typeof task === 'object') {
                        return `<li class="${task.noPrint ? 'no-print' : ''}">${task.text}</li>`;
                    }
                    return `<li>${task}</li>`;
                }).join('')}
            </ul>
        `;
        jobsContainer.appendChild(jobElement);
    });

    const schoolsContainer = document.getElementById('schools');
    schoolsContainer.innerHTML = '';
    translations.schools.forEach(school => {
        const schoolElement = document.createElement('div');
        schoolElement.classList.add('school');
        schoolElement.innerHTML = `
            <div class="school-header">
                <span class="school-title">${school.institution}</span>
                ${school.period ? `<span class="school-period">${school.period}</span>` : ''}
            </div>
            <p class="school-degree">${school.degree}</p>
        `;
        schoolsContainer.appendChild(schoolElement);
    });

    const skillsContainer = document.getElementById('skills');
    skillsContainer.innerHTML = '';
    if (translations.skills) {
        const skillsElement = document.createElement('div');
        skillsElement.classList.add('skills-grid');
        let skillsHtml = '';
        for (const [category, items] of Object.entries(translations.skills)) {
            skillsHtml += `
                <div class="skill-category">
                    <span class="skill-label">${category}:</span>
                    <span class="skill-items">${items.join(', ')}</span>
                </div>
            `;
        }
        skillsElement.innerHTML = skillsHtml;
        skillsContainer.appendChild(skillsElement);
    }
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    loadLanguage(lang);
}

function activateButton(lang) {
    langButtons.forEach(button => {
        button.classList.remove('active');
    })

    langButtons.forEach(button => {
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('active');
        }
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language') || defaultLanguage;
    loadLanguage(savedLanguage);


    langButtons.forEach(element => {
        element.addEventListener('click', () => {
            setLanguage(element.getAttribute('data-lang'));
        });
    })

});
