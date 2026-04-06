let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
let editIndex = null;

const modal = document.getElementById("modal");

// Open / Close Modal
openModalBtn.onclick = () => modal.style.display = "block";
closeModal.onclick = () => {
  modal.style.display = "none";
  resetForm();
};

// Save Appointment
appointmentForm.onsubmit = function(e) {
  e.preventDefault();

  const data = {
    patient: patientName.value.trim(),
    doctor: doctorName.value.trim(),
    hospital: hospitalName.value.trim(),
    specialty: specialty.value.trim(),
    date: date.value,
    time: time.value,
    reason: reason.value.trim()
  };

  if (!data.patient || !data.doctor || !data.date || !data.time) {
    alert("Please fill all required fields");
    return;
  }

  if (editIndex !== null) {
    appointments[editIndex] = data;
    editIndex = null;
  } else {
    appointments.push(data);
  }

  localStorage.setItem("appointments", JSON.stringify(appointments));

  renderAll();
  modal.style.display = "none";
  resetForm();
};

// Reset Form
function resetForm() {
  appointmentForm.reset();
}

// Render Everything
function renderAll() {
  renderList();
  renderCalendar();
}

// Appointment List
function renderList() {
  const list = document.getElementById("appointmentList");
  list.innerHTML = "";

  const pSearch = searchPatient.value.toLowerCase();
  const dSearch = searchDoctor.value.toLowerCase();
  const fDate = filterDate.value;

  appointments.forEach((a, i) => {

    if (
      !a.patient.toLowerCase().includes(pSearch) ||
      !a.doctor.toLowerCase().includes(dSearch) ||
      (fDate && a.date !== fDate)
    ) return;

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${a.patient}</strong> - ${a.doctor}<br>
      ${a.date} | ${a.time}<br>
      <button onclick="edit(${i})">Edit</button>
      <button onclick="removeAppt(${i})">Delete</button>
    `;

    list.appendChild(div);
  });
}

// Delete
function removeAppt(i) {
  appointments.splice(i, 1);
  localStorage.setItem("appointments", JSON.stringify(appointments));
  renderAll();
}

// Edit
function edit(i) {
  const a = appointments[i];

  patientName.value = a.patient;
  doctorName.value = a.doctor;
  hospitalName.value = a.hospital;
  specialty.value = a.specialty;
  date.value = a.date;
  time.value = a.time;
  reason.value = a.reason;

  editIndex = i;
  modal.style.display = "block";
}

// Calendar (REAL MONTH)
function renderCalendar() {
  const cal = document.getElementById("calendar");
  const header = document.getElementById("calendarHeader");

  cal.innerHTML = "";

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  header.innerText = now.toLocaleString("default", { month: "long", year: "numeric" });

  // Empty cells
  for (let i = 0; i < firstDay; i++) {
    cal.innerHTML += `<div></div>`;
  }

  // Days
  for (let d = 1; d <= totalDays; d++) {
    const fullDate = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

    let dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.innerHTML = `<strong>${d}</strong>`;

    appointments.forEach(a => {
      if (a.date === fullDate) {
        const ap = document.createElement("div");
        ap.className = "appointment";
        ap.innerText = `${a.patient} (${a.time})`;
        dayDiv.appendChild(ap);
      }
    });

    cal.appendChild(dayDiv);
  }
}

// Filters
searchPatient.oninput = renderList;
searchDoctor.oninput = renderList;
filterDate.onchange = renderList;

// Init
renderAll();