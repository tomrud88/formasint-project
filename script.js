const openMenuBtn = document.getElementById("open-menu");
const closeMenuBtn = document.getElementById("menu-close-mobile");
const mobileMenu = document.getElementById("mobile-menu");

openMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("hidden");
});

closeMenuBtn.addEventListener("click", () => {
  console.log("menu should hide");
  mobileMenu.classList.add("hidden");
});

const mobileMenuLinks = document.querySelectorAll(".menu-list a");

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", function () {
    mobileMenu.classList.add("hidden");
  });
});

const heroImg = document.getElementById("responsive-hero");

const mediaQuery = window.matchMedia("(max-width: 768px)");

function updateHeroImage(e) {
  if (e.matches) {
    heroImg.src = "images/HERO PHOTO SMALL.png";
  } else {
    heroImg.src = "images/HERO PHOTO.png";
  }
}

updateHeroImage(mediaQuery);

mediaQuery.addEventListener("change", updateHeroImage);

const scrollInner = document.getElementById("scrollInner");

function scrollNext() {
  const card = scrollInner.querySelector(".product-card");
  const cardWidth = card.offsetWidth + 24;
  scrollInner.style.transition = "transform 0.5s ease";
  scrollInner.style.transform = `translateX(-${cardWidth}px)`;

  setTimeout(() => {
    scrollInner.appendChild(scrollInner.children[0]);
    scrollInner.style.transition = "none";
    scrollInner.style.transform = "translateX(0)";
  }, 500);
}

const originalOptions = [14, 24, 36];

function filterOptions(select) {
  const currentValue = parseInt(select.value);
  select.innerHTML = "";

  originalOptions.forEach((val) => {
    if (val === currentValue) {
      select.innerHTML += `<option value="${val}" selected hidden>${val}</option>`;
    } else {
      select.innerHTML += `<option value="${val}">${val}</option>`;
    }
  });
}

const grid = document.getElementById("products-listing-grid");
const quantitySelect = document.getElementById("quantity");
const popupBackground = document.getElementById("popupBackground");
const popupImage = document.getElementById("popupImage");
const popupId = document.getElementById("popupId");
const popupClose = document.getElementById("popupClose");

let pageSize = parseInt(quantitySelect.value);
let currentPage = 1;
let isLoading = false;
let bannerInserted = false;

function createProductCard(product) {
  const div = document.createElement("div");
  div.className = "listing-card";
  div.innerHTML = `
       <div class="image-wrapper">
        <span class="product-id">ID: ${product.id
          .toString()
          .padStart(2, "0")}</span>
        <img class="listing-img" src="${product.image}" alt="Product">
        </div>
      `;
  div.addEventListener("click", () => {
    popupImage.src = product.image;
    popupId.textContent = `ID: ${product.id.toString().padStart(2, "0")}`;
    popupBackground.classList.add("active");
  });
  return div;
}

popupClose.addEventListener("click", () => {
  popupBackground.classList.remove("active");
});

popupBackground.addEventListener("click", (e) => {
  if (e.target === popupBackground) {
    popupBackground.classList.remove("active");
  }
});

function createBanner() {
  const banner = document.createElement("div");
  banner.className = "banner";
  banner.innerHTML = `
        <div class='banner-content'>
        <div class='banner-header'>
        <h3 id='logo-banner' >FORMA'SINT.</h3>
        <p id='title-banner' >You’ll look and feel like the champion.</p>
        </div>
        <button><span class='btn-text'>Check this out</span><img src="images/RIGHT ARROW.svg" alt="arrow"></button>
        </div>
      `;
  return banner;
}

async function loadProducts() {
  if (isLoading) return;
  isLoading = true;

  try {
    const res = await fetch(
      `https://brandstestowy.smallhost.pl/api/random?pageNumber=${currentPage}&pageSize=${pageSize}`
    );
    const json = await res.json();
    const products = json.data;

    const insertIndex = window.innerWidth < 768 ? 4 : 5;
    let currentIndexInGrid = grid.children.length;

    products.forEach((product, index) => {
      if (!bannerInserted && currentIndexInGrid === insertIndex) {
        grid.appendChild(createBanner());
        bannerInserted = true;
        currentIndexInGrid++;
      }

      const card = createProductCard(product);
      grid.appendChild(card);
      currentIndexInGrid++;
    });

    currentPage++;
    isLoading = false;
  } catch (error) {
    console.error("Error loading products:", error);
    isLoading = false;
  }
}

quantitySelect.addEventListener("change", () => {
  pageSize = parseInt(quantitySelect.value);
  currentPage = 1;
  grid.innerHTML = "";
  bannerInserted = false;
  loadProducts();
});

let previousScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = Math.ceil(window.scrollY);

  if (scrolled >= scrollable) {
    loadProducts();
  }
});

loadProducts();
