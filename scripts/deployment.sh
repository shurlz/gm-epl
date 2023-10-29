# /bin/bash
# provided you've ran initial-deployment.sh script before and have docker compose installed

sudo systemctl restart docker
if [! -d "gm-epl"]
then
    echo "code directory not found"
else
    cd gm-epl
    sudo docker compose down
    sudo docker compose up --build -d
    echo "***** SERVER RUNNING SUCCESSFULLY *****"
fi
