/* ==========================================================================
LOGIKA HALAMAN BLOG & FILTER KATEGORI + PAGINASI AUTOMATIS ========================================================================== */

function initBlogPage() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const blogCards = Array.from(document.querySelectorAll('.blog-card'));
  const paginationWrapper = document.getElementById('pagination-wrapper');

  if (blogCards.length === 0) return;

  const ITEMS_PER_PAGE = 4; // Jumlah artikel yang ingin ditampilkan per halaman
  let currentPage = 1;
  let currentCategory = 'all';

  // Fungsi untuk menyaring artikel yang sesuai kategori
  function getFilteredCards() {
    if (currentCategory === 'all') {
      return blogCards;
    }
    return blogCards.filter(card => card.getAttribute('data-category') === currentCategory);
  }

  // Fungsi untuk merender daftar artikel berdasarkan Halaman & Kategori
  function renderBlogFeed() {
    const filteredCards = getFilteredCards();
    const totalPages = Math.ceil(filteredCards.length / ITEMS_PER_PAGE);

    // Validasi agar currentPage tidak melebihi total halaman setelah difilter
    if (currentPage > totalPages) currentPage = 1;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Sembunyikan semua kartu terlebih dahulu
    blogCards.forEach(card => card.style.display = 'none');

    // Tampilkan hanya kartu di halaman aktif
    filteredCards.slice(startIndex, endIndex).forEach(card => {
      card.style.display = 'flex';
    });

    // Render Ulang Tombol Angka Paginasi
    renderPaginationControls(totalPages);
  }

  // Fungsi untuk membuat tombol angka 1, 2, 3 ...
  function renderPaginationControls(totalPages) {
    if (!paginationWrapper) return;
    paginationWrapper.innerHTML = '';

    // Jika artikel 4 atau kurang, sembunyikan tombol paginasi
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.type = 'button';
      pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
      pageBtn.textContent = i;

      pageBtn.addEventListener('click', () => {
        currentPage = i;
        renderBlogFeed();
        
        // Scroll halus ke atas daftar blog saat mengganti halaman
        const blogFeed = document.getElementById('blog-feed');
        if (blogFeed) {
          blogFeed.scrollIntoView({ behavior: 'smooth' });
        }
      });

      paginationWrapper.appendChild(pageBtn);
    }
  }

  // Event Listener pada Tab Kategori
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      currentCategory = button.getAttribute('data-category');
      currentPage = 1; // Reset kembali ke halaman 1 setiap ganti kategori
      renderBlogFeed();
    });
  });

  // Eksekusi Tampilan Pertama Kali
  renderBlogFeed();
}
