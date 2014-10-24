#
# (OS X, Unix and Linux)
#
# What is this?
#
# It's a shell script that is using ImageMagick to create all the icon files from one source icon.
#
# Stick the script in your 'www/res/icons' folder with your source icon 'my-hires-icon.png' then trigger it from Terminal.
#
 
ICON=${1:-"icon.png"}
 
mkdir android
convert $ICON -resize 36x36 android/icon-36-ldpi.png
convert $ICON -resize 48x48 android/icon-48-mdpi.png
convert $ICON -resize 72x72 android/icon-72-hdpi.png
convert $ICON -resize 96x96 android/icon-96-xhdpi.png
 
mkdir ios
convert $ICON -resize 29 ios/icon-29.png
convert $ICON -resize 40 ios/icon-40.png 
convert $ICON -resize 50 ios/icon-50.png 
convert $ICON -resize 57 ios/icon-57.png
convert $ICON -resize 58 ios/icon-29@2x.png
convert $ICON -resize 60 ios/icon-60.png
convert $ICON -resize 72 ios/icon-72.png
convert $ICON -resize 76 ios/icon-76.png  
convert $ICON -resize 80 ios/icon-40@2x.png
convert $ICON -resize 100 ios/icon-50@2x.png
convert $ICON -resize 114 ios/icon-57@2x.png     
convert $ICON -resize 120 ios/icon-60@2x.png
convert $ICON -resize 144 ios/icon-72@2x.png
convert $ICON -resize 152 ios/icon-76@2x.png
