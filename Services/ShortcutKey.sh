#!/bin/bash

# This script creates a desktop shortcut to run the application.

# Define the name and path of the shortcut
SHORTCUT_NAME="RunApp"
SHORTCUT_PATH="$HOME/Desktop/$SHORTCUT_NAME.desktop"

# Define the command to execute
COMMAND="/bin/bash $(pwd)/RunApp.sh"

# Create the desktop entry file
cat <<EOF > "$SHORTCUT_PATH"
[Desktop Entry]
Type=Application
Name=$SHORTCUT_NAME
Icon=application-x-executable  # You can change this to a proper icon path
Exec=$COMMAND
Terminal=true  # Set to false if you don't want a terminal to open
Categories=Utility;Application;
EOF

# Make the shortcut executable
chmod +x "$SHORTCUT_PATH"

echo "Shortcut '$SHORTCUT_NAME' created on the desktop.  Use Ctrl+Shift+/ (This is a generic instruction; configure your system's shortcut settings)"

# Instructions for setting up the global keyboard shortcut (This part requires user interaction and may vary depending on the OS and Desktop Environment)
echo "To set up a keyboard shortcut to trigger the script:"
echo "1. Open your system's keyboard shortcuts settings."
echo "2. Create a custom shortcut."
echo "3. Set the command to: $COMMAND"
echo "4. Assign the key combination Ctrl+Shift+/"
echo "   (or the key combination you prefer, noting that it may depend on your OS and desktop environment)."
