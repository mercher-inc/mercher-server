Mercher Server
==============

## Dev environment requirements
* [Ubuntu 14.04.1 LTS (Trusty Tahr)](http://releases.ubuntu.com/14.04.1/)
* [JetBrains WebStorm 8.*](http://www.jetbrains.com/webstorm/download/)
* [Node.js 0.10.*](http://nodejs.org/download/)

## Dev environment setup
At first you should download and setup Ubuntu. Hope you can do it by yourself.
Then download WebStorm to the home directory, unpack the WebStorm-8.*.tar.gz file using the following command:
```bash
tar xfz WebStorm-8.*.tar.gz
```
Now update your local package index:
```bash
sudo apt-get update
```

### Install GIT
```bash
sudo apt-get install git
```
and then go through [this manual](https://help.github.com/articles/set-up-git) to set up git.

### Clone repository
Create working folders and clone project repository:
```bash
cd ~
mkdir work
cd work
mkdir mercher-inc
cd mercher-inc
git clone git@github.com:mercher-inc/mercher-server.git
```

### Install Node.js
```bash
sudo apt-get install build-essential
sudo apt-get install curl
echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.bashrc
. ~/.bashrc
mkdir ~/local
mkdir ~/node-latest-install
cd ~/node-latest-install
curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
./configure --prefix=~/local
make install
curl -L https://npmjs.org/install.sh | sh
node -v
```

### Install dependencies
```bash
cd ~/work/mercher-inc/mercher-server
npm install
```

### Install Web Client
Go through [Mercher Web Client setup process](https://github.com/mercher-inc/mercher-web-client#dev-environment-setup) and then link `public` folder to web client's `dist`:
```bash
ln -s ~/work/mercher-inc/mercher-web-client/dist/ ~/work/mercher-inc/mercher-server/public
```

### Install Swagger UI
Install and build Mercher's Swagger UI
```bash
cd ~/work/mercher-inc/
git clone git@github.com:mercher-inc/swagger-ui.git
cd swagger-ui
npm install
npm run-script build
```
And then link it to the project
```bash
ln -s ~/work/mercher-inc/swagger-ui/dist/ ~/work/mercher-inc/mercher-server/swagger
```
### Start application
```bash
cd ~/work/mercher-inc/mercher-server
node app
```

Have fun!
