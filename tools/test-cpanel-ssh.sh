#!/bin/sh
#
# Establishes an SSH connection to cPanel using the private key and
# SSH configuration from the keys directory.
#
# Intended to be used to confirm that the public key has been added
# to cPanel and authorised for SSH access.
#################################################################

# Find the path to this script.
SCRIPTPATH=$(dirname $(realpath $0))

# Check that keys and the SSH configuration have been created.
KEYSPATH="$SCRIPTPATH/keys"
if [ ! -f $KEYSPATH/cpanel.key ]; then
  echo "Please run tools/gen-cpanel-keys.sh to create the keys and SSH configuration."
  exit 1
fi

# Establish an SSH connection to cPanel using the private key.
ssh -F $KEYSPATH/cpanel-test-ssh-config hosting "echo SSH connection successful"
