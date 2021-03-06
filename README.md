Helios
========

## Helios - The Exoplanetary Mission

Helios is a web app devoted to visualizing all currently discovered confirmed and candidate exoplanets in a beautiful and realistic 3d simulation. Helios aims to educate individuals of all ages about some of the most important and thought provoking research in Astronomy, finding new worlds like our own. It does so by exposing the individual to:

 - The diversity of exoplanets and exoplanetary systems
 - Demonstrating the processes by which these planets are discovered
 - Providing a sandbox to promote exploration and construction of your own systems under the mechanics that govern our universe.

### Overview

Helios is a rich web app using WebGL and Angularjs. While it is hosted on Google App Engine, Helios aims to be completely usable offline, and available in the form of a packaged app for both chrome and firefox.

### Contributing

You will need to set up the development environment first and foremost. This guide assumes you have already installed
 - Ruby, Python, Node
 - Yeoman, Grunt, Bower
 - Google App Engine Python SDK
 - VirtualEnv (VirtualEnvWrapper preferred) Pip

 To run Helios:
 Open Terminal > cd into Helios > enter command "grunt server"
 If you're using a VM and it is not capable of running Helios,
 try running it to your host machine over NAT. If you primarily use
 an ethernet connection and you are not able to port to your host
 computer, switch the VM connection type to Bridged Adapter.