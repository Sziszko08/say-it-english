# Say It! Amerikai angol kiejtés és beszédgyakorló (A1, A2, B1)

Önálló, böngészőben futó webapp (HTML/CSS/JS), bejelentkezés és szerver nélkül. A hangsúly a beszéden, a szavakon és az amerikai kiejtésen van, nem a nyelvtanon.

## Mit tud?
- **Szintek:** A1 (köszönés, számok, színek, család, étel, időjárás, napok, testrészek, otthon, mindennapi kifejezések, igék, bónusz: sakk és foci), A2 (bevásárlás, étterem, utazás, egészség, napi rutin), B1 (vélemények, tervek, small talk, bónusz: munka).
- **Minden szónál:** amerikai IPA, magyaros kiejtési segítség (pl. „UÓ-rer”), és tipp a magyaroknak nehéz hangokra (th, w/v, r, æ, -ed).
- **Tanulás:** fordítható kártyák, lejátszás (normál/lassú), „Mondd ki” gomb kiejtés-ellenőrzéssel.
- **Drill:** hallgasd meg, ismételd, ellenőrzés. Egy szó addig marad a körben, amíg kétszer egymás után jól nem mondod. Leitner-dobozok: amit tudsz, ritkábban jön elő.
- **Hallgat és válassz:** 10 kérdéses gyors hallás utáni kvíz.
- **Hangpárok:** ship/sheep, three/tree, very/berry, wine/vine, bad/bed, light/right stb.
- **Kifejezések:** rövid párbeszédek (kávézó, bemutatkozás, útbaigazítás, üzlet), te mondod a „B” szerepet.
- **Haladás:** témánkénti sáv, megtanult szavak, napi sorozat, pontok és szintek. Nincsenek életek. Beállításokban export/import (JSON) és nullázás.
- Sötét/világos mód, mobilra és asztalira is, telepíthető (PWA), offline is megnyílik.

## Indítás
A mikrofon csak **https** vagy **localhost** alatt működik, fájlként (file://) megnyitva sok böngésző tiltja. Ezért:

```bash
cd english-a1-app
python3 -m http.server 8000
```
Majd böngészőben: http://localhost:8000

## Böngészők
- **Chrome / Edge:** minden funkció. A beszédfelismerés itt internetet igényel (a Google szerverén fut), offline csak a felolvasás és a kártyák mennek.
- **Safari (Mac, iPhone):** működik, a mikrofont engedélyezni kell.
- **Firefox:** nincs beszédfelismerés. Ilyenkor az app „hallgasd és ismételd” módra vált, „Jó volt / Még gyakorolom” önértékeléssel.
- Hang választása és sebesség: ⚙️ Beállítások. Ha nincs amerikai hang, telepíts angol (USA) hangot az operációs rendszerben.

## Billentyűk (asztali gépen)
Szóköz = kártya fordítása, Enter vagy P = lejátszás, M = mikrofon, ← → = lapozás, 1-4 = válasz a kvízben.

## Közzététel (ingyenes)
- **Netlify Drop:** https://app.netlify.com/drop oldalra húzd rá a mappát.
- **GitHub Pages:** töltsd fel egy repóba, Settings → Pages.
- **Cloudflare Pages:** új projekt, a mappa feltöltése.
Mindhárom https-t ad, így a mikrofon működik telefonon is.

## Fájlok
`index.html`, `style.css`, `app.js` (logika), `data.js` (A1 szavak, hangpárok, párbeszédek), `data-levels.js` (A2, B1), `manifest.json`, `sw.js`, `icon.svg`, `screenshots/`.
Új szót a `data.js` vagy `data-levels.js` fájlban adhatsz hozzá: `["angol", "magyar", "/IPA/", "kiejtés", "tipp"]`.
