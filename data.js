// Vocabulary data. Item: [english, hungarian, US IPA, HU-friendly respelling, optional tip]
const CATEGORIES = [
{ level:"A1", id:"greetings", icon:"👋", name:"Köszönés és udvariasság", items:[
["Hello","Szia / Helló","/həˈloʊ/","hö-LOU","A h hangot lágyan, leheletszerűen ejtsd."],
["Hi","Szia","/haɪ/","HÁJ"],
["Good morning","Jó reggelt","/ɡʊd ˈmɔrnɪŋ/","gud MÓR-ning","Az amerikai r-t ne pörgesd: a nyelved hegye hátra hajlik."],
["Good evening","Jó estét","/ɡʊd ˈivnɪŋ/","gud ÍV-ning"],
["Goodbye","Viszlát","/ɡʊdˈbaɪ/","gud-BÁJ"],
["Please","Kérem / Légyszi","/pliz/","PLÍZ","A végén z, nem sz."],
["Thank you","Köszönöm","/ˈθæŋk ju/","SZENK-jú","th: a nyelved hegyét tedd a fogaid közé és fújj, ne sz vagy t legyen."],
["You're welcome","Szívesen","/jʊr ˈwɛlkəm/","jur UEL-köm","A w ajakkerekítéssel: mint egy rövid u, nem v."],
["Sorry","Bocsánat","/ˈsɑri/","SZÁ-ri"],
["Excuse me","Elnézést","/ɪkˈskjuz mi/","ik-SZKJÚZ mi"],
["How are you?","Hogy vagy?","/haʊ ˈɑr ju/","HAU ár jú?"],
["I'm fine, thanks","Jól vagyok, köszi","/aɪm faɪn θæŋks/","ájm FÁJN szenksz","th hang a thanks szóban."],
["Nice to meet you","Örülök, hogy megismerhetlek","/naɪs tə ˈmit ju/","NÁJSZ tö MÍT-jú"],
["My name is...","A nevem...","/maɪ ˈneɪm ɪz/","máj NÉJM iz"]]},
{ level:"A1", id:"numbers", icon:"🔢", name:"Számok", items:[
["zero","nulla","/ˈzɪroʊ/","ZÍ-rou"],["one","egy","/wʌn/","UAN","w, nem v!"],["two","kettő","/tu/","TÚ"],["three","három","/θri/","SZRÍ","th: nyelv a fogak között. Ne mondd: tree!"],
["four","négy","/fɔr/","FÓR"],["five","öt","/faɪv/","FÁJV"],["six","hat","/sɪks/","SZIKSZ"],["seven","hét","/ˈsɛvən/","SZE-vön"],
["eight","nyolc","/eɪt/","ÉJT"],["nine","kilenc","/naɪn/","NÁJN"],["ten","tíz","/tɛn/","TEN"],["twelve","tizenkettő","/twɛlv/","TUELV"],
["thirteen","tizenhárom","/ˌθɝˈtin/","ször-TÍN","-teen: hangsúly a végén. thirty: az elején."],["twenty","húsz","/ˈtwɛni/","TUE-ni","Amerikában a t gyakran eltűnik: twenny."],
["thirty","harminc","/ˈθɝɾi/","SZÖR-di","Flap t: a t gyors, d-szerű hang."],["one hundred","száz","/wʌn ˈhʌndrəd/","uan HAN-dröd"]]},
{ level:"A1", id:"colors", icon:"🎨", name:"Színek", items:[
["red","piros","/rɛd/","RED"],["blue","kék","/blu/","BLÚ"],["green","zöld","/ɡrin/","GRÍN"],["yellow","sárga","/ˈjɛloʊ/","JE-lou"],
["black","fekete","/blæk/","BLEK","æ: nyitott e, a magyar e és á között."],["white","fehér","/waɪt/","UÁJT","w hang, nem v."],["orange","narancssárga","/ˈɔrɪndʒ/","Ó-rindzs"],
["purple","lila","/ˈpɝpəl/","PÖR-pöl"],["pink","rózsaszín","/pɪŋk/","PINK"],["brown","barna","/braʊn/","BRAUN"],["gray","szürke","/ɡreɪ/","GRÉJ"],["What color is it?","Milyen színű?","/wʌt ˈkʌlər ɪz ɪt/","uat KA-lör iz it?"]]},
{ level:"A1", id:"family", icon:"👨‍👩‍👧", name:"Család", items:[
["mother","anya","/ˈmʌðər/","MA-dör","ð: zöngés th, nyelv a fogak között, zümmögve."],["father","apa","/ˈfɑðər/","FÁ-dör"],["mom","anyu","/mɑm/","MÁM"],["dad","apu","/dæd/","DED"],
["brother","fivér, testvér (fiú)","/ˈbrʌðər/","BRA-dör"],["sister","nővér, húg","/ˈsɪstər/","SZISZ-tör"],["son","fiú (gyermek)","/sʌn/","SZAN"],["daughter","lány (gyermek)","/ˈdɔɾər/","DÓ-dör","Flap t: a t d-szerű."],
["husband","férj","/ˈhʌzbənd/","HAZ-bönd"],["wife","feleség","/waɪf/","UÁJF"],["baby","kisbaba","/ˈbeɪbi/","BÉJ-bi"],["family","család","/ˈfæməli/","FE-mö-li"],["This is my wife","Ő a feleségem","/ðɪs ɪz maɪ waɪf/","DISZ iz máj UÁJF"]]},
{ level:"A1", id:"food", icon:"🍎", name:"Étel és ital", items:[
["water","víz","/ˈwɔɾər/","UÓ-rer","Flap t + amerikai r: wa-der."],["coffee","kávé","/ˈkɑfi/","KÁ-fi"],["tea","tea","/ti/","TÍ"],["milk","tej","/mɪlk/","MILK"],
["bread","kenyér","/brɛd/","BRED"],["apple","alma","/ˈæpəl/","E-pöl"],["chicken","csirke","/ˈtʃɪkən/","CSI-kön"],["egg","tojás","/ɛɡ/","EG"],
["cheese","sajt","/tʃiz/","CSÍZ"],["juice","gyümölcslé","/dʒus/","DZSÚSZ"],["beer","sör","/bɪr/","BÍR"],["I'm hungry","Éhes vagyok","/aɪm ˈhʌŋɡri/","ájm HAN-gri"],
["I would like a coffee","Kérnék egy kávét","/aɪ wʊd ˈlaɪk ə ˈkɑfi/","áj ud LÁJK ö KÁ-fi"],["The check, please","A számlát, kérem","/ðə tʃɛk pliz/","dö CSEK plíz"]]},
{ level:"A1", id:"weather", icon:"⛅", name:"Időjárás", items:[
["sunny","napos","/ˈsʌni/","SZA-ni"],["rainy","esős","/ˈreɪni/","RÉJ-ni"],["cloudy","felhős","/ˈklaʊdi/","KLAU-di"],["windy","szeles","/ˈwɪndi/","UIN-di"],
["snow","hó","/snoʊ/","SZNOU"],["hot","meleg, forró","/hɑt/","HÁT"],["cold","hideg","/koʊld/","KOULD"],["warm","meleg","/wɔrm/","UÓRM"],
["weather","időjárás","/ˈwɛðər/","UE-dör","w + zöngés th: két nehéz hang egy szóban."],["It's raining","Esik az eső","/ɪts ˈreɪnɪŋ/","ITSZ RÉJ-ning"],
["It's cold today","Ma hideg van","/ɪts koʊld təˈdeɪ/","itsz KOULD tö-DÉJ"],["How's the weather?","Milyen az idő?","/haʊz ðə ˈwɛðər/","HAUZ dö UE-dör?"]]},
{ level:"A1", id:"time", icon:"📅", name:"Napok és hónapok", items:[
["Monday","hétfő","/ˈmʌndeɪ/","MAN-déj"],["Tuesday","kedd","/ˈtuzdeɪ/","TÚZ-déj"],["Wednesday","szerda","/ˈwɛnzdeɪ/","UENZ-déj","A d néma!"],["Thursday","csütörtök","/ˈθɝzdeɪ/","SZÖRZ-déj"],
["Friday","péntek","/ˈfraɪdeɪ/","FRÁJ-déj"],["Saturday","szombat","/ˈsæɾərdeɪ/","SZE-dör-déj"],["Sunday","vasárnap","/ˈsʌndeɪ/","SZAN-déj"],
["January","január","/ˈdʒænjuˌɛri/","DZSE-nju-e-ri"],["May","május","/meɪ/","MÉJ"],["July","július","/dʒʊˈlaɪ/","dzsu-LÁJ"],["October","október","/ɑkˈtoʊbər/","ák-TOU-bör"],["December","december","/dɪˈsɛmbər/","di-SZEM-bör"],
["today","ma","/təˈdeɪ/","tö-DÉJ"],["tomorrow","holnap","/təˈmɑroʊ/","tö-MÁ-rou"],["What day is it?","Milyen nap van?","/wʌt ˈdeɪ ɪz ɪt/","uat DÉJ iz it?"]]},
{ level:"A1", id:"body", icon:"🧍", name:"Testrészek", items:[
["head","fej","/hɛd/","HED"],["eye","szem","/aɪ/","ÁJ"],["ear","fül","/ɪr/","ÍR"],["nose","orr","/noʊz/","NOUZ"],["mouth","száj","/maʊθ/","MAUSZ","A végén zöngétlen th."],
["tooth","fog","/tuθ/","TÚSZ"],["hand","kéz","/hænd/","HEND","æ hang."],["arm","kar","/ɑrm/","ÁRM"],["leg","láb","/lɛɡ/","LEG"],["foot","lábfej","/fʊt/","FUT"],
["back","hát","/bæk/","BEK"],["My head hurts","Fáj a fejem","/maɪ hɛd hɝts/","máj HED HÖRCC"],["I need a doctor","Orvosra van szükségem","/aɪ nid ə ˈdɑktər/","áj NÍD ö DÁK-tör"]]},
{ level:"A1", id:"home", icon:"🏠", name:"Otthon és tárgyak", items:[
["house","ház","/haʊs/","HAUSZ"],["room","szoba","/rum/","RÚM"],["kitchen","konyha","/ˈkɪtʃən/","KI-csön"],["bathroom","fürdőszoba, mosdó","/ˈbæθrum/","BESZ-rúm"],
["door","ajtó","/dɔr/","DÓR"],["window","ablak","/ˈwɪndoʊ/","UIN-dou"],["table","asztal","/ˈteɪbəl/","TÉJ-böl"],["chair","szék","/tʃɛr/","CSER"],["bed","ágy","/bɛd/","BED","Ne keverd: bad /bæd/."],
["phone","telefon","/foʊn/","FOUN"],["key","kulcs","/ki/","KÍ"],["car","autó","/kɑr/","KÁR"],["TV","tévé","/ˌtiˈvi/","tí-VÍ"],["computer","számítógép","/kəmˈpjuɾər/","köm-PJÚ-dör"]]},
{ level:"A1", id:"daily", icon:"🗣️", name:"Mindennapi kifejezések", items:[
["How much is this?","Mennyibe kerül ez?","/haʊ ˈmʌtʃ ɪz ðɪs/","hau MACS iz DISZ?"],["Where is the bathroom?","Hol van a mosdó?","/wɛr ɪz ðə ˈbæθrum/","UER iz dö BESZ-rúm?"],
["I don't understand","Nem értem","/aɪ doʊnt ˌʌndərˈstænd/","áj DOUNT an-dör-SZTEND"],["Can you repeat that?","Meg tudnád ismételni?","/kən ju rɪˈpit ðæt/","kön jú ri-PÍT det?"],
["Speak slowly, please","Beszélj lassan, kérlek","/spik ˈsloʊli pliz/","SZPÍK SZLOU-li plíz"],["Do you speak Hungarian?","Beszélsz magyarul?","/du ju spik hʌŋˈɡɛriən/","du jú SZPÍK han-GE-ri-ön?"],
["I'm from Romania","Romániából jöttem","/aɪm frʌm roʊˈmeɪniə/","ájm fram rou-MÉJ-ni-ö"],["I don't know","Nem tudom","/aɪ doʊnt ˈnoʊ/","áj dount NOU","Gyorsan: I dunno."],
["Yes / No","Igen / Nem","/jɛs noʊ/","JESZ / NOU"],["Help!","Segítség!","/hɛlp/","HELP!"],["What time is it?","Hány óra van?","/wʌt ˈtaɪm ɪz ɪt/","uat TÁJM iz it?"],
["I'm sorry, I'm late","Bocsánat, késtem","/aɪm ˈsɑri aɪm leɪt/","ájm SZÁ-ri, ájm LÉJT"],["Can I pay by card?","Fizethetek kártyával?","/kən aɪ peɪ baɪ kɑrd/","kön áj PÉJ báj KÁRD?"],["See you later","Később találkozunk","/si ju ˈleɪɾər/","SZÍ jú LÉJ-dör"]]},
{ level:"A1", id:"verbs", icon:"🏃", name:"Egyszerű igék", items:[
["go","menni","/ɡoʊ/","GOU"],["come","jönni","/kʌm/","KAM"],["eat","enni","/it/","ÍT"],["drink","inni","/drɪŋk/","DRINK"],["sleep","aludni","/slip/","SZLÍP","Hosszú í. Rövid i-vel: slip = csúszni."],
["work","dolgozni","/wɝk/","UÖRK","w + amerikai r: nehéz, de fontos!"],["play","játszani","/pleɪ/","PLÉJ"],["speak","beszélni","/spik/","SZPÍK"],["listen","hallgatni","/ˈlɪsən/","LI-szön","A t néma."],
["want","akarni","/wɑnt/","UÁNT"],["like","szeretni (kedvelni)","/laɪk/","LÁJK"],["have","van neki","/hæv/","HEV"],["walked","sétált","/wɔkt/","UÓKT","-ed itt t-nek hangzik, nem külön szótag!"],["played","játszott","/pleɪd/","PLÉJD","-ed itt d hang."],["wanted","akart","/ˈwɑnɪd/","UÁ-nid","t/d után az -ed külön szótag: -id."]]},
{ level:"A1", id:"fun", icon:"♟️", name:"Bónusz: sakk és foci", items:[
["chess","sakk","/tʃɛs/","CSESZ"],["check","sakk (a királynak)","/tʃɛk/","CSEK"],["checkmate","sakk-matt","/ˈtʃɛkmeɪt/","CSEK-méjt"],["knight","huszár (ló)","/naɪt/","NÁJT","A k néma."],
["queen","vezér (királynő)","/kwin/","KUÍN"],["Let's play chess","Sakkozzunk","/lɛts pleɪ tʃɛs/","LETSZ pléj CSESZ"],["soccer","foci (USA)","/ˈsɑkər/","SZÁ-kör","Amerikában a football az amerikai foci!"],
["goal","gól","/ɡoʊl/","GOUL"],["Liverpool","Liverpool","/ˈlɪvərpul/","LI-vör-púl"],["What a game!","Micsoda meccs!","/wʌt ə ˈɡeɪm/","uat ö GÉJM!"],["You'll never walk alone","Sosem leszel egyedül","/jul ˈnɛvər wɔk əˈloʊn/","júl NE-vör UÓK ö-LOUN"]]}
];

