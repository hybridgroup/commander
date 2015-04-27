Commander
=====================

A mobile app to control robots and connected devices.

## Build Status:

[![Build Status](https://secure.travis-ci.org/hybridgroup/commander.png?branch=master)](https://travis-ci.org/hybridgroup/commander)

## Screenshots

![screen1](http://i.imgur.com/kQkZAV7.jpg)
![screen2](http://i.imgur.com/sBfGocQ.jpg)
![screen3](http://i.imgur.com/lCc4irL.jpg)

## How It Works

The Commander mobile application can communicate with any device using the [Common Protocol for Programming Physical I/O](http://cppp.io).

[Cylon](http://cylonjs.com), [Gobot](http://gobot.io) and [Artoo](http://artoo.io) are frameworks that implement an API compatible with this protocol.

Commander can be used to send commands to your robots or listen for events coming from them.

The connection to your robots can be accomplished by using http, web sockets or mqtt protocols.

You can load a "command set" that is a list of the preconfigured commands and you can choose between different types of layouts.


## Using Commander

### Download:

[![Google Play](http://developer.android.com/images/brand/en_generic_rgb_wo_60.png)](https://play.google.com/store/apps/details?id=com.hybridgroup.commander)
[![iTunes](http://i.imgur.com/rlNTuWQ.png)](https://itunes.apple.com/us/app/commander.io/id935923011?mt=8)

### Configure your robot API url

This is where you set the robots server endpoint, frameworks by default use port 3000. Visit [API Guide](http://cylonjs.com/documentation/core/api/) for more information.

Use the ip of the machine where the server is running instead of localhost, so it can be reached from your phone. Also make sure you phone is connected to the same network.

To Add a Connection:

1. Go to the right Menu -> Connection
2. On the API URL field, type the url of your robot's API server. (Ex: http://192.168.15.11:3000)
3. In case your serve requires Authentication, please select the type of authentication required by your server. We currently only support `basic` authentication. 
4. Click Save


To Edit a Connection:

1. Go to the right Menu -> Connection
2. Click on the connection you want to edit.
3. Enter the new details of your connection.
4. Click on the save button.
5. Click on the cancel button to cancel the action.


To Switch to a different Connection:

1. Go to the right Menu -> Connection
2. Locatet the connection you want to use and click on the 'Use' button.


### Loading Command Sets

To create commands you need to load a command set from a json file or from your current API connection. This allows you to store your command set alongside your robot, therefore you won't need to enter command details manually.

Visit https://github.com/hybridgroup/commander/tree/master/examples for some command set examples.

Loading command sets from a json file gives you the opportunity to define your type of command set layout to use, like a `joystick` for example, define how many joysticks do you want, if you need buttons, etc.

Loading command sets from API or current connection, will create a default `list` command set.


#### Loading From JSON file.

Loading from a json file hosted on a server.

1. Go to the right Menu -> Command Sets
2. Locate and expand the Load command sets from json section, On the URL field, type the url where your json command set is hosted. (Ex: https://raw.githubusercontent.com/hybridgroup/commander/master/examples/arduino/arduino-list.json)
3. In case your json file is hosted on a server that requires authentication, please select the authentication type and enter the authentication details.
4. Click Load button
5. Once loaded, click on the 'Use' button.

Loading from a json file returned by an API compatible with cppp-io.

1. Go to the right Menu -> Command Sets
2. Locate and expand the Load command sets from json section, On the URL field, type the url of your API. (Ex. http://127.0.0.1:8080/api, http://127.0.0.1:8080/api/robots/my-robot, http://127.0.0.1:8080/api/robots/my-robot/commands)
3. Click Load button
4. Once loaded, click on the 'Use' button.


#### Loading From Current Connection.

1. Go to the right Menu -> Command Sets
2. Locate and expand the Load command sets from connection.
3. Click Load button


### Defining Protocols

#### HTTP:

This is the default protocol commander uses. The command set can include a `protocol` key with the `http` value, if not included, http will be used.

Commander current connection should point to your robot http api.

Commands will be execute by sending simple REST requests.

#### WS:

Enable connection through web socket by setting the `protocol` key on your command set to `socketio`.

A web socket will be created using the current commander connection host and port.

Commands will be executed by emitting events through the web socket.

#### MQTT:

Enable connection through mqtt by setting the `protocol` key on your command set to `mqtt`.

A web socket will be created using the current commander connection host and port.

Commands will be executed by publishing messages to the mqtt broker.


### Using Command Sets

#### Select command set to use

1. Go to the right Menu -> Command Sets
2. On the Local Command Sets list, click the 'Use' button on the command set you want to use.

##### List

Once selected, just tap on any of the commands on the list. This will execute the command on the robot api.

![screen3](http://i.imgur.com/L51DgtN.jpg)

#### D-Pad

Once selected, just tap on any of the buttons, up, down, left or right. This will execute the command on the robot api.

![screen2](http://i.imgur.com/lCc4irL.jpg)

#### Joystick

Once selected, just move the joystick or touch the buttons. This will execute the command on the robot api.

![screen2](http://i.imgur.com/sBfGocQ.jpg)

### Command Activity Log

1. You should see a green/red indicator on the top/right corner of a command set window. That indicates the execution status of the last command tapped.
2. Click the green/red indicator for more info about the command execution status.

#### Create your own command set

Command sets are a json object with a `command_set` root and the following attributes:

* name
* type (list/d-pad)
* commands
* protocol
* orientation

#### Command set structure

* `name` - The name of the command set, it must be unique. If you load a command set with the same twice the command set will be updated, not duplicated.
* `type` - There are currently two possible options:
  * `list` - A list of buttons
  * `d-pad` - A directional pad (up, down, left, right)
  * `joystick` - A single or double joystick with action buttons.
* `commands` - It's an array of commands
* `protocol` - Type of protocol to use, currently we support `http` and `socketio`. If not present, default is `http`.
* `orientation` - Lock orientation on your device while using the current command set (landscape|portrait).

#### Command structure

* `label`  - For a button list, this is the label of the button.
* `robot`  - Name of the robot the command that will be executed in.
* `device` - Name of the device the command that will be executed in. If the command is a robot command, leave this blank.
* `name`   - Actual command name as defined in the API. Example: `sendNotification`
* `type`   - Used to render a `stick` for joysticks or a `button` for `joystick` and `d-pad` command sets.
* `color`   - Used for buttons only, when color is present (red|gree|blue|yellow), the button style will be rendered with the specified color, default is `white`.
* `params` - An object/hash that contains the params the command requires, it's optional.

####Command Structure Extras

* You can combine buttons within `d-pad` or `joystick` command sets. If commands of type `button` are present, buttons will be rendered bellow the `joystick` or `d-pad`.
* You can have a single or a double `joystick`.
* `button` commands will send 2 requests with an extra `action` param, one request for the press action `action:'press'` and one for the release action `action:'release'`.
* `stick` commands will send a single request every time the position of the stick changes, sending the position param as `position:{'x':0.1,'y':0.5}`.


**List Layout Structure Example:**
```json
{
  "command_set": {
    "name": "Command set name",
    "type": "list",
    "commands": [
      {
        "label": "Robot move forward",
        "robot": "r2-d2",
        "device": "",
        "name": "move_forward",
        "params": {"velocity": 1000}
      },
      {
        "label": "Device blink",
        "robot": "r2-d2",
        "device": "back_led",
        "name": "blink",
        "params": {"color": "blue"}
      }
    ]
  }
}
```

Here is an example of a command set with a D-Pad layout to control a Sphero robot: https://github.com/hybridgroup/commander/blob/master/examples/sphero-dpad/sphero-dpad.json

### Help!

If you have any question or you found an issue, please [let us know](https://github.com/hybridgroup/commander/issues/new)

You can also found us on irc channel #robotops

## Development

Commander has been developed using PhoneGap (http://phonegap.com/) and Ionic Framework (http://ionicframework.com/)

### Getting ready to build.

Here there are the basic steps to have running [Commander](https://github.com/hybridgroup/commander) locally.

1. Make sure you have installed [Node.js](http://nodejs.org/):

```bash
$ node -v
v0.x.x
```

If not installed try using homebrew `brew install node`, or directly from the [package file](http://nodejs.org/dist/v0.10.31/node-v0.10.31.pkg).

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

Then install the application and run `gulp` in order to get dependencies working locally.

```bash
$ npm install
$ gulp install
```

Now, you are ready to start playing with Commander!

### Building, emulating and running.

There are multiple ways you can start playing with Commander. You can either run the web server, emulate the
application using an emulator of your choice, run it as a native app directly on your mobile device or use the
[PhoneGap Developer App](http://app.phonegap.com/). Either way, you first need to setup the devices properly.

#### Web server

For this purpose you just need to run this command:

```bash
$ ionic serve
```

This will launch a browser tab that will automatically render your changes every time you update your code. You can use it to preview your changes on your mobile device's browser as well.

#### Emulate/Run

For this purpose you need to define the platforms you will be working on with the commander app, then set and configure the emulator properly, according to the [PhoneGap Platform Guides](http://docs.phonegap.com/en/edge/guide_platforms_index.md.html).

First you need tell Commander which platforms you will be using, so you need to run:

```bash
$ ionic platform add android
$ ionic platform add ios
```

**NOTE: If you aren't on Mac, avoid adding the iOS platform.**

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

The path used in this case is the path where you have your android SDK properly installed.

Next you need to update the android project to add the location.properties file containing the SDK location:

```bash
$ android update project --subprojects -p platforms/android/
```

**NOTE: For more detailed instructions follow the [PhoneGap Android Platform Guide](http://docs.phonegap.com/en/edge/guide_platforms_android_index.md.html#Android%20Platform%20Guide).**

Once you have finished configuring your Android SDK, you're ready to emulate the Android app. Execute this in order to build and emulate your app trough the CLI:

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


Ionic recommends to run this command any time you make changes to the `www` folder.

```bash
$ cordova prepare android
```

For running your app directly on your device, you need to replace the `emulate` command with `run`. Example:

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

## Plugins

If you need to add a plugin

```bash
$ cordova plugin add org.apache.cordova.device
```

**Note: You need to add your plugin to plugins.json config file in order to maintain the build process successful.**

## Testing

The code for Commander includes a number of automated tests. In order to run them, make sure you've installed the most recent packages dependencies for Commander. In order to do this, run:

```bash
$ bower install
$ gulp install
```

Then just run the test suite:

```bash
$ npm test
```

It will automatically execute your tests every time you modify the observed files.

## Styles

In order to modify styles of commander application, you need to work on the www/scss files and use gulp to compile and watch changes on your files. Remember to compile before build and test on a device.

```bash
$ gulp commander # To compile scss files
$ gulp watch-commander # To keep watching changes on scss files
```

In order to modify global styles of ionic framework, you need to watch for changes on www/lib/ionic/scss files.

```bash
$ sass --watch scss/ionic.app.scss:www/lib/ionic/css/ionic.css
```

## License

Copyright (c) 2014 The Hybrid Group. Licensed under the Apache 2.0 license.
