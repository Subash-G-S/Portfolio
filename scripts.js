document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".edu-card");

    cards.forEach(card => {
        card.addEventListener("click", () => {

            const isOpen = card.classList.contains("active");

            // Close all
            cards.forEach(c => {
                c.classList.remove("active");
                const d = c.querySelector(".edu-details");
                if (d) d.style.maxHeight = null;
            });

            // If already open → stop
            if (isOpen) return;

            // Open clicked
            card.classList.add("active");

            const details = card.querySelector(".edu-details");
            if (details) {
                details.style.maxHeight = details.scrollHeight + "px";
            }
        });
    });
});