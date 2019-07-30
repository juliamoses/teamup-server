# Team Up: Local Server

## Description
This is half of the Team Up project. The other half--the local server--can be found [here](https://github.com/thomas-boyer/team-up-remote).

---

Team Up is a combination of software that allows teams to upload files faster.

## Pix

!["Homepage"](https://github.com/thomas-boyer/team-up-remote/blob/master/docs/team-up-1.png)
!["Email verification"](https://github.com/thomas-boyer/team-up-remote/blob/master/docs/team-up-2.png)
!["File info"](https://github.com/thomas-boyer/team-up-remote/blob/master/docs/team-up-3.png)

## How it works

- A team member--the **sharer**-- has a large file that needs to be uploaded to the Internet.
- The **sharer** uses the [teamup-server](https://github.com/juliamoses/teamup-server) to split that file into smaller chunks and make those chunks available to other team members over their local area network. There is no limit to the number of team members the chunks can be shared with.
- The other team members--the **sharees**--download one chunk each over LAN.
- Once that download is finished, each **sharee** moves to a different network--whether it be their home or their local Starbucks.
- Each **sharee** visits the remote Team Up server, which is hosted on the Internet, and uploads their chunk.
- After each chunk is uploaded, the chunks are assembled to create the original file.
- The original file is now available to download.
- Due to the significant difference between LAN speeds and Internet upload speeds, this process can save huge amounts of time.



## Major Dependencies
**Server-side**
- cors
- Express
- Express-upload
- mkdirp
- mongodb
- split-file
- ws
- nginx

**Client-side**
- axios
- bootstrap
- js-file-download
- react
- ws

## Team Members
- [Julia Moses](https://github.com/juliamoses)
- [Thomas Boyer](https://github.com/thomas-boyer)
- [David Eastmond](https://github.com/davideastmond)
