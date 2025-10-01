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
        jobElement.innerHTML = `
            <div class="job-header">
                <div>
                  <span class="job-title">${job.company}</span>
                  <p>${job.title}</p>
                </div>
                <span class="date">${job.location}<br>${job.period}</span>
            </div>
            <ul>
                ${job.tasks.map(task => `<li>${task}</li>`).join('')}
            </ul>
        `;
        jobsContainer.appendChild(jobElement);
    });

    const schoolsContainer = document.getElementById('schools');
    schoolsContainer.innerHTML = '';
    translations.schools.forEach(school => {
        const schoolElement = document.createElement('div');
        schoolElement.classList.add('school');
        let schoolHtml = `
            <span class="job-title">${school.institution}</span>
        `;
        if (school.location) {
            schoolHtml += `<span class="date">${school.location}<br>${school.period}</span>`;
        } else if (school.period) {
            schoolHtml += `<span class="date">${school.period}</span>`;
        }
        schoolHtml += `<p>${school.degree}</p>`;
        schoolElement.innerHTML = schoolHtml;
        schoolsContainer.appendChild(schoolElement);
    });
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
