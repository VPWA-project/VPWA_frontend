# Semester project - application for text communication in IRC style (Slack)

## Assignment
Create a progressive IRC (Slack) style text communication web application that comprehensively addresses the use cases defined below.

**The application must implement the following use cases:**

1. user registration, login and logout
   * the user has a first and last name, nickname and email
2. the user sees a list of channels in which he is a member
   * when you leave the channel or are permanently kicked out of the channel, the given channel is removed from the list
   * when invited to the channel, the given channel is highlighted and topped
   * in the list, through the user interface, the channel can be created, left, and if you are the administrator it can be also canceled
   * two types of channels - private channel and public channel
   * the channel administrator is the user who created the channel
   * if the channel is not active (no new message is added) for more than 30 days, the channel ceases to exist (subsequently the channelName of the channel can be used for the "new" channel)
3. the user sends messages and commands through the "command line", which is a "fixed" element of the application. a user can post a message in a channel they are a member of
4. creation of a communication channel (channel) via the command line
    * any user can create a channel via the command /join channelName [private]
    * only the channel administrator can add/remove users to the private channel via the commands /invite nickName and /revoke nickName
    * any user can be added to the public channel via the command /join channelName (if the channel does not exist, it will be created automatically)
    * a member of the channel can invite another user to the public channel with the /invite nickName command
    * in a public channel, a member can "kick" another member with the command /kick nickName. if at least 3 members do so, the user has a "permanent" ban for the given channel. the administrator can kick the user "permanently" at any time with the /kick nickName command, or on the contrary "restore" the user's access to the channel via the /invite command
    * nickName as well as channelName are unique
    * the administrator can close/cancel the channel with the /quit command
5. the user can cancel his membership in the channel with the /cancel command, if the channel administrator does this, the channel will disappear
6. a message in the channel can be addressed to a specific user via the @nickname command
    * the message is highlighted to that user in the message list
7. user can view complete message history
    * effective infinite scroll
8. the user is informed about each new message through a notification
    * the notification is issued only if the application is not in the "visible" state (see quasar doc App Visibility)
    * the notification contains a part of the message and the sender
    * the user can set himself to receive notifications only for messages addressed to him
9. the user can set the status (online, DND, offline)
    * status is displayed to the user
    * if DND status is set, notifications do not come
    * if the offline status is set, the user does not receive messages, after switching to online channels are automatically updated
10. the user can view the list of channel members (if he is also a channel member) with the /list command
11. if the user has one of the channels active (located in the message window for the given channel), he sees in the status bar information about who is currently writing the message (e.g. Ed is typing)
    * after clicking on the nickName, you can see the detailed text in real time, before the sender sends it (every change is visible)

## Technologies
   * Frontend - [Quasar](https://quasar.dev/)
   * Backend - [Adonis](https://adonisjs.com/)
   * Database - PostgreSQL

## Getting Started
  Instructions are provided [here](https://github.com/VPWA-project/build).
