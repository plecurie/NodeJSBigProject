FROM ubuntu

RUN apt-get update && apt-get install -y wget && \
    apt-get install -y git && \
    wget -O /usr/local/bin/gitlab-runner https://gitlab-ci-multi-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-ci-multi-runner-linux-amd64 && \
    chmod +x /usr/local/bin/gitlab-runner

CMD gitlab-runner register \
    	-u http://gitlab/ci \
    	-r rSyUTfHxLL_qP7nYSfvA \
    	-n \
    	--executor shell \
    	--tag-list "deploy,staging,production"\
    	--name "Deploy Runner" && \
    gitlab-runner install --user=root --working-directory=/root && \
    gitlab-runner start && \
    tail -f /var/log/dpkg.log