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

### Install Knex
```bash
npm install knex -g
```

### Install Redis server
```bash
sudo apt-get install redis-server
```

### Install ImageMagick
```bash
sudo apt-get install imagemagick
```

### Configure server
Update config file
```bash
sudo nano /etc/apache2/sites-available/local.mercherdev.com.conf
```
Paste config
```
<VirtualHost *:80>
  ServerName local.mercherdev.com
  ProxyRequests Off
  <Proxy *>
    Order deny,allow
    Allow from all
  </Proxy>
  ProxyPreserveHost on
  ProxyPass /swagger   http://localhost:3000/swagger
  ProxyPass /api       http://localhost:3000/api
  ProxyPass /socket.io http://localhost:3000/socket.io
  ProxyPass /          http://localhost:9000/
</VirtualHost>
```
Reload configuration
```bash
sudo service apache2 reload
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

### Continous Integration
You can find a Change Log [here](http://tc.mercherdev.com/viewType.html?buildTypeId=MercherServer_Build&tab=buildTypeChangeLog&branch_Mercher2_MercherServe=__all_branches__&from=&to=&userId=id%3A1&path=&showBuilds=true&changesLimit=1).

Have fun!

