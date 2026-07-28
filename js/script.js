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
/*==================================================
    SHIPPING COUNTDOWN
==================================================*/

const timerElement = document.getElementById("shippingTimer");
const dateElement = document.getElementById("shippingDate");

if (timerElement && dateElement) {

    const hari = [
        "Minggu",
        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu"
    ];

    const bulan = [
        "Januari","Februari","Maret","April","Mei","Juni",
        "Juli","Agustus","September","Oktober","November","Desember"
    ];

    function getNextShipping() {

        const now = new Date();

        let target = new Date(now);

        // Cari Kamis minggu ini
        let diff = (4 - now.getDay() + 7) % 7;

        target.setDate(now.getDate() + diff);
        target.setHours(0,0,0,0);

        // Batas order
        const cutoff = new Date(now);

        let diffCutoff = (3 - now.getDay() + 7) % 7;

        cutoff.setDate(now.getDate() + diffCutoff);
        cutoff.setHours(20,0,0,0);

        // Jika sudah lewat Rabu 20.00
        if (now > cutoff) {

            target.setDate(target.getDate() + 7);

        }

        return target;

    }

    function updateShippingCountdown() {

        const target = getNextShipping();

        const now = new Date();

        const distance = target - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerElement.innerHTML = `
            <span>${days}</span> Hari
            <span>${hours}</span> Jam
            <span>${minutes}</span> Menit
            <span>${seconds}</span> Detik
        `;

        dateElement.innerHTML =
            `Pengiriman: ${hari[target.getDay()]}, ${target.getDate()} ${bulan[target.getMonth()]} ${target.getFullYear()}`;

    }

    updateShippingCountdown();

    setInterval(updateShippingCountdown,1000);

}
