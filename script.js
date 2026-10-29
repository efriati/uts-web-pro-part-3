/* =========================================================
   SCRIPT PORTOFOLIO - Efriati Annisa Hakim
   Fitur: menu mobile, menu aktif, progress bar skill,
          placeholder gambar, validasi form, tampil data form
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initMobileMenu();
  initActiveNavLink();
  initSkillBars();
  initImagePlaceholders();
  initProjectLinks();
  initContactForm();
});

/* ---------------------------------------------------------
   1. Menu navigasi untuk layar HP
   --------------------------------------------------------- */
function initMobileMenu() {
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  var links = document.querySelectorAll(".nav-link");

  if (!toggle || !menu) {
    return;
  }

  function closeMenu() {
    menu.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Buka menu navigasi");
  }

  toggle.addEventListener("click", function () {
    var isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
  });

  // Tutup menu setelah salah satu link diklik
  links.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Tutup menu jika layar diperbesar kembali
  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) {
      closeMenu();
    }
  });
}

/* ---------------------------------------------------------
   2. Tandai menu yang sedang aktif saat halaman di-scroll
   --------------------------------------------------------- */
function initActiveNavLink() {
  var links = document.querySelectorAll(".nav-link");
  var sections = document.querySelectorAll("main section[id]");

  if (!("IntersectionObserver" in window) || sections.length === 0) {
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) {
            var isMatch = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("active", isMatch);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

/* ---------------------------------------------------------
   3. Progress bar skill
   Persentase diambil dari atribut data-level di index.html
   (ubah angka 0 - 100 pada setiap <li class="skill-item">)
   --------------------------------------------------------- */
function initSkillBars() {
  var items = document.querySelectorAll(".skill-item");

  if (items.length === 0) {
    return;
  }

  function fillBar(item) {
    var level = parseInt(item.getAttribute("data-level"), 10);

    if (isNaN(level)) {
      level = 0;
    }
    level = Math.max(0, Math.min(100, level));

    var fill = item.querySelector(".progress-fill");
    var percent = item.querySelector(".skill-percent");
    var bar = item.querySelector(".progress");

    if (fill) {
      fill.style.width = level + "%";
    }
    if (percent) {
      percent.textContent = level + "%";
    }
    if (bar) {
      bar.setAttribute("aria-valuenow", String(level));
    }
  }

  // Tampilkan teks persentase lebih dulu, lebar bar dianimasikan saat terlihat
  items.forEach(function (item) {
    var percent = item.querySelector(".skill-percent");
    var level = parseInt(item.getAttribute("data-level"), 10) || 0;
    if (percent) {
      percent.textContent = level + "%";
    }
  });

  if (!("IntersectionObserver" in window)) {
    items.forEach(fillBar);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          fillBar(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  items.forEach(function (item) {
    observer.observe(item);
  });
}

/* ---------------------------------------------------------
   4. Placeholder gambar
   Jika file gambar belum ada, tampilkan kotak placeholder.
   Jika gambar sudah ada, placeholder otomatis tertutup.
   --------------------------------------------------------- */
function initImagePlaceholders() {
  var images = document.querySelectorAll(".photo-img, .project-img");

  images.forEach(function (img) {
    function markMissing() {
      img.classList.add("img-missing");
    }

    img.addEventListener("error", markMissing);

    // Jika gambar sudah selesai dicoba dimuat sebelum script berjalan
    if (img.complete && img.naturalWidth === 0) {
      markMissing();
    }
  });
}

/* ---------------------------------------------------------
   5. Tautan GitHub project
   Selama tautan belum diisi (data-placeholder="true"),
   klik tidak membuka apa pun dan menampilkan petunjuk.
   --------------------------------------------------------- */
function initProjectLinks() {
  var links = document.querySelectorAll(".project-link");

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      if (link.getAttribute("data-placeholder") === "true") {
        event.preventDefault();

        var hint = link.parentElement.querySelector(".link-hint");
        if (hint) {
          hint.textContent = "Isi href tautan ini di index.html setelah repository GitHub dibuat.";
        }
      }
    });
  });
}

