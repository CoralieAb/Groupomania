# Groupomania backend

## Backend setup

* Ouvrez un nouveau terminal, et dirigez-vous vers le dossier backend > ```cd backend```

* Installez les modules avec ```npm install```

* Créez une base de données et entrez les informations de celle-ci dans le bloc "development" du fichier config.json (backend/config/config.json)

* Dans le dossier backend/config/ , renommez le fichier auth-config-exemple.js en auth-config.js. Copiez-y la clé transmise pour signer les token JWT

* Dans votre terminal, lancez ```npx sequelize-cli db:migrate```puis ```npx sequelize-cli db:seed```

* Enfin, démarrez le serveur avec ```nodemon server```

(Pour le projet, j'ai volontairement laissé le fichier auth.config.js contenant la clé pour signer les JWT)