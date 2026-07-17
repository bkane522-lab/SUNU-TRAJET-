(() => {
  "use strict";

  const STORAGE_ROUTES = "lionsTransportRoutes";
  const defaults = window.LIONS_DATA.routes;
  let routes = loadRoutes();
  let filter = "";

  const $ = selector => document.querySelector(selector);

  function loadRoutes() {
    try {
      const raw = localStorage.getItem(STORAGE_ROUTES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.warn(error);
    }
    const seeded = structuredClone(defaults);
    localStorage.setItem(STORAGE_ROUTES, JSON.stringify(seeded));
    return seeded;
  }

  function saveRoutes() {
    localStorage.setItem(STORAGE_ROUTES, JSON.stringify(routes));
    render();
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
    return Number.isFinite(numeric) ? `${new Intl.NumberFormat("fr-FR").format(numeric)} FCFA` : "À confirmer";
  }

  function makeId(from, to) {
    const base = `${from}-${to}`
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    let id = base || `route-${Date.now()}`;
    let index = 2;
    while (routes.some(route => route.id === id)) id = `${base}-${index++}`;
    return id;
  }

  function renderStats() {
    const cities = new Set(routes.flatMap(route => [route.from, route.to]));
    const verified = routes.filter(route => route.verified).length;
    $("#adminStats").innerHTML = `
      <div class="stat-card"><strong>${routes.length}</strong><span>trajets enregistrés</span></div>
      <div class="stat-card"><strong>${cities.size}</strong><span>villes couvertes</span></div>
      <div class="stat-card"><strong>${verified}</strong><span>données sourcées</span></div>
    `;
  }

  function renderList() {
    const normalized = filter.trim().toLocaleLowerCase("fr");
    const filtered = routes.filter(route => {
      if (!normalized) return true;
      return [route.from, route.to, route.operator, route.frequency]
        .filter(Boolean)
        .some(value => String(value).toLocaleLowerCase("fr").includes(normalized));
    });

    if (!filtered.length) {
      $("#adminRouteList").innerHTML = `<div class="empty-state"><span class="empty-icon">⌕</span><h3>Aucun résultat</h3><p>Essayez une autre recherche.</p></div>`;
      return;
    }

    $("#adminRouteList").innerHTML = filtered
      .sort((a, b) => `${a.from}${a.to}`.localeCompare(`${b.from}${b.to}`, "fr"))
      .map(route => `
        <article class="admin-route-card">
          <div><strong>${escapeHTML(route.from)} → ${escapeHTML(route.to)}</strong><small>${escapeHTML(route.operator || "Transporteur non renseigné")}</small></div>
          <div><strong>${escapeHTML((route.times || []).join(" · ") || "Horaire à confirmer")}</strong><small>${escapeHTML(route.frequency || "Fréquence à confirmer")}</small></div>
          <div class="admin-route-price">${formatPrice(route.price)}</div>
          <div class="admin-card-actions">
            <button class="edit-btn" data-edit="${escapeHTML(route.id)}" aria-label="Modifier">✎</button>
            <button class="delete-btn" data-delete="${escapeHTML(route.id)}" aria-label="Supprimer">×</button>
          </div>
        </article>
      `).join("");
  }

  function render() {
    renderStats();
    renderList();
  }

  function resetForm() {
    $("#routeForm").reset();
    $("#routeId").value = "";
    $("#routeOperator").value = "Sénégal Dem Dikk";
    $("#routeVehicle").value = "Autocar";
    $("#routeVerified").checked = true;
    $("#formTitle").textContent = "Ajouter un trajet";
  }

  function openForm(route = null) {
    resetForm();
    if (route) {
      $("#formTitle").textContent = "Modifier le trajet";
      $("#routeId").value = route.id;
      $("#routeFrom").value = route.from || "";
      $("#routeTo").value = route.to || "";
      $("#routeOperator").value = route.operator || "";
      $("#routeVehicle").value = route.vehicle || "";
      $("#routePrice").value = Number.isFinite(Number(route.price)) ? route.price : "";
      $("#routeTimes").value = Array.isArray(route.times) ? route.times.join(", ") : "";
      $("#routeFrequency").value = route.frequency || "";
      $("#routeOriginStop").value = route.originStop || "";
      $("#routeDestinationStop").value = route.destinationStop || "";
      $("#routePhone").value = route.phone || "";
      $("#routeScheduleNote").value = route.scheduleNote || "";
      $("#routeVerified").checked = Boolean(route.verified);
    }
    $("#routeFormDialog").showModal();
  }

  function closeForm() {
    $("#routeFormDialog").close();
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function exportRoutes() {
    const payload = {
      exportedAt: new Date().toISOString(),
      app: "Lions Transport",
      routes
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lions-transport-routes-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Export JSON créé.");
  }

  async function importRoutes(file) {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const imported = Array.isArray(parsed) ? parsed : parsed.routes;
      if (!Array.isArray(imported)) throw new Error("Format invalide");
      routes = imported;
      saveRoutes();
      showToast("Données importées.");
    } catch (error) {
      console.error(error);
      showToast("Le fichier JSON n’est pas valide.");
    }
  }

  $("#addRouteBtn").addEventListener("click", () => openForm());
  $("#closeFormBtn").addEventListener("click", closeForm);
  $("#cancelFormBtn").addEventListener("click", closeForm);
  $("#exportBtn").addEventListener("click", exportRoutes);
  $("#importInput").addEventListener("change", event => {
    const [file] = event.target.files;
    if (file) importRoutes(file);
    event.target.value = "";
  });
  $("#adminSearch").addEventListener("input", event => {
    filter = event.target.value;
    renderList();
  });

  $("#resetBtn").addEventListener("click", () => {
    const confirmed = window.confirm("Réinitialiser tous les trajets avec les données initiales ?");
    if (!confirmed) return;
    routes = structuredClone(defaults);
    saveRoutes();
    showToast("Données initiales restaurées.");
  });

  $("#routeForm").addEventListener("submit", event => {
    event.preventDefault();
    const existingId = $("#routeId").value;
    const from = $("#routeFrom").value.trim();
    const to = $("#routeTo").value.trim();
    const route = {
      id: existingId || makeId(from, to),
      from,
      to,
      operator: $("#routeOperator").value.trim(),
      vehicle: $("#routeVehicle").value.trim(),
      price: Number($("#routePrice").value),
      times: $("#routeTimes").value.split(",").map(value => value.trim()).filter(Boolean),
      frequency: $("#routeFrequency").value.trim(),
      originStop: $("#routeOriginStop").value.trim(),
      destinationStop: $("#routeDestinationStop").value.trim(),
      phone: $("#routePhone").value.trim(),
      scheduleNote: $("#routeScheduleNote").value.trim(),
      duration: "À confirmer",
      verified: $("#routeVerified").checked
    };

    if (existingId) {
      const index = routes.findIndex(item => item.id === existingId);
      if (index >= 0) routes[index] = route;
    } else {
      routes.push(route);
    }
    saveRoutes();
    closeForm();
    showToast("Trajet enregistré.");
  });

  document.addEventListener("click", event => {
    const editButton = event.target.closest("[data-edit]");
    if (editButton) {
      const route = routes.find(item => item.id === editButton.dataset.edit);
      if (route) openForm(route);
      return;
    }

    const deleteButton = event.target.closest("[data-delete]");
    if (deleteButton) {
      const route = routes.find(item => item.id === deleteButton.dataset.delete);
      if (!route) return;
      const confirmed = window.confirm(`Supprimer ${route.from} → ${route.to} ?`);
      if (!confirmed) return;
      routes = routes.filter(item => item.id !== route.id);
      saveRoutes();
      showToast("Trajet supprimé.");
    }
  });

  $("#routeFormDialog").addEventListener("click", event => {
    const rect = event.currentTarget.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (outside) event.currentTarget.close();
  });

  render();
})();
