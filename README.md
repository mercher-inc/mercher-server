Mercher Server
==============

## Dev environment requirements
* [Ubuntu 14.04.1 LTS (Trusty Tahr)](http://releases.ubuntu.com/14.04.1/)
* [JetBrains WebStorm 8.*](http://www.jetbrains.com/webstorm/download/)
* [Node.js 0.10.30](http://nodejs.org/download/)

## Dev environment setup
At first you should go through [Web Client Dev environment setup guide](https://github.com/mercher-inc/mercher-web-client/blob/master/README.md#dev-environment-setup).

### Install PostgreSQL
```bash
sudo apt-get install postgresql postgresql-contrib postgresql-client
```
Log into psql
```bash
sudo -u postgres psql postgres
```
set new password
```
\password postgres
```
press `Ctrl+d` to log out.

Create new database
```bash
sudo createdb --host=localhost --username=postgres --encoding=UTF-8 mercher
```


### Clone repository
Create working folders and clone project repository:
```bash
cd ~/work/mercher-inc
git clone git@github.com:mercher-inc/mercher-server.git
```

### Install dependencies
```bash
cd ~/work/mercher-inc/mercher-server
nvm install
nvm use
npm install
```

### Link to Web Client
Link `public` folder to web client's `dist`:
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
