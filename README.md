# aws-beanstalk-nodejs-websocketsproxy
node.js implementation of a Websockets proxy to TCP server for AWS Elastic Beanstalk

This is a super-simple app that uses node.js as a WebSockets to TCP proxy. In the settings.js, specify
the URL and the target server / port, and all packets inbound get sent to the TCP server, all packets
from the TCP server get sent to the client, and disconnect / error events are forwarded.
