# Käytetään virallista Node.js -kuvaa
FROM node:18-alpine

# Työhakemisto
WORKDIR /app

# Kopioidaan package.json ja package-lock.json
COPY package*.json ./

# Asennetaan riippuvuudet
RUN npm install

# Kopioidaan kaikki projektitiedostot
COPY . .

# Avoin portti
EXPOSE 5000

# Ajetaan palvelin
CMD ["npm", "run", "dev"]