// Minimal pairs: [a, b, IPA a, IPA b, Hungarian tip]
const MINIMAL_PAIRS = [
["ship","sheep","/ʃɪp/","/ʃip/","Rövid i (laza) vs. hosszú í (feszes, mosolygós)."],
["three","tree","/θri/","/tri/","th: nyelv a fogak között. t: nyelv a fogsor mögött."],
["think","sink","/θɪŋk/","/sɪŋk/","th vs. sz: a th-nál a nyelv kilátszik."],
["very","berry","/ˈvɛri/","/ˈbɛri/","v: felső fog az alsó ajkon. b: két ajak."],
["wine","vine","/waɪn/","/vaɪn/","w: kerek ajak, mint u. v: fog az ajkon."],
["west","vest","/wɛst/","/vɛst/","w vs. v: a w-nél a fogak nem érnek az ajakhoz."],
["bad","bed","/bæd/","/bɛd/","æ nyitottabb, szinte á felé. e: a magyar e."],
["man","men","/mæn/","/mɛn/","æ (egy férfi) vs. e (több férfi)."],
["light","right","/laɪt/","/raɪt/","l: nyelv hegye fent. r: nyelv nem ér semmihez."],
["full","fool","/fʊl/","/ful/","Rövid u vs. hosszú ú."],
["hat","had","/hæt/","/hæd/","Zöngétlen t vs. zöngés d a szó végén."],
["they","day","/ðeɪ/","/deɪ/","Zöngés th vs. d."]
];

