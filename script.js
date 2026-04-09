let appointments = JSON.parse(localStorage.getItem('appts')) || [];
let currentViewDate = new Date(); 


const dateDisplay = document.getElementById('current-date-display');
const dayIndicator = document.getElementById('day-indicator');

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const modal = document.getElementById('modal-overlay');
const apptForm = document.getElementById('appointment-form');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');
const monthSelect = document.getElementById('month-select');



prevBtn.addEventListener('click', () => {
    currentViewDate.setMonth(currentViewDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener('click', () => {
    currentViewDate.setMonth(currentViewDate.getMonth() + 1);
    renderCalendar();
});



monthSelect.addEventListener('change', (e) => {
    currentViewDate.setMonth(parseInt(e.target.value));
    renderCalendar();
});


toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    
});

document.getElementById('nav-dashboard').addEventListener('click', () => switchView('dashboard'));
document.getElementById('nav-calendar').addEventListener('click', () => switchView('calendar'));

function switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    if (viewName === 'dashboard') {
        document.getElementById('view-dashboard').classList.add('active-view');
        document.getElementById('nav-dashboard').classList.add('active');
        renderTable();
    } else {
        document.getElementById('view-calendar').classList.add('active-view');
        document.getElementById('nav-calendar').classList.add('active');
        renderCalendar();
    }
}


document.getElementById('open-modal').addEventListener('click', () => {
    apptForm.reset();
    delete apptForm.dataset.editIndex;
    
    modal.classList.add('show');
});

document.getElementById('close-modal').addEventListener('click', () => {
    modal.classList.remove('show');
});

document.getElementById('btn-cancel').addEventListener('click', () => {
    modal.classList.remove('show');
});


apptForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newAppt = {
        patient: document.getElementById('patientName').value,
        doctor: document.getElementById('doctorName').value,
        hospital: document.getElementById('hospitalName').value,
        specialty: document.getElementById('specialty').value,
        date: document.getElementById('apptDate').value,
        time: document.getElementById('apptTime').value,
        reason: document.getElementById('reason').value
    };





    const editIndex = apptForm.dataset.editIndex;
    if (editIndex !== undefined) {
        appointments[editIndex] = newAppt;
    } else {
        appointments.push(newAppt);
    }

    localStorage.setItem('appts', JSON.stringify(appointments));
    // modal.style.display = 'none';
    modal.classList.remove('show');
    renderTable();
    renderCalendar();
});

function deleteAppt(index) {
    appointments.splice(index, 1);
    localStorage.setItem('appts', JSON.stringify(appointments));
    renderTable();
    renderCalendar();
}

function editAppt(index) {
    const data = appointments[index];
    document.getElementById('patientName').value = data.patient;
    document.getElementById('doctorName').value = data.doctor;
    document.getElementById('hospitalName').value = data.hospital;
    document.getElementById('specialty').value = data.specialty;
    document.getElementById('apptDate').value = data.date;
    document.getElementById('apptTime').value = data.time;
    document.getElementById('reason').value = data.reason;
    
    apptForm.dataset.editIndex = index;
    
    modal.classList.add('show');
}


apptForm.addEventListener('submit', (e) => {
    const date = document.getElementById('apptDate').value;
    const time = document.getElementById('apptTime').value;

    if (!date || !time) {
        alert("Please enter date and time");
        e.preventDefault();
        return;
    }
});




function renderTable() {
    const tbody = document.getElementById('table-body');
    const searchP = document.getElementById('search-patient').value.toLowerCase() || "";

    let rows = appointments
        .filter(a => (a.patient || "").toLowerCase().includes(searchP))
        .map((a, i) => `
            <tr>
                <td style="color:blue; cursor:pointer" onclick="goToDate('${a.date}')">${a.patient}</td>
                <td>${a.doctor}</td>
                <td>${a.hospital}</td>
                <td>${a.specialty}</td>
                <td>${a.date}</td>
                <td>${formatTimeTo12Hr(a.time)}</td>


                <td>
                    <span class="action-btn edit" onclick="editAppt(${i})"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.25 16.25H18.75V17.5H1.25V16.25ZM15.875 5.625C16.375 5.125 16.375 4.375 15.875 3.875L13.625 1.625C13.125 1.125 12.375 1.125 11.875 1.625L2.5 11V15H6.5L15.875 5.625ZM12.75 2.5L15 4.75L13.125 6.625L10.875 4.375L12.75 2.5ZM3.75 13.75V11.5L10 5.25L12.25 7.5L6 13.75H3.75Z" fill="#2C7BE5"/>
</svg>

                    <span class="action-btn delete" onclick="deleteAppt(${i})"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 21C6.45 21 5.979 20.804 5.587 20.412C5.195 20.02 4.99933 19.5493 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.804 20.021 18.412 20.413C18.02 20.805 17.5493 21.0007 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="#E23D28"/>
</svg>
</span>
                </td>
            </tr>
        `);

    
    const totalRows = 8;
    const emptyRows = totalRows - rows.length;

    for (let i = 0; i < emptyRows; i++) {
        rows.push(`
            <tr class="empty-row">
                <td>&nbsp;</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        `);
    }

    tbody.innerHTML = rows.join('');
}




