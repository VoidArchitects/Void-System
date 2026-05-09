const page = window.location.pathname.split('/').pop();
const currentStatus = localStorage.getItem('status');

if (currentStatus === 'banned' && page !== 'banned.html') {
    location.replace('banned.html'); // Send straight to banned page
} 
else if (currentStatus === 'accepted' && page !== 'dashboard.html') {
    location.replace('dashboard.html'); // Send straight to dashboard
} 
else if (currentStatus === 'rejected' && page !== 'rejected.html') {
    location.replace('rejected.html'); // Send straight to rejected page
}
