// --- SCRIPT COUNTDOWN TIMER KE HARI RABU PKL 24.00 ---
function getNextWednesdayMidnight() {
    const now = new Date();
    const resultDate = new Date(now.getTime());
    
    // Hari Rabu adalah hari ke-3 (Minggu = 0, Senin = 1, Selasa = 2, Rabu = 3)
    let dayOfWeek = now.getDay();
    let daysUntilWednesday = (3 - dayOfWeek + 7) % 7;
    
    // Jika hari ini sudah hari Rabu, tapi sudah lewat dari jam 24.00 (artinya sudah Kamis), targetkan ke Rabu minggu depan
    if (daysUntilWednesday === 0 && (now.getHours() > 0 || now.getMinutes() > 0 || now.getSeconds() > 0)) {
        // Cek jika kita ingin hitung sampai rabu minggu depan ketika hari rabu hampir habis
        // Untuk amannya, kita set target ke hari Rabu terdekat berikutnya
        daysUntilWednesday = 7;
    }
    
    resultDate.setDate(now.getDate() + daysUntilWednesday);
    resultDate.setHours(24, 0, 0, 0); // Jam 24.00 / 00:00 hari Kamis dini hari
    
    return resultDate;
}

let countDownDate = getNextWednesdayMidnight().getTime();

let x = setInterval(function() {
    let now = new Date().getTime();
    let distance = countDownDate - now;

    // Kalkulasi hari, jam, menit, dan detik
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Masukkan ke elemen HTML jika elemennya ada
    document.getElementById("days").innerHTML = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerHTML = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerHTML = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerHTML = seconds < 10 ? "0" + seconds : seconds;

    // Jika waktu habis
    if (distance < 0) {
        clearInterval(x);
        document.querySelector(".countdown-container").innerHTML = "<p style='color: #16a34a; font-weight: 700;'>Pre-Order Ditutup! Sesi pengiriman berikutnya segera dibuka.</p>";
    }
}, 1000);
