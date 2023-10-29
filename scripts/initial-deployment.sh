# /bin/bash

echo "***** INSTALLING DEPENDENCIES *****"
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
apt-cache policy docker-ce
sudo apt install docker-ce
mkdir -p ~/.docker/cli-plugins/
curl -SL https://github.com/docker/compose/releases/download/v2.3.3/docker-compose-linux-x86_64 -o ~/.docker/cli-plugins/docker-compose
chmod +x ~/.docker/cli-plugins/docker-compose
docker compose version

# git clone https://github.com/shurlz/gm-epl.git

cd ../ # back to the root directory which contains the docker compose file

if [! -f "docker-compose.yml"]
then
    echo "docker compose file not found"
else
    sudo docker compose up -d
    echo "***** SERVER RUNNING SUCCESSFULLY *****"
fi