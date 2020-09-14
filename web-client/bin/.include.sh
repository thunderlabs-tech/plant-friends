set -e

ROOT=$(cd $(dirname "$0")/../..; pwd)
WEB_CLIENT=${ROOT}/web-client
NPM_BIN=${WEB_CLIENT}/node_modules/.bin
export PATH=${PATH}:${NPM_BIN}

cd ${WEB_CLIENT}
