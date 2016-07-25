# Pokemon GO Optimizer
In Pokemon GO, each Pokemon has hidden values that determine its maximum attainable HP and CP known as individual values — or IVs for short. The goal of this project is to display these hidden values to the user as painlessly as possible, while giving insight into each Pokemon's combat abilities.

While this app is relatively undetectable, if Niantic contacts me and requests that I discontinue development, I will comply. Until then, please be aware that you are using this at your own risk.

![example](http://i.imgur.com/Qw9dSW1.png)

## Host Setup

## A Note About Windows
Currently, it is very difficult to get this program working on Windows. Until a fully javascript implementation of protobuf can be utilized, Windows support will not be provided. For the time being, the recommended solution is Docker. If anyone would like to contribution documentation on how to get this project running flawlessly on Windows with Docker, please contact me.

### WIP Windows Process 

- Install docker-toolbox
- Launch docker through start.sh in docker-toolbox
- Find your ip address on the network (with ipconfig e.g, beware, don't use the virtual adapters one), let's name this MYIP
- Open virtualbox, configure the "default" vm, and in network settings, go to "ports redirection". Add one for MYIP, 3000, 3000, and one for MYIP 8081 8081
- Launch the app through git clone + docker run (not working atm with direct docker-registry download for some reason)
- Verify in firefox that MYIP:3000 correctly gives the pogo website
- Follow phone instructions
- Enjoy

### Mac OSX

Run these commands:

```
brew install node
brew install git
brew install pkg-config
brew install --devel protobuf
git clone https://github.com/justinleewells/pogo-optimizer
cd pogo-optimizer
npm install
npm run install-libs
npm start
```

### Linux

Run the commands below for your flavor of choice to get the necessary dependencies, [then see "Common"](#common) below for usage.

#### RPM-based (Fedora, CentOS, RHEL)

```
sudo dnf install nodejs protobuf protobuf-devel npm
```

If your distribution is newer (e.g. F24+), npm is included with nodejs and you won't need both.

#### Arch Linux

```
sudo pacman -S nodejs protobuf npm
```

#### Deb based (Debian, Ubuntu, Raspbian, et al)

For Debian stable, you'll need the latest node from sources:

```
sudo apt-get install -y curl build-essential libprotobuf-dev git pkg-config
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install nodejs

```

For Debian testing, you can just get nodejs from the repository:

```
sudo apt-get install -y build-essential libprotobuf-dev git pkg-config nodejs
```

#### Common

After you install the necessary packages, all Linux flavors follow this routine:

```
git clone https://github.com/justinleewells/pogo-optimizer
cd pogo-optimizer
npm install
npm run install-libs
npm start
```

This should launch the webserver on localhost:3000.

### Setup using Docker
To install and setup everything using Docker, build the image in the root directory of this repository with:

```bash
$ git clone https://github.com/justinleewells/pogo-optimizer.git
$ cd pogo-optimizer
$ docker build -t pogo .
```

Then create a container with the same ports as described above with this command:

```bash
$ docker run -d -p 3000:3000 -p 8081:8081 -it pogo
```

All ports are not accessible and usable as described above.

### Docker setup for Windows (Docker)
Docker is VM software that will make running Pokemon Go Optimizer easier on Windows.
This will require Hyper-V to be enabled on your CPU, this may need enabling in the BIOS if your CPU supports it.
Some CPU's are not supported but if you have (Intel) VT-x or (AMD) AMD-V on the CPU this should work.

First install [Docker](https://docs.docker.com/docker-for-windows/)
If you do not have the Hyper-V installed from Microsoft, after running Docker for the first time, it will give you a warning.
Accept this warning to install and restart your PC, if this does not work, there are manual instructions on how to complete this installation.

Next launch Command Line and use the docker commands above using the lastet version by downloading the ZIP file (if you have Git installed you can grab the latest version using the git command as well).

```
git clone https://github.com/justinleewells/pogo-optimizer.git
cd pogo-optimizer
docker build -t pogo .
```

If you do not have git installed you can use the following command to automatically get the lastest version of PoGo Optimizer (I have not tested this).

```
docker run -d -p 3000:3000 -p 8081:8081 -it cmeter/pogo-optimizer
```

This should now run the latest version of Pokemon Go Optimizer! check using http://localhost:3000/

If this website is not accessible on other devices in your network, then you have some problems with your firewall setup and should disable it for ease of use. You could also setup firewall policies that allow inbound and outbound traffic on port 3000 and 8081.

If these Docker instructions didn't work for you, check out [this](https://www.reddit.com/r/TheSilphRoad/comments/4tk33a/pokemon_go_optimizer_automatically_detect_pokemon/d5nyshi) Reddit post by mgxts for further instruction.

## Phone Setup

Before proceeding to phone setup, you should have a webserver running on your host computer, and your phone and host computer
should be connected to the same network.

Check your host computer's network settings for your IP address.
If your host computer's IP is 10.0.1.3, you'll visit http://10.0.1.3:3000 on your phone to view the pogo-optimizer application.
Verify you can connect before continuing.

Next, visit http://10.0.1.3:3000/ca.pem and install the certificate.

Then, add 10.0.1.3 port 8081 as a proxy for your WiFi connection on your phone.

Lastly, after accepting the certificate and enabling the proxy, open Pokemon GO on your phone.
After you can see your character walking around, go to http://localhost:3000 on your host machine. Enjoy!

### iOS

To set up a WiFi proxy on your iOS 9.0.0+ phone, follow these steps:

* Go to Settings > Wi-Fi
* Click the information icon beside the network you are connected to
* Select 'Manual' in the HTTP Proxy settings at the bottom
* Enter e.g. 10.0.1.3 as the server
* Enter 8081 as the port

### Android

If your Android phone doesn't understand ".pem" certificates you will have to convert it to a ".crt".
Convert it with `openssl x509 -inform PEM -outform DER -in ca.pem -out ca.crt` on a system with openssl available.

To set up a WiFi proxy on your Android 6.0.1+ phone, follow these steps:

* Go to Settings > WiFi.
* Choose your WiFi network from the list.
* Select 'edit'
* Select 'Show advanced options'
* Under "Proxy," change the setting from None to Manual.
* Enter e.g. 10.0.1.3 as the proxy name.
* Enter 8081 as the port

There is currently a problem with some Android phones not accepting ca.pem or ca.crt certificated (Sony Z5 series on 6.0.1 has this problem).

The only way I have found to solve this problem is to install OpenSSL on your PC/Mac and use the above command to create a ca.crt.
Once created this needs transfering to the phone manually and then installed at Root acccess level. For this task I used [Root Certificate Manager](https://play.google.com/store/apps/details?id=net.jolivier.cert.Importer&hl=en_GB), this is quite easy, just launch the tool, it will ask for Super User prividges, accept them then use the browser to find your new ca.crt file.

## TODO

* Implement dashboard
* Implement lucky egg calculator
* Utilize fully javascript protobuf implementation
* Create Electron app

## Feature Requests/Suggestions

I'd love to hear what feature requests and suggestions you all have, so feel free to shoot me an email or open an issue.
