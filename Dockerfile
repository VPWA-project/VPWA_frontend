# ----- BUILD STAGE -----
FROM node:lts as build-stage

# Aliases setup for container folders
ARG SRC="."
ARG DIST="/spa"

# Define arguments which can be overridden at build time
ARG API_URL="http://localhost:3333"

# Set the working directory inside the container to server module
WORKDIR ${DIST}

# Copying in two separate steps allows us to take advantage od cached Docker layers
COPY ${SRC}/package*.json ./

# Install dependencies
RUN npm install

# Copy source files inside container
COPY ${SRC} .

# Build the SPA
RUN npx @quasar/cli build -m spa

# ----- PRODUCTION STAGE -----
FROM node:lts as production-stage

# Aliases setup for container folders
ARG DIST="/spa"
ARG PWA="/myapp"

# Define environment variables for HTTP server
ENV HOST="0.0.0.0"
ENV PORT="8080"

# Set working directory
WORKDIR ${PWA}

# Copy build artifacts from previous stage

COPY --from=build-stage ${DIST}/dist/spa ./

# Expose port outside container
EXPOSE ${PORT}

# Install pm2
RUN npm install -g @quasar/cli

# Start server module inside the container
CMD ["quasar", "serve"]