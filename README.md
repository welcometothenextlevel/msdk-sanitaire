# M-SDK Sanitaire Sàrl — site vitrine

Site one-page (français) pour **M-SDK Sanitaire Sàrl**, entreprise sanitaire et chauffage
à Écublens (VD), actif à Lausanne et dans toute la région. Objectif : générer des appels et des demandes de devis,
notamment depuis Google Ads sur mobile.

**En ligne :** https://welcometothenextlevel.github.io/msdk-sanitaire/

## Stack

HTML / CSS / JavaScript statiques. Aucune dépendance, aucun build.
Polices : Archivo + Instrument Serif (Google Fonts).

```
index.html        page complète + données structurées JSON-LD
css/style.css     design system et styles
js/main.js        visionneuse photos, révélations au scroll, validation du formulaire
img/              photos de chantier optimisées (WebP) + logo
                  `svc-*.webp` = crop 16:10 desktop · `svc-*-m.webp` = crop 4:3 mobile
                  (servis via <picture>, chaque fichier a exactement le ratio
                  de sa boîte CSS — aucun recadrage par object-fit)
```

## Conversion

- Bouton d'appel permanent dans l'en-tête, à toutes les largeurs
- Barre d'actions fixe en bas sur mobile : **Appeler · WhatsApp · Devis**
- Bulle WhatsApp flottante sur desktop
- Bandeau urgence rouge juste sous le héros
- 10 liens `tel:` et 7 liens WhatsApp répartis dans la page
- Formulaire de devis court (6 champs, 4 obligatoires)

## Coordonnées utilisées

| | |
|---|---|
| Téléphone / WhatsApp | 079 128 87 78 — `+41791288778` |
| E-mail | m.sdksanitaire@gmail.com |
| Adresse | Route du Bois 59, 1024 Écublens VD |
| IDE | CHE-323.718.742 |
| Horaires | lundi – samedi, 7h30 – 17h00 (dimanche fermé) |
| Google place ID | `ChIJYcVyRmUxjEcRADty2g7ZncY` |

Pour modifier le numéro : rechercher `+41791288778` (liens `tel:`),
`41791288778` (liens `wa.me`) et `079 128 87 78` (texte affiché).

## Formulaire de devis — à connecter

Le formulaire **valide les champs et affiche la confirmation, mais n'envoie rien** :
c'est une démonstration. Un encadré le signale explicitement sous le bouton d'envoi.

Pour le mettre en service :

1. Créer une clé sur [web3forms.com](https://web3forms.com) avec l'adresse de réception.
2. Dans `index.html`, ajouter dans le `<form>` :
   `<input type="hidden" name="access_key" value="VOTRE-CLE">`
3. Dans `js/main.js`, remplacer le bloc marqué `/* DÉMO */` par un `fetch`
   vers `https://api.web3forms.com/submit`.
4. Supprimer le paragraphe `.demo-note` dans `index.html`.

## Avis Google

Les six blocs d'avis reprennent les avis publics réels de la fiche Google
(5,0 ★ sur 8 avis), avec les réponses du propriétaire. Ils sont également
déclarés en JSON-LD (`aggregateRating` + `review`).
