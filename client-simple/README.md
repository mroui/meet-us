# Frontend
[(powrót do głównej dokumentacji)](../README.md)

Aplikacja służąca do komunikowania się z osobami przy pomocy czatów lokalnych stworzonych przez użytkowników. 
Użytkownicy mają możliwość stworzenia oraz określenia lokalizacji czatu na mapie.

## Uruchamianie

Przed uruchomieniem klienta należy zainstalować wszystkie potrzebne paczki przy pomocy komendy `npm install`. 
Do poprawnego działania trzeba najpierw uruchomić serwer (postępuj zgodnie z instrukcjami zawartymi w opisie serwera). Nastepnie można odpalić klienta `client-simple/` za pomocą komendy `npm start`.

## Komendy

`npm install` - Instalacja wszystkich potrzebnych paczek  
`npm start` - Uruchamianie klienta. Dostępny pod adresem: [localhost:3001](localhost:3001). (Wspiera HMR)
`npm run lint` - Poprawienie błędów w kodzie przy pomocy ESLint  
`npm build` - Budowanie klienta do kodu produkcyjnego w folderze **build**.
`npm run start:prod` - Startuje serwer statyczny *serve* (https://github.com/zeit/serve) hostujacy zbudowany przez `npm build` kod.

## Struktura projektu

**public/**  
Zawiera szablon strony `index.html`, w którym znajdują się meta tagi.

**assets/**  
Zawiera dodatkowe assety wykorzystwane w projekcie (ikonki, obrazki itp.)

**components/**  
W tym folderze są umieszczone wszystkie komponenty. Każdy komponent znajduje się w osobnym folderze oraz posiada swój plik `ComponentName.js` oraz opcjonalny plik `ComponentName.style.scss` ze stylami. Nazwy plików w wypadku komponentów reacta i styli pisane PascalCasem.

**pages/**  
Folder ze stronami. Każda strona jest umieszczona we własnym folderze,w której znajduje się plik `index.js` z logiką strony oraz plik `Page.style.scss` ze stylami danej strony.

**styles/**  
Zawiera pliki css z globalnymi stylami, zmiennymi oraz funkcjami wykorzystywanymi w całym projekcie.

**src/AppRouter.js**  
Plik z routerem, do którego są importowane wszystkie strony.

**src/index.js**  
Główny plik, w którym aplikacja jest renderowana.

**config/**
Folder plików powstałych w wyniku wyciągniecia (twz. eject) konfiguracji webpacka - *możecie ignorować jego egzystencje ;)*

## Narzędzia

- **Webpack** - Module Bundler dla aplikacji. Głównym zadaniem webpacka jest tworzenie tzw. "bundli" kodu, a więc jednego lub wielu plików wynikowych.
- **Babel** - Transpiler konwertujący kod ES6+ na kod zrozumiały dla starszych przeglądarek.
- **Sass** - Pre-procesor CSS, który rozszerza znacznie składnię CSS dodając do niego komendy, dzięki którym staje się on znacznie bardziej re-używalny.
- **Socket.io** - Umożliwia komunikację między klientem a serwerem.
- **GraphQL** - Język zapytań, alternatywa dla tradycyjnego REST API. Jego główną zaletą jest tylko jeden endpoint, a odpowiednio skonstruowane zapytania dostarczają tylko potrzebnych danych.
- **Apollo-GraphQL** - Zapewnia integracje GraphQL API z komponentami Reacta, cache dla odbieranych danych oraz ich przechowywanie ich w store dla ponownego użycia miedzy widokami. 
- **EsLint** - Linter, który wspiera pisanie kodu poprzez zastosowanie zasad, do których wszyscy w projekcie mają się stosować. 
- **antd** - Reactowa biblioteka zawierająca ogromny zestaw przydatnych komponentów UI.
- **react-google-maps** - Mapy Google dla Reacta

## Konfiguracja zmiennych środowiskowych
Plik .env zapewnia dostęp do zmiennych środowiskowych po stronie klienta (są wstrzykiwane w kod podczas budowy) wg. standardu [dotenv](https://github.com/motdotla/dotenv#readme).


## Konwencja pisania

Za odpowiednią konwencje pisania w plikach `.js` odpowiada ESLint, który wykorzystuje plik konfiguracyjny `.eslintrc`. Klasy są pisane w SCSS przy pomocy metodologii BEM.
