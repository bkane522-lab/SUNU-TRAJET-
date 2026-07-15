# Sunu Trajet

Prototype PWA mobile-first pour consulter des trajets interurbains au Sénégal.

## Fonctionnalités

- recherche départ / destination / date / voyageurs ;
- tarifs, horaires, lieux de départ et contacts ;
- favoris ;
- appel direct et partage d’un trajet ;
- fonctionnement hors connexion après la première visite ;
- espace `/admin/` pour ajouter, modifier, supprimer, exporter et importer les trajets ;
- données administrées dans le stockage local du navigateur pour cette première version.

## Données initiales

Les tarifs et horaires initiaux ont été relevés sur la page « Réseau interurbain » de Dakar Dem Dikk, consultée le 15 juillet 2026 :
https://demdikk.sn/reseau-interurbain/

Ils doivent être confirmés auprès du transporteur avant le voyage.

## Tester localement

Dans le dossier du projet :

```bash
python -m http.server 8080
```

Puis ouvrir `http://localhost:8080`.

## Déployer

Le dossier peut être importé directement dans Vercel, Netlify ou GitHub Pages.

## Limite de cette première version

Les mises à jour effectuées depuis `/admin/` sont stockées uniquement sur l’appareil utilisé. Une base de données partagée et une authentification administrateur seront ajoutées lors de la phase suivante.
