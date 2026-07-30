document.addEventListener('DOMContentLoaded', () => {

    // 1. Navigation Drawer Toggle & Presisi Mobile Header
    const hamburger = document.getElementById('hamburger');
    const navDrawer = document.getElementById('navDrawer');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navDrawer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navDrawer.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navDrawer.classList.remove('active');
            });
        });
    }

    // 2. FAQ Accordion Single Open
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    // 3. Lightweight Custom AOS (Scroll Animation)
    const aosElements = document.querySelectorAll('[data-aos]');

    const aosObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    aosElements.forEach(el => aosObserver.observe(el));

    // 4. Button Ripple Animation Effect
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const x = e.clientX - e.target.offsetLeft;
            const y = e.clientY - e.target.offsetTop;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
});
/* ==========================================
   COUNTDOWN TIMER SCRIPT (AAN EXPRESS)
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    function getNextDeadline() {
        const now = new Date();
        const currentDay = now.getDay(); // 0: Minggu, 1: Senin, ..., 3: Rabu
        
        let daysUntilWednesday = (3 - currentDay + 7) % 7;
        
        if (daysUntilWednesday === 0 && (now.getHours() > 23 || (now.getHours() === 23 && now.getMinutes() >= 59))) {
            daysUntilWednesday = 7;
        }

        const nextWednesday = new Date(now);
        nextWednesday.setDate(now.getDate() + daysUntilWednesday);
        nextWednesday.setHours(23, 59, 59, 999);

        return nextWednesday;
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const deadline = getNextDeadline().getTime();
        const diff = deadline - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.textContent = days;
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});
