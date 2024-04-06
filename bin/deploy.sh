#!/bin/bash

rsync -avz build/ -e ssh --exclude log ubuntu@metamolecular.com:/var/www/depth-first.com