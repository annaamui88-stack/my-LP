document.addEventListener("DOMContentLoaded", function () {
    // Ambil semua tombol pertanyaan
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(question => {
        question.addEventListener("click", function () {
            // Ambil div .faq-item yang membungkus tombol ini
            const currentItem = this.parentElement;

            // Tutup item lain jika ada yang sedang terbuka (opsional, agar rapi)
            document.querySelectorAll(".faq-item").forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove("active");
                }
            });

            // Buka atau tutup item yang sedang diklik
            currentItem.classList.toggle("active");
        });
    });
});
