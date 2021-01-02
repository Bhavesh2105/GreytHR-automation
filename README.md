# GreytHR-automation
This program requires **NodeJS** to run.
To download [click](https://nodejs.org/dist/v14.15.3/node-v14.15.3-x64.msi)

## HOW TO USE ?

- On first run you will need to install all the dependencies
```
npm i
```

- Next you need to store your greytHR username and password.

```
node index.js --user <Your Employee No> --password <Your Password>
```

- Then you can start the automation 
```
node index.js
```
Every time you turn on your computer you will require to use the above command to start the automation
Your employee no and password will be saved and can be changed by you using the *--user and --password* but both are needed to be provided simultaneously.

- It comes with a scheduler which signs you in at 9:00 AM and signs you out at 7:00 PM.

But if you miss the scheduler you can overwrite the scheduler by -

```
node index.js --late
```

If you are signed In and want to sign out earlier you can use the same command.
This command just overrides the scheduler by *signing you* in if you are *signed out* and vice versa.

## Thank you