// Short dialogues: lines of [speaker, english, hungarian]
const DIALOGUES = [
{ title:"A kávézóban", lines:[["A","Hi! What would you like?","Szia! Mit kérsz?"],["B","A coffee, please.","Egy kávét, kérek."],["A","Small or large?","Kicsit vagy nagyot?"],["B","Small, please. How much is it?","Kicsit, kérem. Mennyibe kerül?"],["A","Three dollars.","Három dollár."],["B","Thank you!","Köszönöm!"]]},
{ title:"Bemutatkozás", lines:[["A","Hello, my name is Anna.","Szia, Anna vagyok."],["B","Nice to meet you. I'm Szilard.","Örülök. Én Szilárd vagyok."],["A","Where are you from?","Honnan jöttél?"],["B","I'm from Romania.","Romániából."],["A","Do you like soccer?","Szereted a focit?"],["B","Yes, I love Liverpool!","Igen, imádom a Liverpoolt!"]]},
{ title:"Útbaigazítás", lines:[["A","Excuse me, where is the bathroom?","Elnézést, hol van a mosdó?"],["B","It's over there, on the left.","Ott van, balra."],["A","Sorry, I don't understand.","Bocsánat, nem értem."],["B","Over there. On the left.","Ott. Balra."],["A","Thank you very much!","Nagyon köszönöm!"]]},
{ title:"Az üzletben", lines:[["A","Can I help you?","Segíthetek?"],["B","Yes, how much is this?","Igen, ez mennyibe kerül?"],["A","Ten dollars.","Tíz dollár."],["B","Can I pay by card?","Fizethetek kártyával?"],["A","Sure.","Persze."],["B","Great, thanks. Have a nice day!","Szuper, köszi. Szép napot!"]]}
];
