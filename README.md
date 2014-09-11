Commander
=====================

An app to control robots from your device

## Building

```bash
$ ionic build ios
$ ionic build android
```

## Running

To run project in iOS emulator:
```bash
$ ionic emulate ios
```

To run project in android device (You can use [Genymotion](http://www.genymotion.com/) too):

```bash
$ ionic run android
```

## Installation

```bash
$ sudo npm install -g cordova ionic gulp
$ npm install
$ gulp install
```

## Configuration

### Android

Execute the following commands:

    $ android update project -p platforms/android/
    $ android update project -p platforms/android/CordovaLib

That will generate a `local.properties` file which contains the location
of the SDK.

## Watch ionic SASS

Execute the following command when customizing ionic SCSS files:

```bash
$ sass --watch scss/ionic.app.scss:www/lib/ionic/css/ionic.css
```
