const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");

const form = document.getElementById("contact-form");
const statusText = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

const revealElements = document.querySelectorAll(".reveal");
const parallaxElements = document.querySelectorAll("[data-parallax]");

menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");

    menuButton.textContent =
        mobileMenu.classList.contains("hidden") ? "☰" : "✕";
});

mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        menuButton.textContent = "☰";
    });
});

form.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.innerText = "Sending...";
    
    const data = new FormData(event.target);
    
    try {
        const response = await fetch(event.target.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            statusText.classList.remove("hidden", "text-red-500");
            statusText.classList.add("text-green-400");
            statusText.innerText = "Pesan Anda berhasil terkirim! Terima kasih.";
            form.reset();
        } else {
            const result = await response.json();
            statusText.classList.remove("hidden", "text-green-400");
            statusText.classList.add("text-red-500");
            statusText.innerText = result.errors ? result.errors.map(e => e.message).join(", ") : "Gagal mengirim pesan.";
        }
    } catch (error) {
        statusText.classList.remove("hidden", "text-green-400");
        statusText.classList.add("text-red-500");
        statusText.innerText = "Terjadi kesalahan koneksi. Silakan coba lagi.";
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Send Message";
    }
});

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});

function updateParallax() {
    if (window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        parallaxElements.forEach((element) => {
            element.style.transform = "";
        });

        return;
    }

    parallaxElements.forEach((element) => {
        const speed = Number(element.dataset.parallax);
        const rect = element.getBoundingClientRect();

        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) {
            return;
        }

        const elementCenter = rect.top + rect.height / 2;
        const screenCenter = window.innerHeight / 2;

        const offset = (elementCenter - screenCenter) * speed;

        element.style.transform = `translateY(${offset}px)`;
    });
}

let parallaxTicking = false;

window.addEventListener("scroll", () => {
    if (!parallaxTicking) {
        window.requestAnimationFrame(() => {
            updateParallax();
            parallaxTicking = false;
        });

        parallaxTicking = true;
    }
});

window.addEventListener("resize", updateParallax);

updateParallax();