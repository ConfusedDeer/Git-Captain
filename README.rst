
.. image:: public/images/titaniccaptainMedium.png
  :width: 400
  :align: center
  :alt: Alternative text



Git-Captain: A easy to use site that facilitates working with numerous GitHub repositories.
##########################################################################################################

Git-Captain is a Node.js powered site that came about as a solution and time-saver for frustrated developers having to work with numerous GitHub repositories in support of the same project.

It's primary goal was to facilitate the creation of the same named branch across multiple repositories but has grown to allow a few more features. It works well for teams running TeamCity and GitFlow, which require repositories to have same named branches. 

Git Captain can also serve as a great starting point for Node.js beginners and the steps laid out in the setup are specifically explicit to allow newbies to setup and run their first Node.js projects.




.. contents::

.. section-numbering::




Main features
=============

* Create New Branches
* Cleanup Existing Branches
* Find Branches
* Find Open Pull Requests

Create New oAuth App in GitHub
==============================

1. Login to GitHub

2. In your profile settings page, click Developer Settings

3. In OAuth Apps, click “New OAuth App”

4. Application Name (whatever you like)

5. Homepage URL:
    a. IP address of your box. For Example: https://myawsbox.com or https://10.40.15.57)

6. Authorization call ball URL:
    a. This is the callback URL were users will be redirected back to after GitHub authorizes your users.
    b. You will use the authenticated.html page as the landing point after the user logs into GitHub.
       Example: https://myawsbox.com/authenticated.html or https://10.40.15.57/authenticated.html

7. Click the “Register application” button.

8. Notice the “Client ID” and “Client Secret” and jot them down. You will need both in your node.js server.

Windows Server Installation
===========================
The Following steps are to prevent having to transfer a large node_Modules directory from your DEV box to the Windows Server box.

Install Git for Windows
-----------------------
1. Navigate to the Git Windows download URL: https://git-scm.com/download/win

2. Execute the installer that was downloaded, click Run, and finish the "Git for Windows" install.


Download and Install Node.js
----------------------------

    a. Download and install Node.js from https://nodejs.org/en/download/
    b. For a Windows Server you want the "Windows Installer (.msi)" (example: v10.15.0-x64.msi or newer)
    c. Run the installer and install in the default location. Once the Node.js installer is complete, open a command prompt and type in ``node --version`` and you should see the node version installed, otherwise verify you have downloaded the correct installer and re-install.
    d. Do a npm -v and you should see the NPM version installed.


