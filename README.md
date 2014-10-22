Commander
=====================

An app to control robots from your mobile device.

## How It Works

The Commander mobile application can communicate with any device that supports the Common Protocol for Programming Physical I/O (http://cppp.io).

You will need to be able to connect to your device via http, in order to use Commander to control it.

Commander can load a "command set" that is a list of the commands you can send to your robot(s), along with the type of user interface that should be used for the command set. For example a "list" of commands, or a D-PAD interface.

## Using Commander

### Configure your robot API url

1. Go to the right Menu -> Connection
2. On the API URL field, type the url of your robot's API server.
3. Click Save.

### Loading command sets

Currently, the only way to create commands is by loading a command set via a service (JSON API). This allows you to store your command set alongside your robot, and you won't need to enter command details manually.

#### Steps

1. Go to the right Menu -> Command Sets
2. On the URL field, type the url of your command set service.
3. Click Load button.
4. On the Local Command Sets list, click the 'Use' button, to use your new loaded command set.


#### Command Sets Format

The service provider for this purpose must return the following structure in JSON format:

**List Layout:**
```json
{
  command_set: {
    name: "Command set name",
    type: "list or d-pad",
    commands: [
      {
        label: "Command name 1",
        robot: "Robot name",
        device: "Device name",
        name: "Command name",
        params: {param1: "value1"}
      },
      {
        label: "Command name 2",
        robot: "Robot name",
        device: "Device name",
        name: "Command name",
        params: {param1: "value1"}
      }
    ]
  }
}
```
Here is an example of a command set with a D-PAD layout to control a Sphero robot:

**D-Pad Layout**
```json
{
  "command_set":{
    "name": "Sphero Command D-Pad",
    "type": "d-pad",
    "commands":[
      {
        "label": "Up",
        "robot": "sphero",
        "device": "",
        "name": "up",
        "params":{}
      },
      {
        "label": "Down",
        "robot": "sphero",
        "device": "",
        "name": "down",
        "params":{}
      },
      {
        "label": "Left",
        "robot": "sphero",
        "device": "",
        "name": "left",
        "params":{}
      },
      {
        "label": "Right",
        "robot": "sphero",
        "device": "",
        "name": "right",
        "params":{}
      }
    ]
  }
}
```

#### Command set structure

* `name` - The name of the command set, it must be unique. If you load a command set with the same twice the command set will be updated, not duplicated.
* `type` - There are currently two possible options:
  * `list` - A list of buttons
  * `d-pad` - A directional pad (up, down, left, right)
* `commands` - It's an array of commands

#### Command structure

* `label`  - For a button list, this is the label of the button.
* `robot`  - Name of the robot the command that will be executed in.
* `device` - Name of the device the command that will be executed in. If the command is a robot command, please leave this blank.
* `name`   - Actual command name as defined in the API. Example: `sendNotification`
* `params` - An object/hash that contains the params the command requires, it's optional.


### Using Command Sets

#### Select command set to use

1. Go to the right Menu -> Command Sets
2. On the Local Command Sets list, click the 'Use' button on the command set you want to use.


#### Using a List Command Set

1. Once selected a list command set, just tap on any of the commands on the list. This will execute the command on the robot api.

#### Using a D-Pad Command Set

1. Once selected a d-pad command set, just tap on any of the buttons, up, down, left or right. This will execute the command on the robot api.

#### Command Activity Log

1. You should see a green/red indicator on the top/right corner of a command set window. That indicates the execution status of the last command tapped.
2. Click the green/red indicator for more info about the command execution status.

## Building

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

Then install the application and run `gulp` in order to get dependencies working locally.

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

First you need tell Commander which platforms you will be using, so you need to run:

```bash
$ ionic platform add android
$ ionic platform add ios
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

Next you need to update the android project to add the location.properties file contaning the sdk location:

```bash
$ android update project --subprojects -p platforms/android/
```

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

## Plugins

If you need to add a plugin"

```bash
$ cordova plugin add org.apache.cordova.device
```

Note: You need to add your plugin to plugins.json config file in order to maintain the build process successful.

## Testing

The code for Commander includes a number of automated tests. In order to run them, make sure you have installed
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

Watch ionic SASS when in Development mode will be helpful. Execute the following command when customizing ionic SCSS files:

```bash
$ sass --watch scss/ionic.app.scss:www/lib/ionic/css/ionic.css
```
