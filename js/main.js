document.addEventListener('componentsLoaded', function () {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    // Pastikan menu tertutup saat halaman dimuat
    if (navMenu) {
        navMenu.classList.remove('active');
    }

    if (menuToggle && navMenu) {

        // Buka / tutup menu hamburger
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
        });

        // Tutup menu setelah memilih menu
        const navLinks = navMenu.querySelectorAll('.nav-link');

        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
            });
        });
    }
});