/* ---------------------------------------------------------
   6. Form kontak: validasi + tampilkan data di bawah form
   --------------------------------------------------------- */
function initContactForm() {
  var form = document.getElementById("contact-form");

  if (!form) {
    return;
  }

  var inputNama = document.getElementById("input-nama");
  var inputEmail = document.getElementById("input-email");
  var inputPesan = document.getElementById("input-pesan");

  var errorNama = document.getElementById("error-nama");
  var errorEmail = document.getElementById("error-email");
  var errorPesan = document.getElementById("error-pesan");

  var formStatus = document.getElementById("form-status");
  var resultBox = document.getElementById("form-result");
  var successMessage = document.getElementById("success-message");

  var resultNama = document.getElementById("result-nama");
  var resultEmail = document.getElementById("result-email");
  var resultPesan = document.getElementById("result-pesan");

  // Format email: ada teks, tanda @, domain, titik, dan akhiran minimal 2 huruf
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, errorElement, message) {
    errorElement.textContent = message;
    input.parentElement.classList.add("has-error");
    input.setAttribute("aria-invalid", "true");
  }

  function clearError(input, errorElement) {
    errorElement.textContent = "";
    input.parentElement.classList.remove("has-error");
    input.removeAttribute("aria-invalid");
  }

  function clearAllErrors() {
    clearError(inputNama, errorNama);
    clearError(inputEmail, errorEmail);
    clearError(inputPesan, errorPesan);
    formStatus.hidden = true;
    formStatus.textContent = "";
  }

  // Hapus pesan kesalahan saat pengguna mulai memperbaiki isian
  inputNama.addEventListener("input", function () {
    clearError(inputNama, errorNama);
  });
  inputEmail.addEventListener("input", function () {
    clearError(inputEmail, errorEmail);
  });
  inputPesan.addEventListener("input", function () {
    clearError(inputPesan, errorPesan);
  });

  function validateForm() {
    var nama = inputNama.value.trim();
    var email = inputEmail.value.trim();
    var pesan = inputPesan.value.trim();
    var isValid = true;
    var firstInvalid = null;

    clearAllErrors();

    if (nama === "") {
      setError(inputNama, errorNama, "Nama tidak boleh kosong. Silakan isi nama Anda.");
      isValid = false;
      firstInvalid = firstInvalid || inputNama;
    }

    if (email === "") {
      setError(inputEmail, errorEmail, "Email tidak boleh kosong. Silakan isi email Anda.");
      isValid = false;
      firstInvalid = firstInvalid || inputEmail;
    } else if (!emailPattern.test(email)) {
      setError(inputEmail, errorEmail, "Format email tidak valid. Contoh yang benar: nama@email.com");
      isValid = false;
      firstInvalid = firstInvalid || inputEmail;
    }

    if (pesan === "") {
      setError(inputPesan, errorPesan, "Pesan tidak boleh kosong. Silakan tulis pesan Anda.");
      isValid = false;
      firstInvalid = firstInvalid || inputPesan;
    }

    if (!isValid) {
      formStatus.textContent = "Pengiriman gagal. Mohon periksa kembali isian yang ditandai berwarna merah.";
      formStatus.hidden = false;
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }

    return {
      valid: isValid,
      data: { nama: nama, email: email, pesan: pesan }
    };
  }

  form.addEventListener("submit", function (event) {
    // Mencegah halaman dimuat ulang
    event.preventDefault();

    var result = validateForm();

    if (!result.valid) {
      resultBox.hidden = true;
      return;
    }

    // Tampilkan data memakai textContent (aman dari penyisipan HTML)
    resultNama.textContent = result.data.nama;
    resultEmail.textContent = result.data.email;
    resultPesan.textContent = result.data.pesan;

    successMessage.textContent =
      "Terima kasih, " + result.data.nama + "! Pesan Anda berhasil dikirim.";

    resultBox.hidden = false;
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Kosongkan form agar siap dipakai lagi
    form.reset();
  });
}