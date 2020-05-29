FROM node

RUN wget -O /usr/local/bin/gitlab-runner https://gitlab-ci-multi-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-ci-multi-runner-linux-amd64 && \
    chmod +x /usr/local/bin/gitlab-runner && \
    useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash

CMD npm install -g typescript && \
	npm install -g tslint && \
	gitlab-runner register \
    	-u https://gitlab.com/ \
    	-r acUs6yM-ZooML1t5L4s2 \
    	-n \
    	--executor shell \
    	--tag-list "typescript,tslint"\
    	--name "TSLint Runner" && \
    gitlab-runner install --user=gitlab-runner --working-directory=/home/gitlab-runner && \
    gitlab-runner start && \
    tail -f /var/log/dpkg.log