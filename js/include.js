document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll("[data-include]");
    
    let promises = Array.from(elements).map(el => {
        const file = el.getAttribute("data-include");
        return fetch(file)
            .then(response => {
                if (response.ok) return response.text();
                throw new Error("Gagal memuat file: " + file);
            })
            .then(data => {
                el.innerHTML = data;
                el.removeAttribute("data-include");
            });
    });

    // Memicu event setelah seluruh komponen (header, footer, dll) selesai dimuat
    Promise.all(promises).then(() => {
        const event = new Event('componentsLoaded');
        document.dispatchEvent(event);
    }).catch(error => {
        console.error("Error:", error);
    });
});
