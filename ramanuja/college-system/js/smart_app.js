// Dummy Database
const DB = {
    users: [
        { id: 1, role: 'student', username: 'student', password: 'password', name: 'Alex Johnson', email: 'alex@nexus.edu' },
        { id: 2, role: 'faculty', username: 'faculty', password: 'password', name: 'Dr. Sarah Smith', email: 'sarah@nexus.edu' }
    ],
    attendance: [
        { subject: 'Computer Networks', total: 40, attended: 35 },
        { subject: 'Database Systems', total: 40, attended: 28 }, // 70%
        { subject: 'Operating Systems', total: 35, attended: 33 },
        { subject: 'AI & Data Science', total: 30, attended: 20 } // 66%
    ],
    quizzes: [
        { id: 1, subject: 'Computer Networks', title: 'TCP/IP Basics', date: '2026-04-20', deadline: '2026-04-26', status: 'pending' },
        { id: 2, subject: 'Database Systems', title: 'SQL Joins', date: '2026-04-15', deadline: '2026-04-18', status: 'completed' }
    ],
    assignments: [
        { id: 1, subject: 'Operating Systems', title: 'Memory Management', deadline: '2026-04-28', status: 'pending' },
        { id: 2, subject: 'AI & Data Science', title: 'Neural Networks Model', deadline: '2026-04-22', status: 'submitted' }
    ],
    exams: [
        { type: 'Mid-1', subject: 'Computer Networks', date: '2026-05-10', time: '10:00 AM' },
        { type: 'Mid-1', subject: 'Database Systems', date: '2026-05-12', time: '10:00 AM' }
    ],
    marks: [
        { exam: 'Mid-1', subject: 'Computer Networks', marks: 85, total: 100, status: 'Pass' },
        { exam: 'Mid-1', subject: 'Database Systems', marks: 92, total: 100, status: 'Pass' }
    ],
    calendar: [
        { title: 'Semester Start', date: '2026-01-15', type: 'Semester Start' },
        { title: 'Mid-1 Examination', date: '2026-05-10', type: 'Exam Period' },
        { title: 'Project Exhibition', date: '2026-05-25', type: 'Event' },
        { title: 'Summer Vacation', date: '2026-06-01', type: 'Holiday' }
    ],
    notifications: [
        { title: 'Quiz Tomorrow', message: 'Computer Networks Quiz 2 will be held tomorrow at 10 AM.', date: '2026-04-23' },
        { title: 'Assignment Reminder', message: 'Database SQL Joins assignment is due in 2 days.', date: '2026-04-22' },
        { title: 'Welcome to SMART ACAD', message: 'Your personalized academic portal is now live.', date: '2026-04-20' }
    ]
};

// State
let currentUser = null;
let currentView = 'overview';

// DOM Elements
const appDiv = document.getElementById('app');
const toastContainer = document.getElementById('toast-container');

// App Initialization
function init() {
    const session = localStorage.getItem('nexus_user');
    if (session) {
        currentUser = JSON.parse(session);
        renderDashboard();
    } else {
        renderLogin();
    }
}

// Utility
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function getProgressColor(percent) {
    if (percent >= 75) return 'var(--success)';
    if (percent >= 60) return 'var(--warning)';
    return 'var(--danger)';
}

