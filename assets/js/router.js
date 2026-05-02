const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const userStatus = localStorage.getItem('status');

if (userStatus === 'banned') {
    document.documentElement.innerHTML = '<head><title>SYSTEM LOCKED</title><style>body{background-color:#000;color:#f00;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;font-family:"Orbitron", monospace;font-size:2rem;text-align:center;text-shadow: 0 0 10px #f00;}</style></head><body><div>[ SYSTEM LOCKED ]<br><span style="font-size: 1rem;">ACCESS PERMANENTLY REVOKED</span></div></body>';
    if(window.stop) window.stop();
} else if (userStatus === 'accepted' && currentPage !== 'dashboard.html') {
    window.location.replace('dashboard.html');
} else if (userStatus === 'rejected' && currentPage !== 'rejected.html') {
    window.location.replace('rejected.html');
}
