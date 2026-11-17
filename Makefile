.PHONY: install build start start-backend start-frontend develop

install:
	npm ci

build:
	npm run build

start:
	npm start

start-backend:
	npx start-server -s ./dist

start-frontend:
	npm run dev

develop:
	npm run build
	npm run develop
