#!/bin/bash

ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no root@47.240.77.251 -t "cd /root && rm -rf ebook && git clone https://github.com/sky-builder/ebook.git && cd ebook && npm i && /root/.nvm/versions/node/v10.16.3/bin/pm2 restart index && echo done"

