# !/bin/bash
WoRK_PATH = '/usr/probject/dockerWebhook'
cd $WoRK_PATH
echo "先清除老代码"
git reset --hard origin/master
git clean -f
echo "拉取最新代码"
git pull origin master
echo "开始执行构建"
docker build -t docker-webhook:1.0 .
echo "停止并删除旧容器"
docker stop vue-back-container
docker rm  vue-back-container
echo "启动新容器,服务器端口和容器端口进行映射 -d后台运行 :1.0版本号"
docker container run -p 3000:3000 -name vue-back-container  -d docker-webhook:1.0

