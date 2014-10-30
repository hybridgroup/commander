#!/usr/bin/env node

(function() {
  'use strict';

  var cordova_util = require('cordova-lib/src/cordova/util');
  var projectRoot = cordova_util.isCordova(process.cwd());
  var projectXml = cordova_util.projectConfig(projectRoot + '/www');
  var projectPlatforms = cordova_util.listPlatforms(projectRoot);
  var CordovaConfigParser,
    projectConfig;

  if ( typeof cordova_util.config_parser === 'undefined' ) {
    CordovaConfigParser = require('cordova-lib').configparser;
    projectConfig = new CordovaConfigParser(projectXml);
  } else {
    projectConfig = new cordova_util.config_parser(projectXml);
  }

  var fs = require ('fs');
  var path = require('path');

  var platformDir = {
    ios: {
      icon: '{$projectName}/Resources/icons',
      splash: '{$projectName}/Resources/splash',
      platformsDir: 'ios',
      nameMap: {

        // iOS >= 7 Settings icon
        // iOS <= 6.1 Small icon for Spotlight search results and Settings (recommended) iPhone
        'icon-29.png': 'icon-small.png',
        'icon-29@2x.png': 'icon-small@2x.png',

        // iOS >= 7 Spotlight search results icon (recommended)
        'icon-40.png': 'icon-40.png',
        'icon-40@2x.png': 'icon-40@2x.png',

        // iOS <= 6.1 Small icon for Spotlight search results and Settings (recommended) iPad
        'icon-50.png': 'icon-50.png',
        'icon-50@2x.png': 'icon-50@2x.png',

        // iOS <= 6.1 App icon (required) iPhone
        'icon-57.png': 'icon.png',
        'icon-57@2x.png': 'icon@2x.png',

        // iOS >= 7 App icon (required) iPhone
        'icon-60.png': 'icon-60.png',
        'icon-60@2x.png': 'icon-60@2x.png',

        // iOS <= 6.1 App icon (required) iPad
        'icon-72.png': 'icon-72.png',
        'icon-72@2x.png': 'icon-72@2x.png',

        // iOS 7 App icon (required) iPad
        'icon-76.png': 'icon-76.png',
        'icon-76@2x.png': 'icon-76@2x.png',

        // 'screen-iphone-landscape.png': 'Default~iphone.png',
        'Default-Portrait~ipad.png': 'Default-Portrait~ipad.png',
        'Default-Portrait@2x~ipad.png': 'Default-Portrait@2x~ipad.png',

        'Default-Landscape@2x~ipad.png': 'Default-Landscape@2x~ipad.png',
        'Default-Landscape~ipad.png': 'Default-Landscape~ipad.png',

        'Default~iphone.png': 'Default~iphone.png',
        'Default@2x~iphone.png': 'Default@2x~iphone.png',
        'Default-568h@2x~iphone.png': 'Default-568h@2x~iphone.png'
      }
    },
    android: {
      icon:'res/drawable-{$density}',
      iconNoDensity:'res/drawable',
      splashNoDensity:'res/drawable',
      splashLandscape:'res/drawable-land-{$density}',
      splashPortrait:'res/drawable-port-{$density}',
      platformsDir: 'android',
      nameMap: {
        'icon.png': 'icon.png',
        'icon-36-ldpi.png': 'icon.png',
        'icon-48-mdpi.png': 'icon.png',
        'icon-72-hdpi.png': 'icon.png',
        'icon-96-xhdpi.png': 'icon.png',
        'screen.png': 'screen.png',
        'screen-landscape-ldpi.png': 'screen.png',
        'screen-landscape-mdpi.png': 'screen.png',
        'screen-landscape-hdpi.png': 'screen.png',
        'screen-landscape-xhdpi.png': 'screen.png',
        'screen-portrait-ldpi.png': 'screen.png',
        'screen-portrait-mdpi.png': 'screen.png',
        'screen-portrait-hdpi.png': 'screen.png',
        'screen-portrait-xhdpi.png': 'screen.png'
      }
    },
    blackberry10: {},
    winphone: {
      icon:'.',
      splash:'.',
      platformsDir: 'wp8',
      nameMap: {
        'icon-62.png': 'ApplicationIcon.png',
        'tile-173.png': 'Background.png',
        'SplashScreenImage.png': 'SplashScreenImage.jpg',
        'screen-portrait-800h.jpg': 'SplashScreenImage.jpg'
      }
    }
  };

  function copyAsset (scope, node) {

    var platform = node.attrib['gap:platform'];
    var density  = node.attrib['gap:density'];
    var assetDirTmpl = platformDir[platform] && platformDir[platform][scope];

    if (!assetDirTmpl) {
      throw new Error('Platform and density not supported: ' + platform + ', ' + density);
    }

    var dict = {
      projectName: projectConfig.name(),
      density: density
    };

    var assetDir = assetDirTmpl.replace(/{\$([^}]+)}/, function (match, p1) {
      return dict[p1];
    });

    var srcPath = path.join(projectRoot, 'www', node.attrib.src);
    var fileName = srcPath.match(/[^\/]+$/)[0];
    if (platformDir[platform] && platformDir[platform].nameMap && platformDir[platform].nameMap[fileName]) {
      fileName = platformDir[platform].nameMap[fileName];
    } else {
      throw new Error('Unknown icon name for platform ' + platform);
    }
    var dstPathDir = path.join(projectRoot, 'platforms', platform, assetDir);
    var dstPath = path.join(projectRoot, 'platforms', platform, assetDir, fileName);

    if (!fs.existsSync (dstPathDir)) {
      console.warn ('template file ' + dstPath + ' does not exist and will not be replaced' );
      return;
    }

    console.log ('copying from '+srcPath+' to the '+dstPath);
    // so, here we start to copy asset
    fs.stat (srcPath, function (err, stats) {
      if (err) {
        throw err;
      }
      var r = fs.createReadStream(srcPath);
      r.on ('open', function () {
        r.pause();
        var w = fs.createWriteStream(dstPath);
        w.on ('open', function () {
          r.pipe(w);
          r.resume();
        });
        w.on ('error', function() {
          throw new Error('Cannot write file');
        });
      });
      r.on ('error', function() {
        throw new Error('Cannot read file');
      });
    });
  }

  var androidIcons = projectConfig.getIcons('android');
  var iosIcons = projectConfig.getIcons('ios')
  var androidSplashScreens = projectConfig.getSplashScreens('android')
  var iosSplashScreens = projectConfig.getSplashScreens('ios')

  androidIcons.map(function (node) {
    if (node.density) {
      copyAsset('icon', { attrib: { 'gap:platform': 'android', src: node.src, 'gap:density': node.density } });
    }
    else {
      copyAsset('iconNoDensity', { attrib: { 'gap:platform': 'android', src: node.src, 'gap:density': null } });
    }
  });

  iosIcons.map(function (node) {
    if (node.width && node.height) {
      copyAsset('icon', { attrib: { 'gap:platform': 'ios', src: node.src } });
    }
  });

  androidSplashScreens.map(function (node) {
    if (node.density && node.src.match(/landscape/)) {
      copyAsset('splashLandscape', { attrib: { 'gap:platform': 'android', src: node.src, 'gap:density': node.density } });
    }
    else if (node.density && node.src.match(/portrait/)) {
      copyAsset('splashPortrait', { attrib: { 'gap:platform': 'android', src: node.src, 'gap:density': node.density } });
    }
    else {
      copyAsset('splashNoDensity', { attrib: { 'gap:platform': 'android', src: node.src, 'gap:density': null } }); 
    }
  });

  iosSplashScreens.map(function (node) {
    if (node.width && node.height) {
      copyAsset('splash', { attrib: { 'gap:platform': 'ios', src: node.src } });
    }
  });

})();
