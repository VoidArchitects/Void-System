const page = window.location.pathname.split('/').pop();
const status = localStorage.getItem('status');

if (status === 'banned') {
    // Completely overwrite the page with a lockdown screen
    document.documentElement.innerHTML = `
        <style>
            body { background: #000; color: #f00; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: "Orbitron", monospace; text-align: center; text-shadow: 0 0 10px #f00; }
        </style>
        <div>[ SYSTEM LOCKED ]<br><span style="font-size: 1rem;">ACCESS PERMANENTLY REVOKED</span></div>
    `;
    window.stop(); // Stops the rest of the website from loading
} 
else if (status === 'accepted' && page !== 'dashboard.html') {
    location.replace('dashboard.html'); // Send straight to dashboard
} 
else if (status === 'rejected' && page !== 'rejected.html') {
    location.replace('rejected.html'); // Send straight to rejected page
}
