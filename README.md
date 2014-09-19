Commander
=====================

An app to control robots from your device.

## Installation

### Getting ready to build.

Here there are the basic steps to have running [Commander](https://github.com/hybridgroup/commander) locally.

1. Make sure you have installed [Node.js](http://nodejs.org/):

```bash
$ node -v
v0.x.x
```

If not installed try using home brew `brew install node`, or directly from the [package file](http://nodejs.org/dist/v0.10.31/node-v0.10.31.pkg).

2. Install Ionic, Gulp, Cordova and Phonegap:

```bash
$ sudo npm install -g cordova ionic gulp phonegap
```

If on Windows, avoid using `sudo`.

4. Clone Commander repo and get into it:

```bash
$ git clone git@github.com:hybridgroup/commander.git
$ cd commander
```

Then install the application and run `gulp`in order to get dependencies working locally.

```bash
$ npm install
$ gulp install
```

Now, you are ready to start playing with our application!

### Building, emulating and running.

There are multiple ways you can start playing with Commander. You can either run the web server, emulate the
application using any emulator you prefer, run it as a native app directly on your mobile device or use the
[PhoneGap Developer App](http://app.phonegap.com/). Either way you prefer, you first need to set up the devices
properly.

Here we will explain how to make it run, emulate and run the web service.

#### Web server

For this purpose yo just need to run this command:

```bash
$ ionic serve
```

This will launch a browser tab that will automatically render your changes every time you update your code. Yo can
use it to preview your changes on your mobile device browser as well.

#### Emulate/Run

For this purpose you need to define the platforms you will be working on with the commander app, then set and
configure the emulator properly, according to the [PhoneGap Platform Guides](http://docs.phonegap.com/en/edge/guide_platforms_index.md.html).

Here we will explain how to get your Android platform up and running.

First you need tell Commander which platforms you will be using. In this case, this repo contains Android and iOS
platforms already, so you need to run:

```bash
$ ionic platform android
$ ionic platform ios
```

NOTE: If you aren't on Mac, avoid adding the iOS platform.

In case you need to add more platforms to Commander, you need to run the platform method including your new platforms
as follows:

```bash
$ ionic platform add wp8
```

In the case of Android you need to install the [Android SDK](http://developer.android.com/sdk/index.html) and configure
the emulator beforehand. You might need to configure the [Android Emulator](http://developer.android.com/tools/devices/emulator.html).
Then, in order to make works the Cordova CLI you need to add this to your '~.bash_profile`:

```bash
export PATH=${PATH}:/Development/adt-bundle/sdk/platform-tools:/Development/adt-bundle/sdk/tools
```

The address used on this case is the address you have your android SDK properly installed.

NOTE: For more detailed instructions follow the [PhoneGap Android Platform Guide](http://docs.phonegap.com/en/edge/guide_platforms_android_index.md.html#Android%20Platform%20Guide).

Once you have finished setting your Android SDK configuration, you're ready to emulate the android app. Execute this in
order to build and emulate your app trough the CLI:

With Ionic
```bash
$ ionic build android
$ ionic run android
```

With Cordova
```bash
$ cordova build android
$ cordova emulate android
```

With PhoneGap
```bash
$ phonegap build android
$ phonegap emulate android
```

Ionic runs the application for an Android device instead of emulating it, so we need to use `run` instead of `emulate`.
You can also use a [Genymotion](http://www.genymotion.com/) in order to emulate your app.


Ionic recommends to run this command every time yo made some changes to the `www` folder.

```bash
$ cordova prepare android
```

For running your app directly on your device, you need to replace the command `emulate` with `run`. Example:

```bash
$ ionic run android
```

```bash
$ cordova run android
```

```bash
$ phonegap run android
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

This are the basic steps to have Commander up and running locally.

## Remote controls API connection

In order to obtain a list of available Remote controls/commands for Commander you can start a service that provides
them. Commander, currently, is able to get this list and parse it, so you can choose from a variety of available
commands, instead of typing them manually.

The service provider for this purpose must return an array that contains available commands in JSON format. Those
commands will require the following parameters:

* label  - The name of the command.
* robot  - Robot that the command will manipulate.
* device - Device that the command will utilize.
* name   - Command name to be interpreted. It will identify the command purpose, example: `sendNotification`
* params - A hash that contains the params the command will require for it's purpose, this param is optional.

Example:
```json
{commands: [
  {
    label: 'Say hello',
    robot: 'pebble',
    device: 'pebble',
    name: 'sendNotification',
    params: {message: 'Hello'}
  }
]}
```

Once you have your service provider URL, you will need to configure it into the Commander app. Just go to the
`Import Commands` and click onto the `Remotes Config` button, this will redirect you to the API end point configuration,
update it according to your service host and port.

## Testing

A testing framework was previously installed on the commander app. In order to run it, make sure you have installed
the most recent packages dependencies for Commander app. Run this:

```bash
$ bower install
$ gulp install
```

Then just run the test suite:

```bash
$ npm test
```

It will automatically execute your tests every time you modify the observed files.

## Workarounds

For testing purposes, we have added Android and iOS platforms to the repo, since those are not commonly uploaded to a
PhoneGaph project. But, due some of the config file addresses local files you need to run, for android, this commands:

```bash
$ android update project -p platforms/android/
$ android update project -p platforms/android/CordovaLib
```

That will generate a `local.properties` file which contains the location of the SDK.

Watch ionic SASS when in Development mode will be helpful. Execute the following command when customizing ionic SCSS files:

```bash
$ sass --watch scss/ionic.app.scss:www/lib/ionic/css/ionic.css
```
