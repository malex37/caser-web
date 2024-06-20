#! /bin/bash
DIAGRAMS_FOLDER="./docs/diagrams"
FILENAME="$1"
PYTHON="$(which python)"
if [[ $PYTHON == "" ]]; then
  echo "Python missing from path. Add python to PATH and try again"
  return -1
fi
echo "File name chosen $FILENAME"
echo "Python located at $PYTHON"
CMD="$PYTHON $DIAGRAMS_FOLDER/$FILENAME.py"
$CMD

