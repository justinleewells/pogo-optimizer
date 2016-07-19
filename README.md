# Pokemon GO Optimizer
This tool shows you the IVs and information necessary to determine which Pokemon get ground into candy. Perfect for any trainer aspiring to be the very best.

## Setup
So, first of all, you need node.js. I've only tested this on Mac, so if you want to test it on other platforms, be my guest.

Run these commands:

```
npm install
bower install
node index
```
Now you should have a webserver running. Make sure your phone and computer are connected to the same wireless network.

Next, check your network settings for your internal ip address. Mine was 10.0.1.3. Since that was my internal ip address, I'm going to visit 10.0.1.3:3000/ca.pem to accept the certificate.

After accepting the certificate, open Pokemon GO on your phone. After you can see your character walking around, go to localhost:3000 on your laptop. Enjoy.