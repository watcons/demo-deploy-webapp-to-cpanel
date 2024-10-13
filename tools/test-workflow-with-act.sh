#!/bin/sh
#
# Runs the cpanel-deploy workflow using the act tool.
#
# Intended to be used to test the workflow locally before pushing
# to GitHub.
#################################################################

# Find the path to this script.
SCRIPTPATH=$(dirname $(realpath $0))

PROJECTPATH=$(realpath "$SCRIPTPATH/..")

# Load the .env file if it exists, otherwise advise the user to create it.
if [ -f $SCRIPTPATH/.env ]; then
  . $SCRIPTPATH/.env
else
  echo "Please create a .env file in the same directory as this script: $SCRIPTPATH"
  echo "The .env file should be created from the .env.template file and the environment"
  echo "variables set to match your cPanel host."
  exit 1
fi

# Check that keys and the SSH configuration have been created.
KEYSPATH="$SCRIPTPATH/keys"
if [ ! -f $KEYSPATH/cpanel.key ]; then
  echo "Please run tools/gen-cpanel-keys.sh to create the keys and SSH configuration."
  exit 1
fi

cat > "$KEYSPATH/act-vars" <<END
HOSTING_APP_DOMAIN=$HOSTING_APP_DOMAIN
HOSTING_APP_SUBDOMAIN=$HOSTING_APP_SUBDOMAIN
HOSTING_APP_URLPATH=$HOSTING_APP_URLPATH

HOSTING_SSH_HOST=$HOSTING_SSH_HOST
HOSTING_SSH_HOST_PORT=$HOSTING_SSH_HOST_PORT
HOSTING_SSH_USER=$HOSTING_SSH_USER
HOSTING_APP_INSTALL_DIRECTORY=$HOSTING_APP_INSTALL_DIRECTORY
HOSTING_WEB_INSTALL_DIRECTORY=$HOSTING_WEB_INSTALL_DIRECTORY
END

cat > "$KEYSPATH/act-secrets" <<END
HOSTING_SSH_PRIVATE_KEY=$(cat $KEYSPATH/cpanel.key.singleline)
END

act --platform ubuntu-latest=catthehacker/ubuntu:act-latest --directory "$PROJECTPATH" --workflows "$PROJECTPATH/.github/workflows/cpanel-deploy.yml" --secret-file "$KEYSPATH/act-secrets" --var-file "$KEYSPATH/act-vars" 