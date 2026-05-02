//text message delay system
const msg = document.getElementById('message');
const acceptBtn = document.getElementById('accept');
const refuseBtn = document.getElementById('refuse');

if (msg && acceptBtn && refuseBtn) {
    setTimeout(() => {
        msg.innerHTML = "[you have completed all the necessary requirements of the secret quest '<span style=\"color: var(--text-quest);\">courage of the weak</span>']";

        let autoAdvanceTimeout;

        // Add event listener to wait for user interaction to show next message
        const showNextMessage = () => {
            clearTimeout(autoAdvanceTimeout);
            msg.innerHTML = "[you have earned the right to become a <span style=\"color: var(--text-accept);\">player</span>. will you accept?]";
            document.removeEventListener('click', showNextMessage);

            // Show buttons 3 seconds after the second message appears
            setTimeout(() => {
                acceptBtn.innerHTML = "accept";
                refuseBtn.innerHTML = "refuse";
                acceptBtn.style.display = "block";
                refuseBtn.style.display = "block";
            }, 3000);
        };

        // Delay adding the click listener slightly so the user doesn't accidentally skip the first message
        setTimeout(() => {
            document.addEventListener('click', showNextMessage);

            // Auto-advance if the user doesn't click within 10 seconds
            autoAdvanceTimeout = setTimeout(() => {
                showNextMessage();
            }, 10000);
        }, 500);

    }, 1500);

    //button click event listener

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('status', 'accepted');
        window.location.replace('dashboard.html');
    });

    refuseBtn.addEventListener('click', () => {
        localStorage.setItem('status', 'rejected');
        window.location.replace('rejected.html');
    });
}

// Logic for rejected.html
const reAcceptBtn = document.getElementById('re-accept');
const finalRefuseBtn = document.getElementById('final-refuse');

if (msg && reAcceptBtn && finalRefuseBtn) {
    setTimeout(() => {
        msg.innerHTML = "[your previous refusal has been noted. however, the system has detected a remnant of potential.]";

        let autoAdvanceTimeout;

        const showNextMessage = () => {
            clearTimeout(autoAdvanceTimeout);
            msg.innerHTML = "[this is your final opportunity. will you reconsider and become a <span style=\"color: var(--text-accept);\">player</span>?]";
            document.removeEventListener('click', showNextMessage);

            setTimeout(() => {
                reAcceptBtn.innerHTML = "accept";
                reAcceptBtn.style.display = "block";
                finalRefuseBtn.innerHTML = "refuse";
                finalRefuseBtn.style.display = "block";
            }, 3000);
        };

        setTimeout(() => {
            document.addEventListener('click', showNextMessage);

            autoAdvanceTimeout = setTimeout(() => {
                showNextMessage();
            }, 10000);
        }, 500);

    }, 1500);

    reAcceptBtn.addEventListener('click', () => {
        localStorage.setItem('status', 'accepted');
        window.location.replace('dashboard.html');
    });

    finalRefuseBtn.addEventListener('click', () => {
        localStorage.setItem('status', 'banned');
        location.reload();
    });
}
