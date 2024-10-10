#!/bin/sh
#
# Generates a new 521 bit ECDSA key pair intended to authenticate
# SSH access to a cPanel account.
#
# Produces an SSH configuration file that can be used to test
# SSH authentication once the public key has been added to the
# cPanel account.
#################################################################

# Find the path to this script.
SCRIPTPATH=$(dirname $(realpath $0))

# Load the .env file if it exists, otherwise advise the user to create it.
if [ -f $SCRIPTPATH/.env ]; then
  . $SCRIPTPATH/.env
else
  echo "Please create a .env file in the same directory as this script: $SCRIPTPATH"
  echo "The .env file should be created from the .env.template file and the environment"
  echo "variables set to match your cPanel host."
  exit 1
fi

# Create a directory to store the keys.
KEYSPATH="$SCRIPTPATH/keys"
mkdir -p $KEYSPATH

# Produce a new 521 bit ECDSA key pair with no passphrase.
ssh-keygen -t ecdsa -b 521 -f $KEYSPATH/cpanel.key -N ""

# Create a single line version of the private key.
awk '{printf "%s\\n", $0}' $KEYSPATH/cpanel.key > $KEYSPATH/cpanel.key.singleline

# Produce an SSH configuration file that can be used to test SSH authentication.
cat > $KEYSPATH/cpanel-test-ssh-config <<END
Host hosting
  HostName $HOSTING_SSH_HOST
  Port $HOSTING_SSH_HOST_PORT
  User $HOSTING_SSH_USER
  IdentityFile $KEYSPATH/cpanel.key
  StrictHostKeyChecking no
  BatchMode yes
  PubkeyAuthentication yes
END

echo "New ECDSA key pair created in $KEYSPATH"
echo "Use cPanel to import the public key from $KEYSPATH/cpanel.key.pub"
echo "Authorise the new key for SSH access and then run tools/test-cpanel-ssh.sh"
echo "to confirm that the key has been correctly added and authorised."