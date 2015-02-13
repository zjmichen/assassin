#!/bin/sh

apt-get update
apt-get upgrade
apt-get -y install vim zsh curl git build-essential redis-server redis-tools mongodb npm

ln -s /usr/bin/nodejs /usr/bin/node
npm install -g express-generator mocha gulp

su vagrant -c "ln -s /vagrant/app /home/vagrant/app"
su vagrant -c "curl -L http://install.ohmyz.sh | sh"
chsh vagrant -s /usr/bin/zsh
sed -i 's/robbyrussell/terminalparty/g' /home/vagrant/.zshrc
echo "export DEBUG=app" >> /home/vagrant/.zshrc