function getStatusBadge(deadline) {
    const now = new Date('2026-04-24');
    const dlDate = new Date(deadline);
    const diffDays = Math.ceil((dlDate - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `<span class="badge badge-danger">Overdue</span>`;
    if (diffDays <= 2) return `<span class="badge badge-danger">Due in ${diffDays} days</span>`;
    if (diffDays <= 5) return `<span class="badge badge-warning">Due in ${diffDays} days</span>`;
    return `<span class="badge badge-success">Due in ${diffDays} days</span>`;
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const role = document.querySelector('.role-btn.active').dataset.role;
    const username = e.target.username.value;
    const password = e.target.password.value;

    const user = DB.users.find(u => u.role === role && u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('nexus_user', JSON.stringify(user));
        showToast(`Welcome back, ${user.name}`);
        currentView = 'overview';
        renderDashboard();
    } else {
        showToast('Invalid credentials', 'error');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('nexus_user');
    renderLogin();
}

// Render Functions
function setRole(role) {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.role-btn[data-role="${role}"]`).classList.add('active');
    const userField = document.querySelector('input[name="username"]');
    if (userField) {
        userField.value = role; // Set default demo value based on role
    }
}

function renderLogin() {
    appDiv.innerHTML = `
        <div class="login-wrapper">
            <div class="glass-panel login-box">
                <div class="login-logo"><i class="fas fa-graduation-cap"></i> SMART ACAD</div>
                <p class="text-center text-muted" style="margin-bottom: 2rem;">Secure Portal Access</p>
                
                <div class="role-selector">
                    <button class="role-btn active" data-role="student" onclick="setRole('student')">Student</button>
                    <button class="role-btn" data-role="faculty" onclick="setRole('faculty')">Faculty</button>
                </div>

                <form onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label>Username / Email</label>
                        <input type="text" name="username" class="form-control" value="student" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" class="form-control" value="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-full" style="margin-top: 1rem;"><i class="fas fa-sign-in-alt"></i> Access Dashboard</button>
                </form>
                <div class="text-center" style="margin-top:1.5rem; font-size:0.85rem; color: var(--text-muted);">
                    <p>Demo Credentials:</p>
                    <p>Student: student / password</p>
                    <p>Faculty: faculty / password</p>
                </div>
            </div>
        </div>
    `;
}

function renderDashboard() {
    const isStudent = currentUser.role === 'student';
    
    const sidebarItems = isStudent ? `
        <a class="nav-item ${currentView==='overview'?'active':''}" onclick="navigate('overview')"><i class="fas fa-home"></i> <span class="text-sm-hide">Overview</span></a>
        <a class="nav-item ${currentView==='attendance'?'active':''}" onclick="navigate('attendance')"><i class="fas fa-user-check"></i> <span class="text-sm-hide">Attendance</span></a>
        <a class="nav-item ${currentView==='quizzes'?'active':''}" onclick="navigate('quizzes')"><i class="fas fa-question-circle"></i> <span class="text-sm-hide">Quizzes</span></a>
        <a class="nav-item ${currentView==='assignments'?'active':''}" onclick="navigate('assignments')"><i class="fas fa-tasks"></i> <span class="text-sm-hide">Assignments</span></a>
        <a class="nav-item ${currentView==='exams'?'active':''}" onclick="navigate('exams')"><i class="fas fa-file-alt"></i> <span class="text-sm-hide">Exams</span></a>
        <a class="nav-item ${currentView==='marks'?'active':''}" onclick="navigate('marks')"><i class="fas fa-chart-bar"></i> <span class="text-sm-hide">Marks</span></a>
        <a class="nav-item ${currentView==='calendar'?'active':''}" onclick="navigate('calendar')"><i class="fas fa-calendar-alt"></i> <span class="text-sm-hide">Calendar</span></a>
    ` : `
        <a class="nav-item ${currentView==='overview'?'active':''}" onclick="navigate('overview')"><i class="fas fa-home"></i> <span class="text-sm-hide">Overview</span></a>
        <a class="nav-item ${currentView==='mark_attendance'?'active':''}" onclick="navigate('mark_attendance')"><i class="fas fa-clipboard-check"></i> <span class="text-sm-hide">Mark Attendance</span></a>
        <a class="nav-item ${currentView==='upload_quizzes'?'active':''}" onclick="navigate('upload_quizzes')"><i class="fas fa-upload"></i> <span class="text-sm-hide">Upload Quizzes</span></a>
        <a class="nav-item ${currentView==='upload_assignments'?'active':''}" onclick="navigate('upload_assignments')"><i class="fas fa-file-upload"></i> <span class="text-sm-hide">Upload Assignments</span></a>
        <a class="nav-item ${currentView==='upload_marks'?'active':''}" onclick="navigate('upload_marks')"><i class="fas fa-graduation-cap"></i> <span class="text-sm-hide">Upload Marks</span></a>
        <a class="nav-item ${currentView==='notify'?'active':''}" onclick="navigate('notify')"><i class="fas fa-bell"></i> <span class="text-sm-hide">Send Notification</span></a>
    `;

    appDiv.innerHTML = `
        <div class="dashboard-layout">
            <aside class="sidebar">
                <div class="sidebar-header">
                    <i class="fas fa-graduation-cap logo"></i> <span class="logo text-sm-hide">SMART ACAD</span>
                </div>
                <div class="sidebar-nav">
                    ${sidebarItems}
                </div>
                <div class="sidebar-footer">
                    <div class="user-profile">
                        <div class="avatar">${currentUser.name.charAt(0)}</div>
                        <div class="text-sm-hide">
                            <div style="font-weight: 600; font-size: 0.9rem;">${currentUser.name}</div>
                            <div class="text-muted" style="font-size: 0.8rem; text-transform: capitalize;">${currentUser.role}</div>
                        </div>
                    </div>
                </div>
            </aside>
            <main class="main-content">
                <header class="topbar">
                    <div class="page-title" style="text-transform: capitalize;">${currentView.replace('_', ' ')}</div>
                    <div class="topbar-actions">
                        <button class="icon-btn"><i class="fas fa-bell"></i><span class="icon-badge">3</span></button>
                        <button class="icon-btn" onclick="logout()" title="Logout"><i class="fas fa-sign-out-alt"></i></button>
                    </div>
                </header>
                <div class="content-area" id="main-content-area"></div>
            </main>
        </div>
    `;
    renderView();
}

function navigate(view) {
    currentView = view;
    renderDashboard();
}

function renderView() {
    const area = document.getElementById('main-content-area');
    const isStudent = currentUser.role === 'student';

    if (currentView === 'overview') {
        if (isStudent) {
            let totalClasses = 0; let attendedClasses = 0;
            DB.attendance.forEach(a => { totalClasses += a.total; attendedClasses += a.attended; });
            const avgAttendance = ((attendedClasses/totalClasses)*100).toFixed(1);
            
            area.innerHTML = `
                <div class="grid grid-cols-3" style="margin-bottom: 2rem;">
                    <div class="glass-panel card">
                        <div class="card-header"><div class="card-title">Overall Attendance</div><div class="card-icon"><i class="fas fa-percentage"></i></div></div>
                        <h2 style="font-size: 2rem; color: ${getProgressColor(avgAttendance)}">${avgAttendance}%</h2>
                        <p class="text-muted text-sm" style="margin-top:0.5rem">Status: ${avgAttendance >= 75 ? 'Good' : 'Shortage'}</p>
                    </div>
                    <div class="glass-panel card">
                        <div class="card-header"><div class="card-title">Upcoming Tasks</div><div class="card-icon"><i class="fas fa-tasks"></i></div></div>
                        <h2 style="font-size: 2rem;">${DB.assignments.length + DB.quizzes.length}</h2>
                        <p class="text-muted text-sm" style="margin-top:0.5rem">Pending Quizzes & Assignments</p>
                    </div>
                    <div class="glass-panel card">
                        <div class="card-header"><div class="card-title">Latest Notification</div><div class="card-icon"><i class="fas fa-bell"></i></div></div>
                        <p style="font-weight: 500;">${DB.notifications[0].title}</p>
                        <p class="text-muted text-sm" style="margin-top:0.5rem">${DB.notifications[0].message}</p>
                    </div>
                </div>
                
                <h3 style="margin-bottom: 1rem;">Subject Attendance</h3>
                <div class="glass-panel" style="padding: 1.5rem;">
                    ${DB.attendance.map(a => {
                        const pct = ((a.attended/a.total)*100).toFixed(1);
                        return `
                        <div style="margin-bottom: 1.5rem;">
                            <div class="progress-header">
                                <span>${a.subject}</span>
                                <span style="color: ${getProgressColor(pct)}">${pct}% (${a.attended}/${a.total})</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${pct}%; background: ${getProgressColor(pct)}"></div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            `;
        } else {
            area.innerHTML = `
                <div class="grid grid-cols-4" style="margin-bottom: 2rem;">
                    <div class="glass-panel card">
                        <div class="card-header"><div class="card-title">My Subjects</div><div class="card-icon"><i class="fas fa-book"></i></div></div>
                        <h2 style="font-size: 2rem;">04</h2>
                    </div>
                    <div class="glass-panel card">
                        <div class="card-header"><div class="card-title">Total Students</div><div class="card-icon"><i class="fas fa-users"></i></div></div>
                        <h2 style="font-size: 2rem;">120</h2>
                    </div>
                    <div class="glass-panel card" style="border-left: 4px solid var(--warning);">
                        <div class="card-header"><div class="card-title">Low Attendance</div><div class="card-icon" style="color: var(--warning)"><i class="fas fa-user-slash"></i></div></div>
                        <h2 style="font-size: 2rem; color: var(--warning)">08</h2>
                        <p class="text-sm text-muted">Students < 75%</p>
                    </div>
                    <div class="glass-panel card" style="border-left: 4px solid var(--primary);">
                        <div class="card-header"><div class="card-title">Pending Marks</div><div class="card-icon"><i class="fas fa-marker"></i></div></div>
                        <h2 style="font-size: 2rem;">02</h2>
                        <p class="text-sm text-muted">Exams to grade</p>
                    </div>
                </div>
                
                <div class="grid grid-cols-2">
                    <div class="glass-panel" style="padding: 1.5rem;">
                        <h3 style="margin-bottom: 1rem;">Recent Submissions</h3>
                        <div class="table-responsive">
                            <table>
                                <tr><td>Database Systems - Lab 4</td><td>15/30</td><td><button class="btn btn-outline" style="padding: 4px 8px; font-size: 0.75rem;">Review</button></td></tr>
                                <tr><td>Computer Networks - Quiz 1</td><td>28/30</td><td><span class="text-success">Graded</span></td></tr>
                            </table>
                        </div>
                    </div>
                    <div class="glass-panel" style="padding: 1.5rem;">
                        <h3 style="margin-bottom: 1rem;">Announcements</h3>
                        <div class="card" style="margin-bottom: 0.5rem; background: rgba(255,255,255,0.03);">
                            <div style="font-weight: 600; font-size: 0.9rem;">Internal Marks Uploaded</div>
                            <div class="text-muted text-sm">Yesterday</div>
                        </div>
                        <button class="btn btn-outline w-full" onclick="navigate('notify')">Send New</button>
                    </div>
                </div>
            `;
        }
    } 
    else if (currentView === 'attendance') {
        area.innerHTML = `
            <div class="glass-panel" style="padding: 1.5rem;">
                <h3 style="margin-bottom: 1.5rem;">Detailed Attendance</h3>
                <div class="table-responsive">
                    <table>
                        <thead><tr><th>Subject</th><th>Total Classes</th><th>Attended</th><th>Percentage</th><th>Status</th></tr></thead>
                        <tbody>
                            ${DB.attendance.map(a => {
                                const pct = ((a.attended/a.total)*100).toFixed(1);
                                return `<tr>
                                    <td><strong>${a.subject}</strong></td>
                                    <td>${a.total}</td>
                                    <td>${a.attended}</td>
                                    <td><span style="color:${getProgressColor(pct)}; font-weight:bold;">${pct}%</span></td>
                                    <td>${pct >= 75 ? '<span class="badge badge-success">Good</span>' : '<span class="badge badge-danger">Warning</span>'}</td>
                                </tr>`;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    else if (currentView === 'quizzes' || currentView === 'assignments') {
        const data = currentView === 'quizzes' ? DB.quizzes : DB.assignments;
        area.innerHTML = `
            <div class="glass-panel" style="padding: 1.5rem;">
                <div style="display:flex; justify-content:space-between; margin-bottom: 1.5rem;">
                    <h3>My ${currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h3>
                </div>
                <div class="grid grid-cols-2">
                    ${data.map(item => `
                        <div class="card" style="background: rgba(0,0,0,0.2);">
                            <div style="display:flex; justify-content:space-between;">
                                <span class="text-muted text-sm">${item.subject}</span>
                                ${item.status === 'completed' || item.status === 'submitted' ? '<span class="badge badge-success">Done</span>' : getStatusBadge(item.deadline)}
                            </div>
                            <h4 style="margin: 0.75rem 0;">${item.title}</h4>
                            <p class="text-sm text-muted">Deadline: ${item.deadline}</p>
                            ${item.status === 'pending' ? `<button class="btn btn-outline" style="margin-top:1rem; width:100%;">Start</button>` : `<button class="btn btn-outline" style="margin-top:1rem; width:100%;" disabled>View Result</button>`}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    else if (currentView === 'exams' || currentView === 'marks') {
        const title = currentView === 'exams' ? 'Exam Schedule' : 'Academic Results';
        const data = currentView === 'exams' ? DB.exams : DB.marks;
        const targetHtml = currentView === 'exams' ? 
            data.map(e => `<tr><td>${e.type}</td><td>${e.subject}</td><td>${e.date}</td><td>${e.time}</td></tr>`).join('') :
            data.map(m => `<tr><td>${m.exam}</td><td>${m.subject}</td><td><strong>${m.marks}/${m.total}</strong></td><td><span class="badge badge-success">${m.status}</span></td></tr>`).join('');
            
        area.innerHTML = `
            <div class="glass-panel" style="padding: 1.5rem;">
                <h3 style="margin-bottom: 1.5rem;">${title}</h3>
                <div class="table-responsive">
                    <table>
                        <thead>
                            ${currentView === 'exams' ? '<tr><th>Type</th><th>Subject</th><th>Date</th><th>Time</th></tr>' : '<tr><th>Exam</th><th>Subject</th><th>Marks</th><th>Status</th></tr>'}
                        </thead>
                        <tbody>${targetHtml}</tbody>
                    </table>
                </div>
            </div>
        `;
    }
    else if (currentView === 'calendar') {
        area.innerHTML = `
            <div class="glass-panel" style="padding: 1.5rem;">
                <h3 style="margin-bottom: 1.5rem;">Academic Calendar</h3>
                <div class="table-responsive">
                    <table>
                        <thead><tr><th>Date</th><th>Event Title</th><th>Type</th></tr></thead>
                        <tbody>
                            ${DB.calendar.map(c => `<tr>
                                <td>${c.date}</td>
                                <td><strong>${c.title}</strong></td>
                                <td><span class="badge badge-info">${c.type}</span></td>
                            </tr>`).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    else if (['mark_attendance', 'upload_quizzes', 'upload_assignments', 'upload_marks', 'notify'].includes(currentView)) {
        const titles = {
            mark_attendance: 'Mark Daily Attendance',
            upload_quizzes: 'Create New Quiz',
            upload_assignments: 'Create New Assignment',
            upload_marks: 'Upload Exam Marks',
            notify: 'Send Announcement'
        };
        
        let extraFields = '';
        if (currentView === 'mark_attendance') {
            extraFields = `
                <div class="table-responsive" style="margin-bottom: 1.5rem;">
                    <table>
                        <thead><tr><th>Student Name</th><th>Present</th><th>Absent</th></tr></thead>
                        <tbody>
                            <tr><td>Alex Johnson</td><td><input type="radio" name="att1" checked></td><td><input type="radio" name="att1"></td></tr>
                            <tr><td>Maria Garcia</td><td><input type="radio" name="att2" checked></td><td><input type="radio" name="att2"></td></tr>
                            <tr><td>James Wilson</td><td><input type="radio" name="att3"></td><td><input type="radio" name="att3" checked></td></tr>
                        </tbody>
                    </table>
                </div>
            `;
        } else if (currentView === 'upload_marks') {
            extraFields = `
                <div class="table-responsive" style="margin-bottom: 1.5rem;">
                    <table>
                        <thead><tr><th>Student Name</th><th>Marks Obtained</th><th>Total</th></tr></thead>
                        <tbody>
                            <tr><td>Alex Johnson</td><td><input type="number" class="form-control" style="width:80px" value="85"></td><td>100</td></tr>
                            <tr><td>Maria Garcia</td><td><input type="number" class="form-control" style="width:80px" value="78"></td><td>100</td></tr>
                        </tbody>
                    </table>
                </div>
            `;
        } else if (currentView === 'notify') {
             extraFields = `
                <div class="form-group">
                    <label>Message Content</label>
                    <textarea class="form-control" rows="4" required placeholder="Type announcement..."></textarea>
                </div>`;
        } else {
            extraFields = `
                <div class="form-group">
                    <label>Date / Deadline</label>
                    <input type="date" class="form-control" required>
                </div>
                <div class="form-group">
                    <label>Instructions / Description</label>
                    <textarea class="form-control" rows="3"></textarea>
                </div>`;
        }

        area.innerHTML = `
            <div class="glass-panel" style="padding: 2rem; max-width: 700px; margin: 0 auto;">
                <h3 style="margin-bottom: 1.5rem; text-align:center;">${titles[currentView]}</h3>
                <form onsubmit="event.preventDefault(); showToast('Submission successful!', 'success'); setTimeout(()=>navigate('overview'), 1500);">
                    <div class="form-group">
                        <label>Target Subject</label>
                        <select class="form-control" required>
                            <option value="">Select Subject...</option>
                            <option>Computer Networks</option>
                            <option>Database Systems</option>
                            <option>Operating Systems</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Title / Category</label>
                        <input type="text" class="form-control" placeholder="e.g., Mid-Term 1 / Internal Quiz" required>
                    </div>
                    ${extraFields}
                    <div style="margin-top: 2rem;">
                        <button type="submit" class="btn btn-primary w-full"><i class="fas fa-check-circle"></i> Save and Publish</button>
                    </div>
                </form>
            </div>
        `;
    }
}

// Start App
init();
