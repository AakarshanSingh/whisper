
# Whisper

A chat application.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`

`MONGO_DB_URI`

`JWT_SECRET`

`CLOUD_NAME` 

`API_KEY`

`API_SECRET`

## Getting the project

Clone the project

```bash
  git clone https://github.com/AakarshanSingh/whisper.git
```

Go to the project directory

```bash
  cd whisper
```

## Run Locally Manually

Install dependencies for server

```bash
  cd server && npm install
```

Start the server

```bash
  npm start 
```

Install dependencies for client side

```bash
  cd client && npm install
```

Start the frontend

```bash
  npm run dev 
```
## Run Locally with Docker

### Executable permission
```
chmod +x setup.sh
```

### Starting containers
```
./setup
```

### Rebuilding images and restart
```
./setup build
```
### Stopping containers
```
./setup stop
```


## Additional Instructions
- Consider excluding mongoexpress from the Docker Compose configuration if a web interface for your database isn't necessary.
- If an external MongoDB link has been incorporated into the .env file, you may remove mongodb from the Docker Compose setup.
- Ensure that the target path for `/api` in `client/vite.config.js` is adjusted appropriately if Docker isn't utilized, with your project's deployment specifications.
