#!/bin/bash

set -x  # show commands being ran
set -e  # error if anything fails
set -o pipefail # error on pipe fails too

current_version=$(mvn -q -Dexec.executable=echo -Dexec.args='${project.version}' --non-recursive exec:exec)
image_name="ops0-artifactrepo1-0-prd.data.sfdc.net/docker-all/slackcrm/uisf-foyer:${current_version}"
image_name_escaped="ops0-artifactrepo1-0-prd.data.sfdc.net\/docker-all\/slackcrm\/uisf-foyer:${current_version}"

# re-configure docker and k8s to point to the correct version
sed -i '' "s/image:.*$/image: $image_name_escaped/" k8s/specs/foyer.yml
sed -i '' "s/uisf-foyer-[^ ]+/uisf-foyer-$curent_version.jar/" ./Dockerfile

# build the docker image
docker build -t "$image_name" -f ./Dockerfile .

echo "Starting the app with kubernetes"
pushd k8s/scripts/
# don't error if the cleanup script fails (because you may already be in a clean state)
./cleanup.sh || true
./start_app.sh

foyer_pod=$(kubectl describe pods -n uisf | grep 'Name.*uisf-foyer' | awk '{print $2}')

echo "Please manually verify the app via GET localhost:30006/manage/health"

kubectl wait -n uisf --for=condition=ready pods/$foyer_pod
kubectl logs -n uisf --follow $foyer_pod
