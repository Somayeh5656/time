# Käytetään virallista Node.js -kuvaa
FROM node:20-alpine

# Työhakemisto
WORKDIR /app

# Kopioidaan package.json ja package-lock.json
COPY package*.json ./

# Asennetaan riippuvuudet
RUN npm install

# Kopioidaan kaikki projektitiedostot
COPY . .

# Rakennetaan Vite-sovellus
RUN npm run build

# Avoin portti
EXPOSE 3000

# Ajetaan Vite-sovellus
CMD ["npm", "run", "dev"]
