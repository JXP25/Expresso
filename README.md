# IITISOC-24-WEB-18


![logo](https://github.com/Pradeep-Kumar-Rebbavarapu/IITISOC-24-WEB-18/assets/142983705/ac198c0c-92f0-4726-a6f0-54d28ec745f3)



# EXPRESSO CONNECT

### Dive in the world of AI, expresso provides a user-friendly interface to connecting with people by creating meeting rooms equipped with Expresso Intelligence. Expresso is designed in such a way that it is fully equipped to handle all your complicated tasks with it's extra ordinary functionalities that boost your productivity to next-level.

## Overview:

Expresso Intelligence is a pre-trained model that can recoganize your facial-expressions and based on that can overlay emoji's that perfectly depicts your mood. Imagine talking to your friend in which you can vibe together on-screen full of your favourite emojis based on your moods.

Expresso can handle all this in real-time with lowest possible latency which takes you in the expresso world where distance is just a number.

Along with that Expresso is well designed to boost your productivity, you can instantly invite your friends to the expresso room or can even schedule rooms with your friends. Expresso automatically sends a invitation to your selected friends and automatically adds the same room in upcoming meetings of friend's dashboard, saving a lot of time reading long messages and it ensures that you don't miss any room where people are waiting for you.

Expresso working on cloud security protects user's privacy at top.

Rooms in expresso can be made private or public in which people are specifically restricted to share unwanted audio and video and along with that waiting rooms adds a layer of security to room along with giving guests a personal space to prepare for the discussion.

To handle long awaits in waiting rooms, expresso provides some instant mini-games for participants which makes clock tick faster.

People can easily chat inside a expresso room which makes it easier to notify and communicate to whole room at once.

Each room created in expresso has a unique link to invite people without adding them to your friends making it easier to handle public participation along with the public room feature.

To become a member of expresso club, user can create a expresso account or can use google account to sign up to Expresso.

## Technology used:

React with typescipt and tailwind CSS

Python

Django

ML

WebRTC

WebSockets

Deployed with AWS

## To run on localHost:

### Backend:

## Using Docker

> cd backend/

> docker-compose up

Use python 11.9

open vs code terminal

> cd IITISOC-24-WEB-18/backend/

> Install dependencies

> docker run --rm -p 6379:6379 redis:7

press CTRL+Shift+P > search for Python: Create Environment (.venv) > follow the steps and select requirements.txt file > relaunch vs code > and then run migrations

> python3 manage.py makemigrations

> python manage.py migrate

> python manage.py runserver

and start server

### Frontend:

open another vs code terminal

> cd IITISOC-24-WEB-18/frontend/

> npm i

> npm run dev

### SFU Server:

open another vs code terminal

> cd server/

> docker-compose up

and run localhost

For deployment and production, refer to - https://github.com/Princekumarofficial/expresso-production - latest version of this repo

Color Pallette for VC-
#1E2640
#DC9750
#DC9750
#922C40
