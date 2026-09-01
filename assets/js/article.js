// assets/js/article.js
document.addEventListener('DOMContentLoaded', () => {
  const btnOpen = document.getElementById('btn-open-share');
  const btnClose = document.getElementById('btn-close-share');
  const overlay = document.getElementById('share-overlay');
  const modal = document.getElementById('share-modal');

  const shareFb = document.getElementById('share-fb');
  const shareWa = document.getElementById('share-wa');
  const shareX = document.getElementById('share-x');
  const shareCopy = document.getElementById('share-copy');

  if (!btnOpen || !modal || !overlay) return;

  // Buka Modal Share
  btnOpen.addEventListener('click', () => {
    const currentUrl = encodeURIComponent(window.location.href);
    const articleTitle = encodeURIComponent(document.title);

    // Dynamic Link Sosmed
    if (shareFb) shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
    if (shareWa) shareWa.href = `https://api.whatsapp.com/send?text=${articleTitle}%20${currentUrl}`;
    if (shareX) shareX.href = `https://twitter.com/intent/tweet?text=${articleTitle}&url=${currentUrl}`;

    overlay.classList.add('active');
    modal.classList.add('active');
  });

  // Tutup Modal Share
  const closeModal = () => {
    overlay.classList.remove('active');
    modal.classList.remove('active');
  };

  if (btnClose) btnClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Salin Tautan Ke Clipboard
  if (shareCopy) {
    shareCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan artikel berhasil disalin!');
      closeModal();
    });
  }
});
