const nav = document.querySelector(".primary-navigation");
const navToggle = document.querySelector(".mobile-nav-toggle");
const navItems = document.querySelectorAll(".nav-item");
const header = document.querySelector("header");

function populateTechnology(
  technology,
  technologyName,
  technologyDescription,
  portrait,
  landscape
) {
  technologyName.textContent = technology.name;
  technologyDescription.textContent = technology.description;
  portrait.srcset = technology.images.portrait;
  landscape.src = technology.images.landscape;
}

function loadTechnology(data) {
  const numberContainer = document.querySelectorAll(".number-button");
  const technologyName = document.getElementById("technology-name");
  const technologyDescription = document.getElementById(
    "technology-description"
  );
  const portrait = document.getElementById("portrait");
  const landscape = document.getElementById("landscape");

  numberContainer.forEach((number) => {
    number.addEventListener("click", () => {
      numberContainer.forEach((n) => n.setAttribute("aria-selected", false));
      number.setAttribute("aria-selected", true);
      const technology = data[parseInt(number.dataset["number"])];
      populateTechnology(
        technology,
        technologyName,
        technologyDescription,
        portrait,
        landscape
      );
    });
  });
}

function populateCrew(
  crew,
  crewRole,
  crewName,
  crewDescription,
  crewWebp,
  crewPng
) {
  crewRole.textContent = crew.role;
  crewName.textContent = crew.name;
  crewDescription.textContent = crew.bio;
  crewWebp.srcset = crew.images.webp;
  crewPng.srcset = crew.images.png;
}

function loadCrew(data) {
  const roleContainers = document.querySelectorAll(".role-container");
  const crewRole = document.getElementById("crew-role");
  const crewName = document.getElementById("crew-name");
  const crewDescription = document.getElementById("crew-description");
  const crewWebp = document.getElementById("crew-webp");
  const crewPng = document.getElementById("crew-png");

  roleContainers.forEach((roleContainer) => {
    roleContainer.addEventListener("click", () => {
      roleContainers.forEach((role) =>
        role.setAttribute("aria-selected", false)
      );
      roleContainer.setAttribute("aria-selected", true);
      const role = roleContainer.querySelector(".role").textContent;
      const crew = data.find((e) => e.role === role);
      populateCrew(
        crew,
        crewRole,
        crewName,
        crewDescription,
        crewWebp,
        crewPng
      );
    });
  });
}

function populateDestination(
  planet,
  webpImage,
  pngImage,
  planetName,
  planetDescription,
  planetDistance,
  planetTime
) {
  webpImage.srcset = planet.images.webp;
  pngImage.src = planet.images.png;
  planetName.textContent = planet.name;
  planetDescription.textContent = planet.description;
  planetDistance.textContent = planet.distance;
  planetTime.textContent = planet.travel;
}

function loadDestination(data) {
  const tabPlanet = document.querySelectorAll(".tab-planet");
  const webpImage = document.getElementById("webp-image");
  const pngImage = document.getElementById("png-image");
  const planetName = document.getElementById("planet-name");
  const planetDescription = document.getElementById("planet-description");
  const planetDistance = document.getElementById("planet-distance");
  const planetTime = document.getElementById("planet-time");

  tabPlanet.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabPlanet.forEach((tab) => tab.setAttribute("aria-selected", "false"));
      tab.setAttribute("aria-selected", "true");
      const planet = data.find(
        (e) => e.name === tab.id.charAt(0).toUpperCase() + tab.id.slice(1)
      );
      if (planet) {
        populateDestination(
          planet,
          webpImage,
          pngImage,
          planetName,
          planetDescription,
          planetDistance,
          planetTime
        );
      }
    });
  });
}

async function loadContent(page) {
  document.body.className = page;
  try {
    const response = await fetch(`partials/${page}.html`);
    if (!response.ok) throw new Error("Page not found");
    const html = await response.text();
    header.insertAdjacentHTML("afterend", html);
    if (page !== "home") {
      const answer = await fetch("data.json");
      if (!answer.ok) throw new Error("Page not found");
      const data = await answer.json();
      if (page === "destination") loadDestination(data.destinations);
      else if (page === "crew") loadCrew(data.crew);
      else loadTechnology(data.technology);
    }
  } catch (e) {
    header.insertAdjacentHTML(
      "afterend",
      `<p>Sorry, the content could not be loaded.</p>`
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadContent("home").then(() => addExploreBtnListener());

  navToggle.addEventListener("click", () => {
    const visibility = nav.getAttribute("data-visible");
    if (visibility === "false") {
      nav.setAttribute("data-visible", true);
      navToggle.setAttribute("aria-expanded", true);
    } else {
      nav.setAttribute("data-visible", false);
      navToggle.setAttribute("aria-expanded", false);
    }
  });

  navItems.forEach((navItem) => {
    navItem.addEventListener("click", () => {
      navItems.forEach((item) => item.classList.remove("active"));
      navItem.classList.add("active");
      const page = navItem.classList.contains("home-page")
        ? "home"
        : navItem.classList.contains("destination-page")
        ? "destination"
        : navItem.classList.contains("crew-page")
        ? "crew"
        : "technology";
      const existingContent = header.nextElementSibling;
      if (
        existingContent &&
        !existingContent.classList.contains("primary-navigation")
      ) {
        existingContent.remove();
      }
      loadContent(page).then(() => addExploreBtnListener());
    });
  });

  function addExploreBtnListener() {
    const exploreBtn = document.getElementById("explore");
    if (exploreBtn) {
      exploreBtn.addEventListener("click", () => {
        const destinationTab = document.querySelector(".destination-page");
        if (destinationTab) {
          destinationTab.click();
        }
      });
    }
  }
});
