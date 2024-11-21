# Project-SESAPZG-504-569
Hi All,  I am Antony Ashwin (2023sl93002). I am currently completing my 3rd semester of M.Tech in Software Engineering through the Work Integrated Learning program at BITS Pilani. This is my combined final project assignment for the courses 24_SESAPZG504 and 24_SESAPZG569.


HOW TO LOCALLY RUN IT 

1. Clone this repo 
2. Get the .env file from me or you can just make one yourself (please put the .env at the root level)
    PORT=8080
    MONGO_URI= <mongodb uri to connect to the cluster>
    JWT_SECRET= <your jwt secret key>
3. npm i - will install all dependencies for both frontend and backend (i have updared the package.json to have a cd and run npm i again in frontend), you might have to instal jsonwebtoken again if that error comes up when running - not sure why
4. npm start - will run both frontend and backend because of the script in package.json (to individually run them just npm start at root for backend, cd inside frontend and npm start to run the frontend)
5. 
   . if mongouri is undefined error then you probably didnt set the .env file in the right directory or you have a typo in there
   
   . please use your own mongouri to see the db changes \n
   
   . if port error then you probably have that port being used somewhere, please use npx kill-port <port-number> to kill that port.
   
   . if all works fine then the UI should load on your browser on its own (or maybe its only for vscode not sure)




