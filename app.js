(() => {
  "use strict";

  const STORAGE_ROUTES = "sunuTrajetRoutes";
  const STORAGE_FAVORITES = "sunuTrajetFavorites";
  const sourceData = window.SUNU_DATA;

  const state = {
    routes: loadRoutes(),
    favorites: new Set(loadJSON(STORAGE_FAVORITES, [])),
    lastResults: [],
    lastSearch: null,
    installPrompt: null
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn(`Impossible de lire ${key}`, error);
      return fallback;
    }
  }

  function loadRoutes() {
    const stored = loadJSON(STORAGE_ROUTES, null);
    if (Array.isArray(stored) && stored.length) return stored;
    const seeded = structuredClone(sourceData.routes);
    localStorage.setItem(STORAGE_ROUTES, JSON.stringify(seeded));
    return seeded;
  }

  function escapeHTML(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatPrice(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return "Tarif à confirmer";
    return `${new Intl.NumberFormat("fr-FR").format(numeric)} FCFA`;
  }

  function formatSourceDate(isoDate) {
    const date = new Date(`${isoDate}T12:00:00`);
    return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
  }

  function phoneHref(phone = "") {
    return `tel:${String(phone).replace(/[^+\d]/g, "")}`;
  }

  function populateCities() {
    const cities = [...new Set([...sourceData.cities, ...state.routes.flatMap(route => [route.from, route.to])])]
      .sort((a, b) => a.localeCompare(b, "fr"));
    const options = cities.map(city => `<option value="${escapeHTML(city)}">${escapeHTML(city)}</option>`).join("");
    $("#fromSelect").innerHTML = options;
    $("#toSelect").innerHTML = options;
    $("#fromSelect").value = "Dakar";
    $("#toSelect").value = "Touba";
  }

  function setToday() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    $("#dateInput").value = `${yyyy}-${mm}-${dd}`;
    $("#dateInput").min = `${yyyy}-${mm}-${dd}`;
  }

  function renderPopular() {
    const ids = ["dakar-touba", "dakar-thies", "dakar-saint-louis", "dakar-kaolack"];
    const routes = ids.map(id => state.routes.find(route => route.id === id)).filter(Boolean);
    $("#popularGrid").innerHTML = routes.map(route => `
      <button class="popular-card" data-popular-id="${escapeHTML(route.id)}">
        <span class="route-arrow">${escapeHTML(route.from)} → ${escapeHTML(route.to)}</span>
        <strong>${escapeHTML(route.operator)}</strong>
        <small>${escapeHTML(route.frequency)}</small>
        <span class="price">${formatPrice(route.price)}</span>
      </button>
    `).join("");
  }

  function routeCard(route) {
    const favorite = state.favorites.has(route.id);
    const times = Array.isArray(route.times) && route.times.length ? route.times.join(" · ") : "À confirmer";
    return `
      <article class="route-card" data-route-id="${escapeHTML(route.id)}">
        <div class="route-card-head">
          <div>
            <span class="eyebrow dark">${escapeHTML(route.vehicle || "Transport")}</span>
            <h3>${escapeHTML(route.from)} → ${escapeHTML(route.to)}</h3>
            <span class="operator">${escapeHTML(route.operator || "Transporteur à confirmer")}</span>
            <div class="badges">
              <span class="badge gold">◷ ${escapeHTML(times)}</span>
              <span class="badge">✓ Source consultée</span>
            </div>
          </div>
          <button class="favorite-btn ${favorite ? "active" : ""}" data-favorite="${escapeHTML(route.id)}" aria-label="${favorite ? "Retirer des favoris" : "Ajouter aux favoris"}">${favorite ? "♥" : "♡"}</button>
        </div>

        <div class="route-main">
          <div>
            <strong>${escapeHTML(route.frequency || "Fréquence à confirmer")}</strong>
            <small>Horaire à confirmer avant le départ</small>
          </div>
          <div class="route-price">
            <strong>${formatPrice(route.price)}</strong>
            <small>par personne</small>
          </div>
        </div>

        <div class="route-details">
          <div class="detail-line"><span>●</span><span><strong>Départ :</strong> ${escapeHTML(route.originStop || "À confirmer")}</span></div>
          <div class="detail-line"><span>◎</span><span><strong>Arrivée :</strong> ${escapeHTML(route.destinationStop || "À confirmer")}</span></div>
        </div>

        <div class="route-actions">
          <button class="action-btn" data-details="${escapeHTML(route.id)}">Voir les détails</button>
          <a class="action-btn primary" href="${phoneHref(route.phone)}">Appeler</a>
        </div>
      </article>
    `;
  }

  function renderRoutes(routes, target) {
    if (!routes.length) {
      target.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">⇄</span>
          <h3>Aucun trajet direct référencé</h3>
          <p>Cette liaison n’est pas encore enregistrée. Essayez un départ ou une arrivée à Dakar, ou ajoutez le trajet depuis l’espace administrateur.</p>
        </div>
      `;
      return;
    }
    target.innerHTML = routes.map(routeCard).join("");
  }

  function searchRoutes(from, to) {
    const normalizedFrom = from.trim().toLocaleLowerCase("fr");
    const normalizedTo = to.trim().toLocaleLowerCase("fr");
    return state.routes.filter(route =>
      route.from.trim().toLocaleLowerCase("fr") === normalizedFrom &&
      route.to.trim().toLocaleLowerCase("fr") === normalizedTo
    );
  }

  function performSearch({ from, to, date, passengers }) {
    if (from === to) {
      showToast("Choisissez deux villes différentes.");
      return;
    }

    const routes = searchRoutes(from, to);
    state.lastResults = routes;
    state.lastSearch = { from, to, date, passengers };

    $("#resultsTitle").textContent = `${from} → ${to}`;
    const totalText = routes.length ? `${routes.length} trajet${routes.length > 1 ? "s" : ""} référencé${routes.length > 1 ? "s" : ""}` : "Aucun trajet direct";
    $("#resultsSummary").innerHTML = `
      <strong>${escapeHTML(totalText)}</strong>
      <p>${escapeHTML(new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" }).format(new Date(`${date}T12:00:00`)))} · ${escapeHTML(passengers)} voyageur${Number(passengers) > 1 ? "s" : ""}</p>
    `;
    renderRoutes(routes, $("#routeList"));
    showView("results");
  }

  function showView(name) {
    $$(".view").forEach(view => view.classList.toggle("active", view.dataset.view === name));
    $$(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.nav === name));
    if (name === "favorites") renderFavorites();
    if (name === "results" && !state.lastSearch) {
      const routes = state.routes.filter(route => route.from === "Dakar");
      state.lastResults = routes;
      $("#resultsTitle").textContent = "Trajets depuis Dakar";
      $("#resultsSummary").innerHTML = `<strong>${routes.length} destinations disponibles</strong><p>Tarifs issus des données initiales de l’application.</p>`;
      renderRoutes(routes, $("#routeList"));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderFavorites() {
    const favorites = state.routes.filter(route => state.favorites.has(route.id));
    renderRoutes(favorites, $("#favoritesList"));
    if (!favorites.length) {
      $("#favoritesList").innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">♡</span>
          <h3>Aucun favori</h3>
          <p>Enregistrez un trajet pour le retrouver rapidement ici.</p>
        </div>
      `;
    }
  }

  function toggleFavorite(routeId) {
    if (state.favorites.has(routeId)) state.favorites.delete(routeId);
    else state.favorites.add(routeId);
    localStorage.setItem(STORAGE_FAVORITES, JSON.stringify([...state.favorites]));
    renderRoutes(state.lastResults, $("#routeList"));
    renderFavorites();
    showToast(state.favorites.has(routeId) ? "Trajet ajouté aux favoris." : "Trajet retiré des favoris.");
  }

  function findRoute(routeId) {
    return state.routes.find(route => route.id === routeId);
  }

  function openDetails(routeId) {
    const route = findRoute(routeId);
    if (!route) return;
    const times = Array.isArray(route.times) && route.times.length ? route.times.join(" · ") : "À confirmer";
    $("#dialogContent").innerHTML = `
      <div class="dialog-hero">
        <div class="dialog-hero-top">
          <div>
            <span class="eyebrow">${escapeHTML(route.operator || "Transporteur")}</span>
            <h2>${escapeHTML(route.from)} → ${escapeHTML(route.to)}</h2>
          </div>
          <button class="dialog-close" data-close-dialog aria-label="Fermer">×</button>
        </div>
      </div>
      <div class="dialog-body">
        <div class="dialog-price">${formatPrice(route.price)}</div>
        <small>Tarif publié par personne · à confirmer</small>
        <div class="dialog-list">
          <div class="dialog-item"><strong>Horaires</strong><span>${escapeHTML(times)} — ${escapeHTML(route.frequency || "fréquence à confirmer")}</span></div>
          <div class="dialog-item"><strong>Point de départ</strong><span>${escapeHTML(route.originStop || "À confirmer")}</span></div>
          <div class="dialog-item"><strong>Point d’arrivée</strong><span>${escapeHTML(route.destinationStop || "À confirmer")}</span></div>
          <div class="dialog-item"><strong>Information importante</strong><span>${escapeHTML(route.scheduleNote || sourceData.meta.disclaimer)}</span></div>
          <div class="dialog-item"><strong>Source</strong><span>${escapeHTML(sourceData.meta.sourceName)}, consultée le ${formatSourceDate(sourceData.meta.lastChecked)}.</span></div>
        </div>
        <div class="dialog-actions">
          <button class="action-btn" data-share-route="${escapeHTML(route.id)}">Partager</button>
          <a class="action-btn primary" href="${phoneHref(route.phone)}">Appeler</a>
        </div>
      </div>
    `;
    $("#routeDialog").showModal();
  }

  async function shareRoute(routeId) {
    const route = findRoute(routeId);
    if (!route) return;
    const text = `${route.from} → ${route.to}\n${formatPrice(route.price)}\n${route.frequency}\nDépart : ${route.originStop}\nSunu Trajet — tarif à confirmer avant le départ.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${route.from} → ${route.to}`, text });
      } else {
        await navigator.clipboard.writeText(text);
        showToast("Informations copiées.");
      }
    } catch (error) {
      if (error.name !== "AbortError") showToast("Partage impossible sur cet appareil.");
    }
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function openDrawer() {
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    $("#drawer").classList.remove("open");
    $("#drawer").setAttribute("aria-hidden", "true");
  }

  function bindEvents() {
    $("#searchForm").addEventListener("submit", event => {
      event.preventDefault();
      performSearch({
        from: $("#fromSelect").value,
        to: $("#toSelect").value,
        date: $("#dateInput").value,
        passengers: $("#passengerSelect").value
      });
    });

    $("#swapBtn").addEventListener("click", () => {
      const from = $("#fromSelect").value;
      $("#fromSelect").value = $("#toSelect").value;
      $("#toSelect").value = from;
    });

    document.addEventListener("click", event => {
      const popular = event.target.closest("[data-popular-id]");
      if (popular) {
        const route = findRoute(popular.dataset.popularId);
        if (route) {
          $("#fromSelect").value = route.from;
          $("#toSelect").value = route.to;
          performSearch({ from: route.from, to: route.to, date: $("#dateInput").value, passengers: "1" });
        }
        return;
      }

      const nav = event.target.closest("[data-nav]");
      if (nav) return showView(nav.dataset.nav);

      const go = event.target.closest("[data-go]");
      if (go) return showView(go.dataset.go);

      const favorite = event.target.closest("[data-favorite]");
      if (favorite) return toggleFavorite(favorite.dataset.favorite);

      const details = event.target.closest("[data-details]");
      if (details) return openDetails(details.dataset.details);

      const closeDialog = event.target.closest("[data-close-dialog]");
      if (closeDialog) return $("#routeDialog").close();

      const share = event.target.closest("[data-share-route]");
      if (share) return shareRoute(share.dataset.shareRoute);

      const drawerNav = event.target.closest("[data-drawer-nav]");
      if (drawerNav) {
        closeDrawer();
        return showView(drawerNav.dataset.drawerNav);
      }
    });

    $("#menuBtn").addEventListener("click", openDrawer);
    $("#closeMenuBtn").addEventListener("click", closeDrawer);
    $("#drawer").addEventListener("click", event => {
      if (event.target === $("#drawer")) closeDrawer();
    });

    $("#routeDialog").addEventListener("click", event => {
      const rect = event.currentTarget.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (outside) event.currentTarget.close();
    });

    window.addEventListener("beforeinstallprompt", event => {
      event.preventDefault();
      state.installPrompt = event;
      $("#installBtn").hidden = false;
    });

    $("#installBtn").addEventListener("click", async () => {
      if (!state.installPrompt) return;
      state.installPrompt.prompt();
      await state.installPrompt.userChoice;
      state.installPrompt = null;
      $("#installBtn").hidden = true;
    });

    window.addEventListener("storage", event => {
      if (event.key === STORAGE_ROUTES) {
        state.routes = loadRoutes();
        populateCities();
        renderPopular();
        if (state.lastSearch) {
          state.lastResults = searchRoutes(state.lastSearch.from, state.lastSearch.to);
          renderRoutes(state.lastResults, $("#routeList"));
        }
      }
    });
  }

  function initServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(console.warn));
    }
  }

  function init() {
    populateCities();
    setToday();
    renderPopular();
    $("#sourceDate").textContent = formatSourceDate(sourceData.meta.lastChecked);
    bindEvents();
    initServiceWorker();
  }

  init();
})();
