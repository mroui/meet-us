# Backend
[(powrót do głównej dokumentacji)](../README.md)

### Technologia
Językiem używanym w tym projekcie jest `typescript` (https://www.typescriptlang.org/) - typowany język zorientowany obiektowo, nadal kod można tworzyć w natywnym javascripcie używając rozszerzeń `.js` dla plików.
Następstwem typescript'a jest użycie typescriptowych odpowiedników 'zwykłego' GraphQL oraz Mongoose. 
- type-graphql (https://typegraphql.ml/) 
- typegoose ([dokumentacja](https://github.com/szokodiakos/typegoose); [mongoose dokumentacja](https://mongoosejs.com/docs/guide.html))

## Użycie
Aby włączyć serwer należy:
- Włączyć lokalną bazę danych MongoDB (komendą `mongod`) *Przy instalacji można wybrać opcje automatycznego startowania serwisu z bazą danych*
- Zaseedować bazę komendą `npm run seed:db` w folderze /server
- Włączyć serwer komendą `npm start` w folderze `/server`. *Dodatkowo komenda "watchuje" pliki - więc wszystkie zmiany w kodzie źródłowym serwera wywołają jego rebuild.

### API
- Domyślnie serwer graphql działa na porcie `4000`
- Endpoint socket.io dostępny jest pod adresem: http://localhost:{PORT}/socket.io
- Endpoint GraphQL jak i "playground" GraphQLi do testowania dostępny jest pod adresem: http://localhost:{PORT}/graphql
- Visualizer który pokazuje Schemy oraz ich relacje dostępny jest pod adresem: http://localhost:{PORT}/visualizer

### Automatyczna definicja modeli
Połączenie `typegoose` oraz `type-graphql` zapewnia definicje zarówno modelu bazy danych (typegoose) oraz definicje podstawowego query modelu właściwie w jednym pliku w deklaratywny sposób przy pomocy annotacji.
Przykładem może być [ChatRoomEntity.ts](server/src/modules/chatrooms/ChatRoomEntity.ts). Wiecej o bibliotekach można przeczytać poniżej oraz w ich dokumentacji.

## Opis najważniejszych modułów
### Baza danych
Dane projektu przechowywane są w nierelacynej bazie MongoDB, wiecej o niej samej i procesie instalacji można poczytać tutaj: https://www.mongodb.com/

### Server
Serwer używa `apollo-server-express` - jak wskazuje nazwa jest to połączenie frameworka [express.js](https://expressjs.com/) oraz apollo-graphql.
Za sprawa użycia `apollo` API GraphQL'owedzięki któremu oprócz właśnie serwera apollo który odpowiada za dostarczanie danych do clienta, do expressa podpięty jest również socket.io ktory odpowiada za wysyłanie wiadomości w chatroomach.

### GraphQL
Ultra nowoczesne podejście do API serwera. W przeciwieństwie to RESTowej definicji endpointów wg. różnych URL i HTTP method, GraphQL wystawia jeden endpoint który obsługuje mutacje oraz query.
Same Query mogą przyjąć formę grafu / drzewa - stąd nazwa, więcej o GQL w dokumentacji: https://graphql.org/learn/
.
### type-graphql
Framework na GraphQL który ułatwia pisanie 'schemów' i 'resolverów' w typescripcie, rozbudowujący standardowe opisywanie API GraphQL o podejście zorientowane obiektowo oraz zestaw annotacji.
Dokumentacja: https://typegraphql.ml/

### typegoose
Oparty na mongoose który zapewnia obsługe modeli dla danych, czyli można zdefiniować pola i walidacje obiektu tworząc zwykly obiekt javascript. Zapewnie też pełne uproszone API operacji na bazie MongoDB z obsługą asynchronicznosci (promise).
Sam typegoose pozwala definiować modele bazy danych za pomocą klas, dodatkowe annotacje pozwalaja na opis walidacji pół i referencji do innych modeli (tabel).
### socket.io
Odpowiada za komunikacje w czasie rzeczywistym z klientami opartą na WebSocket, w przypadku apki za system chatu (w tym podział na kanały oraz wysyłanie wiadomości dla użytkowników tych kanałów), więcej: https://socket.io/

### accounts.js
Wysoko poziomowy wrapper logiki tworzenia kont użytkowników i ich autentykacji, więcej: https://accounts-js.netlify.com/.


## Struktura projektu
Deklaracje Schemów i tworzenie ich modeli znajdują się odpowienio w folderze ./server/src/modules/{nazwa}, następnie pliki podzielone są na:
- {NazwaEntity} czyli deklaracje Schemy, ich typów, relacji i na końcu generowanie Modelu
- {NazwaResolvers} resolvery czyli deklaracje operacji Query/Mutation które definiujemy i typujemy aby GraphQL automatycznie i co najważniejsze przewidywalnie mógł zbierać dla nas dane o które zapytamy z clienta
- {NazwaService} funkcje pomocnicze które odpytują się bezpośrednio bazy danych i zwracają dane do resolverów

### Socket.IO
Funkcja inicjalizująca socket.io oraz event handlery znajdują się w folderze ./server/src/socketIO

### Plik startowy serwera
Plik startowy serwera to ./server/src/index.ts (uruchamiany przez moduł ts-node aby egzekucja kodu typescript zadziałała w node.js)
To w nim zawiera się implementacja apollo-server, połączenie z bazą danych oraz wywołanie funkcji inicjalizującej socket.io i udostępnienie narzędzia visualizer

### Pliki konfiguracyjne
Konfiguracja całego projektu znajduje się w ./server/config/index.js

## Seedowanie bazy danych (komenda: npm run seed:db)
**Ta operacja usunie wszystkie poprzednie dane w bazie danych!**

Narzędzie do zaseedowania bazy danych sztywno określonymi danymi znajduje się w folderze ./server/src/tools/seed/index.ts
Służy ono przede wszystkim to stworzenia startowych danych i relacji między nimi. Te dane można modyfikować, odpowiednio dla każdego modelu, pliki posegregowane są po nazwie w folderze ./server/src/tools/data:
{NazwaModelu}.seed.json - w tym pliku określamy które dane ma dostać model w systemie klucz: wartość
{NazwaModelu}.refs.json - określamy jakie pola dla TEGO modelu mają odnosić się jako referencje do innych modeli, czyli np. dla Message.refs.json określamy że dla ich pola `from` referencją będzie typ modelu `User`, a kolejno w polu `query` podajemy zapytanie jakim mamy wyszukać w tym przypadku użytkownika który w to miejsce zostanie przypisany.

*footnote: Z racji użycia biblioteki @accounts, seedowanie użytkowników skryptem nie jest w pełni możliwe*