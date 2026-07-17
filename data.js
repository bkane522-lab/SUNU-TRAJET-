window.LIONS_DATA = {
  meta: {
    appName: "Lions Transport",
    currency: "FCFA",
    lastChecked: "2026-07-15",
    sourceName: "Dakar Dem Dikk — Réseau interurbain",
    sourceUrl: "https://demdikk.sn/reseau-interurbain/",
    disclaimer: "Les tarifs et horaires peuvent évoluer. Confirmez toujours auprès du transporteur avant de vous déplacer."
  },
  cities: [
    "Dakar", "Touba", "Thiès", "Kaolack", "Tambacounda", "Ziguinchor",
    "Saint-Louis", "Fatick", "Kolda", "Sédhiou", "Louga", "Diourbel"
  ],
  routes: [
    {
      id: "dakar-touba",
      from: "Dakar", to: "Touba", operator: "Sénégal Dem Dikk",
      price: 4000, times: ["07:00", "15:00"], frequency: "Tous les jours sauf mercredi",
      originStop: "Terminus Liberté 5, Dakar",
      destinationStop: "Touba 28, Pharmacie Serigne Fallou Mbacké",
      phone: "+221786200406", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Horaires publiés pour la ligne.", verified: true
    },
    {
      id: "touba-dakar",
      from: "Touba", to: "Dakar", operator: "Sénégal Dem Dikk",
      price: 4000, times: ["07:00", "15:00"], frequency: "Tous les jours sauf mercredi",
      originStop: "Touba 28, Pharmacie Serigne Fallou Mbacké",
      destinationStop: "Terminus Liberté 5, Dakar",
      phone: "+221786200406", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Confirmer le sens et l’heure exacte auprès du transporteur.", verified: true
    },
    {
      id: "dakar-thies",
      from: "Dakar", to: "Thiès", operator: "Sénégal Dem Dikk",
      price: 2000, times: ["07:00–19:00"], frequency: "Tous les jours",
      originStop: "Gare de Colobane, Dakar",
      destinationStop: "Grand Standing, derrière la station EDK OIL, Thiès",
      phone: "+221338241010", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Service annoncé de 07:00 à 19:00.", verified: true
    },
    {
      id: "thies-dakar",
      from: "Thiès", to: "Dakar", operator: "Sénégal Dem Dikk",
      price: 2000, times: ["06:00–19:00"], frequency: "Tous les jours",
      originStop: "Grand Standing, derrière la station EDK OIL, Thiès",
      destinationStop: "Gare de Colobane, Dakar",
      phone: "+221338241010", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Service annoncé de 06:00 à 19:00.", verified: true
    },
    {
      id: "dakar-kaolack",
      from: "Dakar", to: "Kaolack", operator: "Sénégal Dem Dikk",
      price: 4000, times: ["07:00", "15:00"], frequency: "Tous les jours",
      originStop: "Terminus Liberté 5, Dakar",
      destinationStop: "Quartier Casa Ville, en face de Gneti Gouy, Kaolack",
      phone: "+221786200408", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Horaires publiés pour la ligne.", verified: true
    },
    {
      id: "kaolack-dakar",
      from: "Kaolack", to: "Dakar", operator: "Sénégal Dem Dikk",
      price: 4000, times: ["07:00", "15:00"], frequency: "Tous les jours",
      originStop: "Quartier Casa Ville, en face de Gneti Gouy, Kaolack",
      destinationStop: "Terminus Liberté 5, Dakar",
      phone: "+221786200408", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Confirmer le sens et l’heure exacte auprès du transporteur.", verified: true
    },
    {
      id: "dakar-tambacounda",
      from: "Dakar", to: "Tambacounda", operator: "Sénégal Dem Dikk",
      price: 9000, times: ["07:00"], frequency: "Tous les jours",
      originStop: "Terminus Liberté 5, Dakar",
      destinationStop: "Médina Coura, en face de l’église Jean XXIII, Tambacounda",
      phone: "+221786200411", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Départ de Dakar annoncé à 07:00.", verified: true
    },
    {
      id: "tambacounda-dakar",
      from: "Tambacounda", to: "Dakar", operator: "Sénégal Dem Dikk",
      price: 9000, times: ["08:30"], frequency: "Tous les jours sauf jeudi",
      originStop: "Médina Coura, en face de l’église Jean XXIII, Tambacounda",
      destinationStop: "Terminus Liberté 5, Dakar",
      phone: "+221786200411", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Départ de Tambacounda annoncé à 08:30.", verified: true
    },
    {
      id: "dakar-ziguinchor",
      from: "Dakar", to: "Ziguinchor", operator: "Sénégal Dem Dikk",
      price: 9000, times: ["08:00"], frequency: "Tous les jours",
      originStop: "Terminus Liberté 5, Dakar",
      destinationStop: "Quartier Néma, avenue Émile Badiane, face DRDR, Ziguinchor",
      phone: "+221786200409", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Départ de Dakar annoncé à 08:00.", verified: true
    },
    {
      id: "ziguinchor-dakar",
      from: "Ziguinchor", to: "Dakar", operator: "Sénégal Dem Dikk",
      price: 9000, times: ["07:00"], frequency: "Tous les jours",
      originStop: "Quartier Néma, avenue Émile Badiane, face DRDR, Ziguinchor",
      destinationStop: "Terminus Liberté 5, Dakar",
      phone: "+221786200409", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Départ de Ziguinchor annoncé à 07:00.", verified: true
    },
    {
      id: "dakar-saint-louis",
      from: "Dakar", to: "Saint-Louis", operator: "Sénégal Dem Dikk",
      price: 5000, times: ["07:00", "14:00"], frequency: "Tous les jours",
      originStop: "Terminus Liberté 5, Dakar",
      destinationStop: "Pikine Guinaw Rail, derrière la station OIL LYBIA, Saint-Louis",
      phone: "+221786200401", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Deux départs annoncés chaque jour.", verified: true
    },
    {
      id: "saint-louis-dakar",
      from: "Saint-Louis", to: "Dakar", operator: "Sénégal Dem Dikk",
      price: 5000, times: ["07:00", "14:00"], frequency: "Tous les jours",
      originStop: "Pikine Guinaw Rail, derrière la station OIL LYBIA, Saint-Louis",
      destinationStop: "Terminus Liberté 5, Dakar",
      phone: "+221786200401", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Deux départs annoncés chaque jour.", verified: true
    },
    {
      id: "dakar-fatick",
      from: "Dakar", to: "Fatick", operator: "Sénégal Dem Dikk",
      price: 3000, times: ["07:00", "15:00"], frequency: "Tous les jours",
      originStop: "Terminus Liberté 5, Dakar",
      destinationStop: "Boulevard, en face de Keur Macky Sall, Fatick",
      phone: "+221786200407", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Horaires publiés pour la ligne.", verified: true
    },
    {
      id: "fatick-dakar",
      from: "Fatick", to: "Dakar", operator: "Sénégal Dem Dikk",
      price: 3000, times: ["07:00", "15:00"], frequency: "Tous les jours",
      originStop: "Boulevard, en face de Keur Macky Sall, Fatick",
      destinationStop: "Terminus Liberté 5, Dakar",
      phone: "+221786200407", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Confirmer le sens et l’heure exacte auprès du transporteur.", verified: true
    },
    {
      id: "dakar-kolda",
      from: "Dakar", to: "Kolda", operator: "Sénégal Dem Dikk",
      price: 9000, times: ["08:00"], frequency: "Tous les jours",
      originStop: "Terminus Liberté 5, Dakar",
      destinationStop: "Derrière le stade régional, près de la pharmacie Tamarassy, Kolda",
      phone: "+221786200410", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Départ de Dakar annoncé à 08:00.", verified: true
    },
    {
      id: "kolda-dakar",
      from: "Kolda", to: "Dakar", operator: "Sénégal Dem Dikk",
      price: 9000, times: ["07:00"], frequency: "Tous les jours",
      originStop: "Derrière le stade régional, près de la pharmacie Tamarassy, Kolda",
      destinationStop: "Terminus Liberté 5, Dakar",
      phone: "+221786200410", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Départ de Kolda annoncé à 07:00.", verified: true
    },
    {
      id: "dakar-sedhiou",
      from: "Dakar", to: "Sédhiou", operator: "Sénégal Dem Dikk",
      price: 9000, times: ["08:00"], frequency: "Lundi, mercredi et samedi",
      originStop: "Terminus Liberté 5, Dakar",
      destinationStop: "Quartier Santassou, Sédhiou",
      phone: "+221784604335", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Départ de Dakar annoncé à 08:00.", verified: true
    },
    {
      id: "sedhiou-dakar",
      from: "Sédhiou", to: "Dakar", operator: "Sénégal Dem Dikk",
      price: 9000, times: ["07:00"], frequency: "Lundi, mercredi et samedi",
      originStop: "Quartier Santassou, Sédhiou",
      destinationStop: "Terminus Liberté 5, Dakar",
      phone: "+221784604335", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Départ de Sédhiou annoncé à 07:00.", verified: true
    },
    {
      id: "dakar-louga",
      from: "Dakar", to: "Louga", operator: "Sénégal Dem Dikk",
      price: 4000, times: ["07:00", "15:00"], frequency: "Tous les jours",
      originStop: "Terminus Liberté 5, Dakar",
      destinationStop: "Santhiaba Sud, route de la Gouvernance, près de l’Inspection académique, Louga",
      phone: "+221778480240", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Horaires publiés pour la ligne.", verified: true
    },
    {
      id: "louga-dakar",
      from: "Louga", to: "Dakar", operator: "Sénégal Dem Dikk",
      price: 4000, times: ["07:00", "15:00"], frequency: "Tous les jours",
      originStop: "Santhiaba Sud, route de la Gouvernance, près de l’Inspection académique, Louga",
      destinationStop: "Terminus Liberté 5, Dakar",
      phone: "+221778480240", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Confirmer le sens et l’heure exacte auprès du transporteur.", verified: true
    },
    {
      id: "dakar-diourbel",
      from: "Dakar", to: "Diourbel", operator: "Sénégal Dem Dikk",
      price: 3000, times: ["07:00", "15:00"], frequency: "Tous les jours",
      originStop: "Terminus Liberté 5, Dakar",
      destinationStop: "Quartier Cheikh Anta, Diourbel",
      phone: "+221778480236", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Horaires publiés pour la ligne.", verified: true
    },
    {
      id: "diourbel-dakar",
      from: "Diourbel", to: "Dakar", operator: "Sénégal Dem Dikk",
      price: 3000, times: ["07:00", "15:00"], frequency: "Tous les jours",
      originStop: "Quartier Cheikh Anta, Diourbel",
      destinationStop: "Terminus Liberté 5, Dakar",
      phone: "+221778480236", vehicle: "Autocar", duration: "À confirmer",
      scheduleNote: "Confirmer le sens et l’heure exacte auprès du transporteur.", verified: true
    }
  ]
};
