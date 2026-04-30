const userStatus = localStorage.getItem('status');
if (userStatus === 'accepted') {
    window.location.replace('dashboard.html');
}
else if (userStatus === 'rejected') {
    window.location.replace('rejected.html');
}
