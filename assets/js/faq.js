/**
 * FAQ Accordion Script - Anna Amui
 * Dipakai bersama untuk index.html & tentang.html
 */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
});

function initFaqAccordion() {
  const faqContainers = document.querySelectorAll('.faq-container');

  // Jika tidak ada elemen .faq-container di halaman ini, hentikan fungsi
  if (!faqContainers.length) return;

  faqContainers.forEach(container => {
    const faqItems = container.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Tutup item lain HANYA di dalam container yang sama
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const icon = otherItem.querySelector('.faq-icon');
          if (icon) icon.textContent = '+';
        });

        // Buka item yang sedang diklik (jika sebelumnya tertutup)
        if (!isActive) {
          item.classList.add('active');
          const icon = item.querySelector('.faq-icon');
          if (icon) icon.textContent = '−';
        }
      });
    });
  });
}
