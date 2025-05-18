const openMenuBtn = document.getElementById("open-menu");
const closeMenuBtn = document.getElementById("menu-close-mobile");
const mobileMenu = document.getElementById("mobile-menu");
const bgShadow = document.querySelector('.mobile-menu__overlay')
const mobileMenuNav = document.querySelector('.mobile-menu__nav')

openMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("mobile-menu--hidden");
  mobileMenu.classList.add('mobile-menu--active')
});


function closeMobileMenu() {
  mobileMenu.classList.remove('mobile-menu--active');
  mobileMenu.classList.add('mobile-menu--hidden');
}
closeMenuBtn.addEventListener("click", closeMobileMenu);
bgShadow.addEventListener('click', closeMobileMenu);

mobileMenuNav.addEventListener('click', (event) => {
  const clickedElement = event.target;
  if (clickedElement.classList.contains('mobile-menu__nav-item')) {
    closeMobileMenu();
  }
})

const heroImg = document.getElementById("responsive-hero");

const mediaQuery = window.matchMedia("(max-width: 768px)");

function updateHeroImage(e) {
  if (e.matches) {
    heroImg.src = "images/HERO PHOTO SMALL.webp";
  } else {
    heroImg.src = "images/HERO PHOTO.webp";
  }
}

updateHeroImage(mediaQuery);

mediaQuery.addEventListener("change", updateHeroImage);

const scrollInner = document.getElementById("scrollInner");
const scrollWrapper = document.querySelector(
  ".featured-products__scroll-wrapper"
);
const progressBar = document.querySelector(".featured-products__progress-bar");
const sliderNavi = document.querySelector(".featured-products__slider-nav");


let productCards = [];
let currentIndex = 0;
const cardGap = 24;

function updateProgressBar() {
  productCards = scrollInner.querySelectorAll(".featured-products__card");
  const totalCards = productCards.length; // Całkowita liczba produktów
  if (totalCards === 0) return;

  const totalGapWidth = cardGap * (totalCards - 1);
  const availableWidth = sliderNavi.offsetWidth - totalGapWidth;

  const progressWidth = availableWidth / totalCards;
  progressBar.style.width = `${progressWidth}px`;

  const offset = currentIndex * (progressWidth + cardGap);
  progressBar.style.transform = `translateX(${offset}px)`;
}

function scrollNext() {
  const card = scrollInner.querySelector(".featured-products__card");
  if (!card) return;
  const cardWidth = card.offsetWidth + cardGap;
  scrollInner.style.transition = "transform 0.5s ease";
  scrollInner.style.transform = `translateX(-${cardWidth}px)`;

  setTimeout(() => {
    scrollInner.appendChild(scrollInner.children[0]);
    scrollInner.style.transition = "none";
    scrollInner.style.transform = "translateX(0)";

     const totalCards = productCards.length;
     currentIndex++;
     if (currentIndex >= totalCards) {
       currentIndex = 0;
     }
     updateProgressBar();
  }, 500);
}

updateProgressBar();

window.addEventListener("resize", () => {
  updateProgressBar();
});

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
  div.className = "product-listing__card";
  div.innerHTML = `
       <div class="product-listing__card-image-wrapper">
        <span class="product-listing__product-id">ID: ${product.id
          .toString()
          .padStart(2, "0")}</span>
        <img class="product-listing__image" src="${
          product.image
        }" alt="Product">
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
  banner.className = "product-listing__banner";
  banner.innerHTML = `
        <div class='product-listing__banner-content'>
        <div class='product-listing__banner-header'>
        <h3 id='product-listing__banner-logo' >FORMA'SINT.</h3>
        <p id='product-listing__banner-title' >You’ll look and feel like the champion.</p>
        </div>
        <button class="product-listing__banner-button"><span class='product-listing__banner-button-text'>Check this out</span><img src="images/RIGHT ARROW.svg" alt="arrow"></button>
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
};



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

function debounce(func, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay)
  }
}

function repositionBanner() {
  const banner = grid.querySelector('.product-listing__banner');
  if (!banner) return;

  const insertIndex = window.innerWidth < 1420 ? 4 : 5;
  const currentIndex = Array.from(grid.children).indexOf(banner);

  if (currentIndex === insertIndex) return;

  grid.removeChild(banner);

  const newPosition = grid.children[insertIndex]
  if (newPosition) {
    grid.insertBefore(banner, newPosition);
  } else {
    grid.appendChild(banner)
  }
}

window.addEventListener('resize', debounce(repositionBanner, 200))

loadProducts();
