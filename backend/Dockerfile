FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./backend/

# Copy .env file
COPY .env ./backend/

# Set environment variables
ENV PORT=5000
ENV MONGO_URI=mongodb+srv://ashugupta1403:MbPkMH9tOcnqXK7a@cluster0.fi7cx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
ENV UPSTASH_REDIS_URL=redis://default:ATiXAAIjcDE0ZjM0OGE5YWFjZDQ0OWYzYWQ1N2M2MjQwOWNlZmYwOHAxMA@apt-frog-14487.upstash.io:6379
ENV JWT_SECRET=7b2vndfndin
ENV REFRESH_JWT_SECRET=7b2bnfubjv
ENV CLOUDINARY_CLOUD_NAME=dy7c1mbue
ENV CLOUDINARY_API_KEY=466572665278947
ENV CLOUDINARY_API_SECRET=Sa3-vWSkijZX6_YgkjAjsa13fTM
ENV STRIPE_SECRET_KEY=sk_test_51QcmyQBGoINbEbNvJGFmHgG8qnd8dxHec8pkXup9bujONHFtF2wg12WywJO2bgbTCu3Kpe8VKH6LaQquyB7OlmFE00QvScA3oY
ENV CLIENT_URL=http://localhost:5173

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "start"] 