function renderCalendar() {
    const container = document.getElementById('calendar-days');
container.innerHTML = `
    <div class="day-header">SUNDAY</div>
    <div class="day-header">MONDAY</div>
    <div class="day-header">TUESDAY</div>
    <div class="day-header">WEDNESDAY</div>
    <div class="day-header">THURSDAY</div>
    <div class="day-header">FRIDAY</div>
    <div class="day-header">SATURDAY</div>
`;

    
    
    
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
   const today = new Date();


const options = { day: 'numeric', month: 'short', year: 'numeric' };
dateDisplay.innerText = currentViewDate.toLocaleDateString('en-US', options);

const tempCurrent = new Date(currentViewDate);
    const tempToday = new Date(today);

    tempCurrent.setHours(0,0,0,0);
    tempToday.setHours(0,0,0,0);

    const diffTime = tempCurrent - tempToday;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) {
        dayIndicator.innerText = "Today";
    } else if (diffDays === 1) {
        dayIndicator.innerText = "Tomorrow";
    } else if (diffDays === -1) {
        dayIndicator.innerText = "Yesterday";
    } else {
        dayIndicator.innerText = "";
    }


dayIndicator.addEventListener('click', () => {
    currentViewDate = new Date();
    renderCalendar();
});



    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    
    for(let i=0; i<firstDay; i++) {
        container.innerHTML += `<div class="day-cell"></div>`;
    }

    
    for(let d=1; d<=daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayAppts = appointments.filter(a => a.date === dateStr);
        
        
let apptHtml = dayAppts.map((a, i) => `
    <div class="appt-pill">
        <div class="appt-top">
            <span>${a.patient} | ${formatTimeTo12Hr(a.time)}</span>
            <div class="appt-actions">
                <<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.25 16.25H18.75V17.5H1.25V16.25ZM15.875 5.625C16.375 5.125 16.375 4.375 15.875 3.875L13.625 1.625C13.125 1.125 12.375 1.125 11.875 1.625L2.5 11V15H6.5L15.875 5.625ZM12.75 2.5L15 4.75L13.125 6.625L10.875 4.375L12.75 2.5ZM3.75 13.75V11.5L10 5.25L12.25 7.5L6 13.75H3.75Z" fill="#2C7BE5"/>

 onclick="editAppt(${appointments.indexOf(a)}); event.stopPropagation();"></svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 21C6.45 21 5.979 20.804 5.587 20.412C5.195 20.02 4.99933 19.5493 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.804 20.021 18.412 20.413C18.02 20.805 17.5493 21.0007 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z" fill="#E23D28"/>

 onclick="deleteAppt(${appointments.indexOf(a)}); event.stopPropagation();"></svg>
            </div>
        </div>
    </div>
`).join('');



        
container.innerHTML += `
    <div class="day-cell" onclick="openModalWithDate('${dateStr}')">
        <span class="day-num">${d}</span>
        ${apptHtml}
    </div>
`;




    }
}

function formatTimeTo12Hr(time) {
    let [hour, minute] = time.split(":");
    hour = parseInt(hour);

    let ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12; // convert 0 → 12

    return `${hour}:${minute} ${ampm}`;
}





function openModalWithDate(dateStr) {
    apptForm.reset();

    
    document.getElementById('apptDate').value = dateStr;

    
    modal.classList.add('show');
}
function goToDate(dateString) {
    currentViewDate = new Date(dateString);
    switchView('calendar');
}


currentViewDate = new Date();
switchView('calendar');