Clone the Git-Captain Project repository
----------------------------------------
    a. Open a command line and run 'git clone https://github.com/ConfusedDeer/Git-Captain.git' to clone the 'Git-Captain' repo.
    b. Unzip and drop the content contents of folder into your windows server 'C:\\' drive. (You don't need the top-level folder)
    c. If you downloaded the repo make sure it's named 'Git-Captain' (Not 'Git-Captain-Master'), otherwise rename it to 'Git-Captain'.
    d. You should have a folder named 'Git-Captain' with a 'controllers and 'public' folders with several files.
    
Update the client-side endpoint and config.js
---------------------------------------------------------
    a. In 'Git-Captain\\public\\js\\tools.js', upate line 1 constant named 'gitPortEndPoint' value to the domain or IP address of you Node.js server. For example: ``const gitPortEndPoint = 'https://awsMyserver.com';``
    b. In 'Git-Captain\\controllers\\config.js', upate the 'config.gitHub.orgName' value to either the organization name or your GitHub username. If more than one user will access Git-Captain, then you need to create an organization in Github. 
    c. In 'Git-Captain\\controllers\\config.js', update the config.web.gitCaptainTimeOutInMinutes if you want to change the Git-Captain timeout.

Installing NPM
--------------
1. Go to the 'Git-Captain' directory and in a CMD console execute ``npm install npm-install -g``.

2. Go to the main 'Git-Captain' directory where the 'package.json' file is located and in a command window run `npm install`, so the required node modules can be downloaded. You should notice there is now a node_modules directory.

3. Verify there is a node_modules and contents in the 'Git-Captain' directory.


Create a self-signed certificate (For SSL/HTTPS)
------------------------------------------------
    a. We need to create a self-signed certificate that we will use to secure communication between our client and Node.js Server.

    b. It's important to note, since this is a self-signed certificate, thus any user that accesses the site will receive a warning stating the site is not secure.

    c. The warning occurs because most modern browsers require a certificate to be issued and signed from a Certificate Authority (CA).

    d. If you don't want this security warning to occur, purchase a CA signed and issued certificate.

    e. Install OpenSSL: Windows Installer. I use the "OpenSSL v1.1.1a Light" MSI (Experimental) the following site: https://slproweb.com/products/Win32OpenSSL.html

    f. Once OpenSSL is installed, find the OpenSSL BIN directory (example: C:\\Program Files\\OpenSSL-Win64\\bin) and in an ADMINISTRATOR CMD line, run the following command: ``openssl req -nodes -new -x509 -keyout theKey.key -out theCert.cert`` and it will prompt with various questions to create your SSL key and certificate. Once the questions are complete, you should have now two new files 'theCert.cert' and 'theKey.key' in your bin directory (C:\\Program Files\\OpenSSL-Win64\\bin).

    g. Copy the 'theKey.key' and 'theCert.cert' files to your ``C:\Git-Captain\controllers`` directory.

Create a .env file (DO NOT COMMIT THIS FILE!)
----------------------------------------------

1. Create a new file named ".env" with no file name and just the extension.  

2. In the ".env" file add the following lines:

| Example: 
| 
|   client_secret=[Your GitHub client secret] 
|   client_id=[Your GitHub client ID]
|   privateKeyPath=[name and location of SSL key]
|   certificatePath =[name and location of SSL cert]
| 
| 
| Here's an example of how your file will look like: 
| 
|   client_secret=3arg1a6889b113d206t68197z88z5488eeaq6967 
|   client_id=g1e6187c5g1gt691g8b4 
|   privateKeyPath=./theKey.key
|   certificatePath =./theCert.cert
|
|

3. Place the ".env" file in the ``Git-Captain\controllers`` directory.

Do a basic test of server.js
----------------------------
   
1. Go to the 'Git-Captain\\Controllers' directory and execute ``node server.js``.

    You should see ``http server listening on port 3000``.
    
    If you do NOT see ``http server listening on port 3000``, verify that all required modules listed in the 'Git-Captain\\package.json' file exist in the 'Git-Captain\\node_modules' directory. Look over the previous steps to make sure you didn't miss anything.
    
      
2. In the console window execute a ``CTRL+C`` to kill the node process.

Install Forever
---------------

1. To keep the node process running in the background or in case of app crash, I highly recommend installing FOREVER: https://www.npmjs.com/package/forever by going to 'Git-Captain' directory and executing ``npm install forever -g``. 

2. Once 'forever' is installed, execute a ``forever --version`` to verify installation.

3. Go to the 'Git-Captain\\controllers' directory and execute ``forever start server.js`` and you should see 'http server listening on port 3000'.

4. In the CMD windows execute ``taskmgr`` and verify node.exe is running or you can do a ``forever list``

5. Close the CMD window and open Chrome browser to 'https://localhost:3000/' and you should see an index page for 'Git-Captain' with a login button.

6. open the CMD window and type in ``forever stopall`` and do a ``forever list`` to verify there are no forever processes running.

Install uglify-es and clean-css
-------------------------------
1. Go to the 'Git-Captain' directory and execute the following command ``npm install uglify-es -g`` to install uglify-es, which we will use to minify JavaScript file(s).
2. While in 'Git-Captain' directory, execute the following command ``npm install clean-css-cli -g`` to install clean-css, which we will use to minify css file(s).

Setup Script to auto restart server.js if server is rebooted (Task Scheduler)
-----------------------------------------------------------------------------

1a. If Git-Captain is located somewhere other than C:\\Git-Captain, then you will need to update 'nodeStartupDEV.bat', 'nodeStartupPROD.bat', and 'nodeStopAll.bat' files to update the location. Do not update the scripts to point to simply point to current directory '.\\', which will work when executed manually, but fail in the windows task scheduler.

1b. In Windows find and open 'Task Scheduler' program.
   
2. Click "Create Task".
   
3. Name the task whatever you desire (ex. "Startup Git-Captain after box reboot").
   
4. Push the radio button for "Run whether user is logged on or not."
   
5. Checkmark "Run with the highest privileges".
   
6. Checkmark "Hidden".
   
7. In "Configure for:" select your server OS (ex. "Windows Server 2012 R2").
   
8. Select the 'Triggers' tab and press the 'New...' button and the "New Trigger" window should appear.
   
9. In "Begin the task:" dropdown field select "At startup", verify the 'Enabled' checkbox is checked, and click the OK button.
   
10. Select the 'Actions' tab and press the 'New..' button, leave the action as "Start a program". Click the 'Browse...' button to locate  the 'nodeStartupPROD.bat' file and select it. 
   
11. The 'Program/script:' field should now be populated with 'nodeStartupPROD.bat'. Click the 'OK' button.
   
12. Select the 'Conditions' tab and under 'Power' category, uncheck the "Stop if the computer switches to battery power" and uncheck the "Start the task only if the computer is on AC power". 
   
13. Select the 'Settings' tab and uncheck "Stop the task if it runs longer than:" and uncheck "If the running task does not end when requested, force it to stop" and verify only the "Allow task to be run on demand" is checked. 
   
14. Verify under "if the task is already running, then the following rule applies:" the select box is set to "Do not start a new instance".
   
15. Click OK button (Windows may prompt for credentials).
   
16. Verify "Startup Git-Captain after box reboot” (or whatever you named it) is listed in the grid.
   
17. Reboot or turn off/on your Windows Server. Once server is running, open browser and go to 'localhost:3000'. Verify you get the Git-Captain login.

Open port 3000 and port 443 to allow calls through firewall
----------------------------------------------
1. Open "Windows Firewall with Advanced Security" application.
   
2. Select 'Inbound Rules' and add a new rule. Select Port and for specific local ports enter in port 3000 and click the 'Next' button. Verify 'Allow the connection' radio button is pushed and click the 'Next' button. Leve all three checkboxes checked and click the 'Next' button once again. Name the rule (ex. "Port3000 Inbound") and click the 'Finish' button.
   
3. Select 'Outbound Rules' and add a new rule. Select Port and for specific local ports enter in port 3000 and click the 'Next' button. push the 'Allow the connection' radio button and click the 'Next' button. Leve all three checkboxes checked and click the 'Next' button once again. Name the rule (ex. "Port3000 Outbound") and click the 'Finish' button.
   
4. Verify that a rule already exists (if not add it) to allow ALL traffic, inbound and outbound for port 443 (the standard Windows Server port 80 and 443 rule is too restrictive).

5. Go to a browser on another box (not in the server) and go to https[URL for the server or name of the server] followed by port 3000 (ex. https://10.50.16.58:3000 or https://AWSserver.com:3000 ). 
 

Forward all calls to port 443 to port 3000 using windows Netsh
--------------------------------------------------------------
    Prerequisite: IPv6 must be installed. 
    You can verify if IPv6 is installed by opening network and sharing,
    clicking on your connection, properties, and verifying if "Internet Protocol Version 6 (TCP/IPv6) is check-marked.
    
1. We will user three basic commands using Netsh to allow us to ADD, DELETE, or DISPLAY a list of port-forwarding rules.
   
      For example: 
          To ADD a rule: 
          netsh interface portproxy add v4tov4 listenport=443 listenaddress=10.50.16.58 connectport=3000  connectaddress=10.50.16.58
          
          To DELETE a rule: 
          netsh interface portproxy delete v4tov4 listenport=443 listenaddress=10.50.16.58
          
          to DISPLAY all current rules: 
          netsh interface portproxy show all
    
2. Open an administrator command prompt window and type in ``ipconfig`` and get your IPv4 Address, which we will need to setup port forwarding.
   
3. We need to add a rule to forward all calls to port 443 to port 3000, which our Node.js server is monitoring.
   
4. In the command line with administrative privileges, run the following command to add a port forwarding rule for forwarding all calls to port 443 to port 3000. Substitute [your IPv4 Address] with your address from the previous step: ``netsh interface portproxy add v4tov4 listenport=443 listenaddress=[your IPv4 Address] connectport=3000 connectaddress=[your IPv4 Address]``.
   
5. Run the ``netsh interface portproxy show all`` command to view all current rules and verify your rule is listed. "Listen on..." should be port 443 and 'Connect to..." should be port 3000.
   
6. If you made a mistake, delete the rule and add it once again using the delete and add commands in previous step.
   
7. Open Windows Services, find "IP Helper", look at the properties, set the "Startup type:" to 'Automatic', click 'Start', and click the 'OK' button.  Open windows Task Manager and go to the services tab, find the service named 'iphlpsvc' (description: "IP Helper") and verify it's running. For the port-forwarding to work the iphlpsvc must be running.
   
8. Open a browser window INSIDE your server and type in [your IPv4 Address] in the URL (without 3000) and your port 443 call should automatically be forwarded to port 3000, thus displaying the Git-Captain login page, which confirms the netsh command to forward all port 443 calls to port 3000.

9. Open a browser window OUTSIDE your server, type in [your IPv4 Address] in the URL (without 3000) and your port 443 call should automatically be forwarded to port 3000, thus displaying the Git-Captain login page. If your page displays within your server and NOT outside your server then go back to the Windows Firewall and verify you have configured it correctly.



Linux Server Installation
=========================
(Coming Soon).



User support
============
(coming soon).





License
=======
This project is licensed under the MIT License - see the `LICENSE.md <https://github.com/ConfusedDeer/Git-Captain/blob/master/LICENSE>`_ file for details,

Built With
==========
* `Node.js <https://nodejs.org/en/>`_ — The run-time environment used. 
* `GitHub API <https://developer.github.com/>`_ — Used to integrate with Github.
* `Express <https://expressjs.com/>`_ — Node.js framework.
* `NPM <https://www.npmjs.com/>`_ — Package Manager for JavaScript.

Authors
=======
* `ConfusedDeer <https://github.com/ConfusedDeer>`_ — created Git-Captain.

Contributions and Special Thanks
================================
* `j4p4n <https://openclipart.org/detail/282062/titanic-captain>`_ — For the "Titanic Captain" image, which is obtained from `openclipart.org <https://openclipart.org>`_  and used freely under the `Creative Commons Zero 1.0 License <https://creativecommons.org/publicdomain/zero/1.0/>`_

* `CrunchyFerrett <https://github.com/CrunchyFerrett>`_ — For help with the early stages of front-end creation.

* `Shining Light Productions <https://slproweb.com/products/Win32OpenSSL.html>`_ — For the OpenSSL MSI installer.

Possible future updates
=======================
1) Linux steps
2) Forward calls to port 80 http://myserver.com to port 443 https://myserver.com.
3) Hide extensions from URL, for example authenticated.html
