<!---
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->

# org.apache.cordova.device

Ten plugin określa globalne `device` obiekt, który opisuje urządzenia sprzętowe i programowe. Mimo, że obiekt jest w globalnym zasięgu, nie jest dostępne dopiero po `deviceready` zdarzenie.

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        console.log(device.cordova);
    }
    

## Instalacji

    cordova plugin add org.apache.cordova.device
    

## Właściwości

*   device.cordova
*   device.model
*   device.name
*   device.platform
*   device.uuid
*   device.version

## device.cordova

Pobierz wersję Cordova działa na urządzeniu.

### Obsługiwane platformy

*   Amazon ogień OS
*   Android
*   Jeżyna 10
*   Firefox OS
*   iOS
*   Tizen
*   Windows Phone 7 i 8
*   Windows 8

## device.model

`device.model`Zwraca nazwę modelu lub produktu. Wartość jest zestaw przez producenta urządzenia i mogą się różnić między wersjami tego samego produktu.

### Obsługiwane platformy

*   Android
*   Jeżyna 10
*   iOS
*   Tizen
*   Windows Phone 7 i 8
*   Windows 8

### Szybki przykład

    / / Android: Nexus One zwraca "Pasja" (nazwa kodowa Nexus One) / / Motorola Droid zwraca "voles" / / BlackBerry: Torch 9800 zwraca "9800" / / iOS: iPad Mini, zwraca iPad2, 5; iPhone 5 jest iPhone 5,1. Zobacz http://theiphonewiki.com/wiki/index.php?title=Models / / modelu var = device.model;
    

### Android dziwactwa

*   Pobiera [nazwę produktu][1] zamiast [nazwy modelu][2], który często jest nazwą kod produkcji. Na przykład, Nexus One zwraca `Passion` , i zwraca Motorola Droid`voles`.

 [1]: http://developer.android.com/reference/android/os/Build.html#PRODUCT
 [2]: http://developer.android.com/reference/android/os/Build.html#MODEL

### Osobliwości Tizen

*   Zwraca modelu urządzenia przypisane przez dostawcę, na przykład,`TIZEN`

### Windows Phone 7 i 8 dziwactwa

*   Zwraca modelu urządzenia, określonej przez producenta. Na przykład Samsung ostrości zwraca`SGH-i917`.

## device.name

**Ostrzeżenie**: `device.name` jest przestarzała od wersji 2.3.0. Użycie `device.model` zamiast.

## device.platform

Uzyskać nazwę systemu operacyjnego urządzenia.

    var string = device.platform;
    

### Obsługiwane platformy

*   Android
*   Jeżyna 10
*   Firefox OS
*   iOS
*   Tizen
*   Windows Phone 7 i 8
*   Windows 8

### Szybki przykład

    // Depending on the device, a few examples are:
    //   - "Android"
    //   - "BlackBerry 10"
    //   - "iOS"
    //   - "WinCE"
    //   - "Tizen"
    var devicePlatform = device.platform;
    

### Windows Phone 7 dziwactwa

Urządzenia Windows Phone 7 raport platformy jako`WinCE`.

### Windows Phone 8 dziwactwa

Urządzenia Windows Phone 8 raport platformy jako`Win32NT`.

## device.uuid

Się urządzenia uniwersalnie unikatowy identyfikator ([UUID][3]).

 [3]: http://en.wikipedia.org/wiki/Universally_Unique_Identifier

    var string = device.uuid;
    

### Opis

Szczegóły jak UUID jest generowane są określane przez producenta urządzenia i są specyficzne dla platformy lub modelu urządzenia.

### Obsługiwane platformy

*   Android
*   Jeżyna 10
*   iOS
*   Tizen
*   Windows Phone 7 i 8
*   Windows 8

### Szybki przykład

    / / Android: zwraca losowe 64-bitowa liczba całkowita (jako ciąg, znowu!) / / liczba całkowita jest generowany na pierwszego uruchomienia urządzenia / / / / BlackBerry: zwraca numer PIN urządzenia / / to jest unikatową liczbą całkowitą dziewięciu cyfr (jako ciąg, choć!) / / / / iPhone: (zacytowana w dokumentacji klasy UIDevice) / / zwraca ciąg wartości mieszania utworzone z wielu sprzętu identyfikuje.
    Zapewniona jest unikatowy dla każdego urządzenia i nie może być związane z / do konta użytkownika.
    / / Windows Phone 7: zwraca wartość mieszania urządzenia + bieżący użytkownik, / / jeśli nie zdefiniowane przez użytkownika, identyfikator guid jest generowany i będzie trwać do czasu odinstalowania aplikacji / / Tizen: zwraca urządzenia IMEI (International Mobile Equipment Identity lub IMEI jest liczbą / / unikatowe dla każdego telefonu komórkowego GSM i UMTS.
    var deviceID = device.uuid;
    

### iOS dziwactwo

`uuid`Na iOS nie jest przypisany do urządzenia, ale różni się dla każdej aplikacji, dla każdej instalacji. Zmienia się jeśli możesz usunąć i ponownie zainstalować aplikację, a ewentualnie także po aktualizacji iOS czy nawet uaktualnienia aplikacji dla wersji (widoczny w iOS 5.1). `uuid`Jest nie wiarygodne wartości.

### Windows Phone 7 i 8 dziwactwa

`uuid`Dla Windows Phone 7 wymaga zgody `ID_CAP_IDENTITY_DEVICE` . Microsoft będzie prawdopodobnie potępiać ten wkrótce. Jeśli funkcja nie jest dostępna, aplikacja generuje trwałe identyfikator guid, który jest utrzymywany przez czas trwania instalacji aplikacji na urządzeniu.

## device.version

Pobierz wersję systemu operacyjnego.

    var string = device.version;
    

### Obsługiwane platformy

*   Android 2.1 +
*   Jeżyna 10
*   iOS
*   Tizen
*   Windows Phone 7 i 8
*   Windows 8

### Szybki przykład

    / / Android: Froyo OS zwróci "2.2" / / Eclair OS zwróci "2.1", "2.0.1" lub "2.0" / / wersji mogą również zwracać zaktualizować poziom "2.1-update1" / / / / BlackBerry: 9800 Torch za pomocą OS 6.0 zwróci "6.0.0.600" / / / / iPhone: iOS 3.2 zwraca "3.2" / / / / Windows Phone 7: Zwraca bieżący numer wersji systemu operacyjnego, ex. on Mango returns 7.10.7720
    // Tizen: returns "TIZEN_20120425_2"
    var deviceVersion = device.version;