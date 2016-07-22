# Pokemon GO Optimizer
In Pokemon GO, each Pokemon has hidden values that determine its maximum attainable HP and CP known as individual values — or IVs for short. The goal of this project is to display these hidden values to the user as painlessly as possible, while giving insight into each Pokemon's combat abilities.

While this app is relatively undetectable, if Niantic contacts me and requests that I discontinue development, I will comply. Until then, please be aware that you are using this at your own risk.

![example](http://i.imgur.com/3V8xw1G.png)

# Host Setup

### Mac OSX

Run these commands:

```
brew install node
brew install git
brew install --devel protobuf
npm install -g bower
git clone https://github.com/justinleewells/pogo-optimizer
cd pogo-optimizer
npm install
bower install
node index
```

### RPM-based Linux (Fedora, CentOS, RHEL)

Run these commands:

```
sudo dnf install nodejs protobuf protobuf-devel npm
sudo npm install -g bower
git clone https://github.com/justinleewells/pogo-optimizer
cd pogo-optimizer
npm install
bower install
node index
```

Now you should have a webserver running. Make sure your phone and computer are connected to the same wireless network.

## Phone Setup

Next, check your network settings for your internal ip address.
If your host computer's IP is 10.0.1.3, you'll add 10.0.1.3:8081 as a proxy on your phone.

Next, visit http://10.0.1.3:3000/ca.pem and install the certificate.

After accepting the certificate, open Pokemon GO on your phone. After you can see your character walking around, go to localhost:3000 on your host machine. Enjoy.

## iOS

To set up a WiFi proxy on your iOS 9.0.0+ phone, follow these steps:

* Go to Settings > Wi-Fi
* Click the information icon beside the network you are connected to
* Select 'Manual' in the HTTP Proxy settings at the bottom
* Enter e.g. 10.0.1.3 as the server
* Enter 8081 as the port

### Android

If your Android doesn't understands ".pem" certificates you will have to convert it to a ".crt".
Convert it with `openssl x509 -inform PEM -outform DER -in ca.pem -out ca.crt` on a system with openssl available.

To set up a WiFi proxy on your Android 6.0.1+ phone, follow these steps:

* Go to Settings > WiFi.
* Choose your WiFi network from the list.
* Select 'edit'
* Select 'Show advanced options'
* Under "Proxy," change the setting from None to Manual.
* Enter e.g. 10.0.1.3 as the proxy name.
* Enter 8081 as the port

## A Note About Windows
Currently, it is very difficult to get this program working on Windows. Until a fully javascript implementation of protobuf can be utilized, Windows support will not be provided. Until then, the recommended solution is Docker, which we will provide documentation for shortly.

## TODO

* Display more information (level, dust efficiency, optimal moves, etc)
* Improve user experience
* Utilize fully javascript protobuf implementation
* Create Electron app

## Feature Requests/Suggestions

I'd love to hear what feature requests and suggestions you all have, so feel free to shoot me an email or open an issue.